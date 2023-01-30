const mongoose = require('mongoose')
const { objectId } = mongoose.Schema;

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  itemId: {
    type: objectId,
    ref: Item
  }
})

const Feature = mongoose.model('Feature', categorySchema);

module.exports = Feature;
