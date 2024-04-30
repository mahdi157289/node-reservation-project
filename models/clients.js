const Mongoose = require("mongoose");
const ClientSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
       
  },
  phoneNumber: {
    type: String,

  },
  numberOfPeople: {
    type: Number,
    required: true,
  },
  materials: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },  
  endDate: {
    type: Date,
    required: true,
  },
  roomNumber: {
    type: Number,
    required: true,
  },
  traitment: {
    type: String,
    required: true,
  },
});

// Create a Mongoose model using the ClientSchema
const ClientReservation = Mongoose.model("clients", ClientSchema);
console.log("modelswork");
// Export the model
module.exports = ClientReservation;