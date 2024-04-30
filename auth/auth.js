
const express = require("express")
const User = require('../models/user');
const ClientReservation = require('../models/clients');
const Salle = require('../models/salle');
const Message = require('../models/message');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const jwtSecret = '3e0af86f8da1566079b4c9e3175f7f1e897455af4d74166dade7aa784d3ed958390828';

//----------- REGISTER & LOGIN ----------
exports.register = async (req, res, next) => {
  const { username, password } = req.body
  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Hash the password
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, role: user.role },
          jwtSecret,
          {
            expiresIn: maxAge, // 3hrs in sec
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3hrs in ms
        });
        res.status(201).json({
          message: "User successfully created",
          user: user._id,
        });
      })
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
};
exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Login not successful1",
        error: "User not found",
      });
    }

    // Compare the provided password with the stored hash
    bcrypt.compare(password, user.password).then(function (result) {
      if (result) {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, role: user.role },
          jwtSecret,
          {
            expiresIn: maxAge, // 3hrs in sec
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3hrs in ms
        });
        res.status(201).json({
          message: "User successfully Logged in",
          user: user._id,
        });
        console.log("User successfully Logged in", URL)
      } else {
        res.status(400).json({ message: "Login not succesful" });
      }
    });
  }
  catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};
//------------- USER MANIPULATION -------------
exports.update = async (req, res, next) => {
  const { role, id } = req.body;
  // First - Verifying if role and id is present
  if (!role || !id) { return res.status(400).json({ message: "Role and ID are required" }); }
  // Second - Verifying if the value of role is admin
  if (role !== "admin") { return res.status(400).json({ message: "Invalid role value" }); }
  // Finds the user with the id
  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    return res.status(400).json({ message: "An error occurred", error: error.message });
  }
  // Third - Verifies the user is not an admin
  if (user.role !== "user") { return res.status(400).json({ message: "User is already an admin" }); }
  // Updates the user's role to admin
  user.role = role;
  try {
    await user.save();
  } catch (error) {
    return res.status(400).json({ message: "An error occurred", error: error.message });
  }
  res.status(201).json({ message: "Update successful", user });
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.deleteOne({ _id: id });


    res.status(200).json({
      message: "User successfully deleted",
      user: user._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    const userFunction = users.map(user => {
      return {
        username: user.username,
        role: user.role
      };
    });
    res.status(200).json({ users: userFunction });
  } catch (err) {
    res.status(401).json({ message: "Not successful", error: err.message });
  }
};
//--------- RESERVATION MANIPULATION------------------
exports.reserver = async (req, res, next) => {
  try {
    const { name, surname, email, phoneNumber, numberOfPeople, materials, roomNumber, startDate, endDate, traitment } = req.body;

    console.log(name, surname, email, phoneNumber, numberOfPeople, materials, roomNumber, startDate, endDate, traitment);

    // Check if a reservation with the same roomNumber, startDate, and endDate already exists
    const existingReservation = await ClientReservation.findOne({
      roomNumber,
      startDate,
      endDate
    });

    if (existingReservation) {
      return res.status(400).json({ message: "Room is already reserved for the specified dates" });
      
    }

    // Check if the requested reservation overlaps with any existing reservations
    const overlappingReservations = await ClientReservation.find({
      roomNumber,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
        { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
        { startDate: { $gte: startDate }, endDate: { $lte: endDate } }
      ]
    });

    if (overlappingReservations.length > 0) {
      return res.status(400).json({ message: "The requested reservation overlaps with an existing reservation" });
    }

    const ClientReservation1 = await ClientReservation.create({ name, surname, email, phoneNumber, numberOfPeople, materials, startDate, endDate, roomNumber, traitment });
    console.log('Created ClientReservation:', ClientReservation1);
    res.json({ message: "ClientReservation successfully created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.showreservation = async (req, res, next) => {
  try {
    const reservations = await ClientReservation.find({});
    console.log('Retrieved ClientReservations:', reservations);
    res.json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.deleteReservation = async (req, res, next) => {
  
  const { email } = req.body;
  try {
    const existedReservation = await ClientReservation.findOne({ email });
    console.log(existedReservation); // Log the existedReservation object
    if (!existedReservation) {
      return res.status(404).json({
        message: "Client Reservation not found",
      });
    }
    console.log(existedReservation._id); // Log the existedReservation._id
    await ClientReservation.deleteOne({ _id: existedReservation._id });
    res.status(200).json({
      message: "Client Reservation successfully deleted",
      ClientReservation: existedReservation._id,
    });
  } catch (error) {
    console.error(error); // Log the error object
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};
//--------- SALLE  MANIPULATION ---------------
exports.createSalle = async (req, res, next) => {
  try {
    const { sallename, number, capacity, equipment, pricebyhour } = req.body;
    console.log(sallename, number, capacity, equipment, pricebyhour);
    const salle = new Salle({ sallename, number, capacity, equipment, pricebyhour });
    await salle.save();
    res.status(201).json({
      message: 'Salle created successfully',
      salle
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error creating salle',
      error: error.message
    });
  }
};
exports.deleteSalle = async (req, res, next) => {
  const { sallename } = req.body;
  try {
    const existedSalle = await Salle.findOne({ sallename });

    if (!existedSalle) {
      return res.status(404).json({
        message: "salle not found",
      });
    }

    await Salle.deleteOne({ _id: existedSalle._id });


    res.status(200).json({
      message: "Salle successfully deleted",
      Salle: Salle._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};
exports.updateSalle = async (req, res, next) => {
  let updatedSalle;
  try {

    const { sallename, salleId, number, capacity, equipment, pricebyhour } = req.body;
    const existedSalle = await Salle.findById(salleId);
    if (!existedSalle) {
      return res.status(404).json({
        message: 'Salle not found'
      });
    }
    if (sallename) { existedSalle.sallename = sallename; }
    if (number) { existedSalle.number = number; }
    if (capacity) { existedSalle.capacity = capacity; }
    if (equipment) { existedSalle.equipment = equipment; }
    if (pricebyhour) { existedSalle.pricebyhour = pricebyhour; }
    updatedSalle = await existedSalle.save();

    res.status(200).json({
      message: 'Salle updated successfully',
      updatedSalle

    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating salle',
      error: error.message
    });
  }
};
exports.getsalles = async (req, res, next) => {
  try {
    const Salles = await Salle.find({});
    const SallesFunction = Salles.map(Salle => {
      const container = {};
      container.name = Salle.name;
      container.number = Salle.number;
      container.capacity = Salle.capacity;
      container.equipment = Salle.equipment;
      container.pricebyhour = Salle.pricebyhour;
      return container;
    });
    res.status(200).json({ Salles: SallesFunction });
  
  } catch (err) {
    res.status(401).json({ message: "Not successful", error: err.message });
  }
};
exports.showsalles = async (req, res, next) => {
  try {
    const salles = await Salle.find({});
    const sallesData = salles.map(salle => {
      return {
        sallename: salle.sallename,
        number: salle.number,
        capacity: salle.capacity,
        equipment: salle.equipment,
        pricebyhour: salle.pricebyhour
      };
    });
    res.status(200).json({ salles: sallesData });
    console.log("you requested the showcase of salles");

  } catch (err) {
    res.status(401).json({ message: "Not successful", error: err.message });
    console.log("there is a problem in  showcase of salles");
  }
};

//---------MESSAGE MANIPULATION ---------
exports.messages = async (req, res, next) => {
  try {
    console.log('Request received');
    console.log(req.body);
    const { name, email, message } = req.body;
    console.log(name);
    console.log(email);
    console.log(message);
    await Message.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      message: 'message1 created successfully',

    });
    console.log("youh have recived a message in you database");
  } catch (error) {
    console.log("youh have tried to send a message");
    res.status(500).json({
      message: 'Error1 creating message',
      error: error.message
    });
  }
};
exports.showMessages = async (req, res, next) => {
  try {
    const Messages = await Message.find({});
    console.log('Retrieved Salles:', Messages);
    res.json(Messages);
    console.log("youh have requested to show a message");

  } catch (error) {
    console.log("youh have requested to show a message but vaild ");
    res.status(400).json({ message: error.message });
  }
};