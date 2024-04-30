const express = require("express")
const router = express.Router()
const { register , login , showMessages , showreservation ,messages
     , update , showsalles , deleteUser , getUsers , createSalle
      , reserver , deleteSalle , updateSalle ,deleteReservation  , getsalles } = require("./auth")
const { adminAuth } = require("../middelware/auth")
//-----user ------
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/reserver").post(reserver);
router.route("/deleteReservation").delete(deleteReservation);
router.route("/messages").post(messages);



//------admin------
router.route("/admin").post(adminAuth, login);
router.route("/update").put( update);
router.route("/deleteUser").delete( deleteUser);
router.route("/getUsers").get(getUsers);
router.route("/message").get(showMessages);
router.route("/showreservation").get(showreservation);
router.route("/showsalles").get(showsalles);




//---------- salle manipulation only on the admin dashbord -------
router.route("/deleteSalle").delete(deleteSalle);
router.route("/updateSalle").put( updateSalle);
router.route("/createSalle").post(createSalle);
router.route("/getsalles").get(getsalles);


//-----


const cookieParser = require("cookie-parser")
router.use(cookieParser())




//router.route("/update").put(adminAuth, update)
//router.route("/deleteUser").delete(adminAuth, deleteUser)

module.exports = router;