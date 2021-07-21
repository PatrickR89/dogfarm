const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
});

const HomeSchema = new Schema({
    aboutUs: String,
    images: [ImageSchema]
});

module.exports = mongoose.model('Home', HomeSchema);