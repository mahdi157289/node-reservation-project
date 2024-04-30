const jwt = require("jsonwebtoken");
const jwtSecret =
  "3e0af86f8da1566079b4c9e3175f7f1e897455af4d74166dade7aa784d3ed958390828";
  exports.adminAuth = (req, res, next) => {
    console.log('req.headers:', req.headers);
    const token = req.header('Authorization');
    console.log('token:', token);
   
  
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        console.log('decodedToken:', decodedToken);
        if (err) {
          return res.status(401).json({ message: "Not authorized1" });
        } else {
          if (decodedToken.role !== "admin") {
            return res.status(401).json({ message: "Not authorized2" });
          } else {
            next();
          }
        }
      });
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" });
    }
  };
exports.userAuth = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('token:', token);
    if (token) {
      jwt.verify(token, jwtSecret  , (err, decodedToken) => {
        console.log('decodedToken:', decodedToken);
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "Basic") {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  };