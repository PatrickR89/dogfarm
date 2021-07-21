const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "upload/w_200");
});

const AboutUsSchema = new Schema({
  field1Title: String,
  field2Title: String,
  field3Title: String,
  field1: String,
  field2: String,
  field3: String,
  images: [ImageSchema]
});

module.exports = mongoose.model("AboutUs", AboutUsSchema);
