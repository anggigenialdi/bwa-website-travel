const mongoose = require('mongoose')
const Schema = mongoose.Schema;


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
    type : Schema.Types.ObjectId,
    ref: 'Item'
  }
})

const Feature = mongoose.model('Feature', featureSchema);

module.exports = Feature;
