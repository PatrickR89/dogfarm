const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
});

const NewsSchema = new Schema({
    title: String,
    images: [ImageSchema],
    content: String,
    date: Date
})

module.exports = mongoose.model('News', NewsSchema)