const Mongoose = require("mongoose");

const SalleSchema = new Mongoose.Schema({
  sallename: {
    type: String,
    unique: true,
    required: true,
  },
  number: {
    type: Number,
    unique: true,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  equipment: {
    type: [String],
    required: true,
  },
  pricebyhour: {
    type: Number,
    required: true,
  },
});

// Create a Mongoose model using the SalleSchema
const Salle = Mongoose.model("Salle", SalleSchema);
console.log("modelswork");
// Export the model
module.exports = Salle;