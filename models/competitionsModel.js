const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CompetitionSchema = new Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  location: String,
  award: String,
  linkTo: String,
  dog: String,
  images: [ImageSchema]
});

module.exports = mongoose.model("Competition", CompetitionSchema);
