const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  street: String,
  streetNo: Number,
  city: String,
  country: String,
  phone: Number,
  email: String,
  faceLink: String,
  instaLink: String,
  twittLink: String
});

module.exports = mongoose.model("Contact", ContactSchema);
