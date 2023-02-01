const mongoose = require('mongoose')

const imagesSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  }
})

const Images = mongoose.model('Image', imagesSchema);

module.exports = Images;
