const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const DogSchema = new Schema({
  name: String,
  dateOfBirth: Date,
  parent1: String,
  parent2: String,
  images: [ImageSchema],
  description: String,
  status: String,
  yearOfDeath: Number
});

module.exports = mongoose.model("Dog", DogSchema);
