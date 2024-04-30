const express = require("express");
const mongoose = require('mongoose');

const app = express();

const cookieParser = require("cookie-parser");


const { adminAuth, userAuth } = require("./middelware/auth.js");
const bodyParser = require('body-parser');
app.use(express.json())// Express middleware function that will grant access to the user's data from the body.
app.use("/api/auth", require("./auth/route"))//import your route.js file as middleware in server.js
app.use(cookieParser());


const images = [
    '/Views/im/salle1.jpg',
    '/Views/im/salle1.jpg',
    '/Views/im/salle1.jpg',
    '/Views/im/salle1.jpg',
    '/Views/im/salle1.jpg',
    '/Views/im/salle1.jpg',
    '/Views/im/salle1.jpg',
    '/Views/im/salle1.jpg',
   
  ];



app.get("/register", (req, res) => res.render("pages/register", {
    
    title: "register"
}));
app.get("/login", (req, res) => res.render("pages/login", {
    
    title: "login"
}));
app.get("/home", (req, res) => res.render("pages/home", {
    
    title: "home"
}));


//app.get("/getUsers",  (req, res) => res.render("getUsers"));
//app.get("/basic", userAuth, (req, res) => res.render("user",{
 //   title: "user"


//}));
app.get("/admin",(req, res) => res.render("pages/admin", {
    title: "admin"
}));


app.get("/reserver", (req, res) => res.render("pages/reserver", {
    title:"reserver"
}));
app.get("/NosSalle", (req, res) => res.render("pages/NosSalle", {
    title:"NosSalle"
}));
app.get("/message", (req, res) => res.render("pages/message", {
    title:"Messages"
}));





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");//setting EJS as the Express app view engine.Express will look inside of a views folder

PORT=5000;
const MONGODB_URI = "mongodb+srv://baccarmahdi09:mahdi157@cluster0.yg0cuxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(MONGODB_URI , {
    dbName: "reservini",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(()=>{
    console.log('connected to MongoDb');
    app.listen(PORT,()=>{
        console.log(`server listening on ${PORT}`)
    })
}).catch((err) =>{
    console.error('Error connecting to mongodb:',err.message)
})
module.exports = app;