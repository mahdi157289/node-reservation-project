const Mongoose = require("mongoose");
const MessageSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  message: {
    type: String,
    required: true,
    
  }
});

// Create a Mongoose model using the ClientSchema
const Message = Mongoose.model("message", MessageSchema);
console.log("modelswork");
// Export the model
module.exports = Message;