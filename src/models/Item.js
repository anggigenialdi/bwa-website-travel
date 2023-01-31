const mongoose = require('mongoose');
const { objectId } = mongoose.Schema;
const Schema = mongoose.Schema;


const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    default: 'Indonesia',
  },
  city: {
    type: String,
    required: true,
  },
  isPopular: {
    type: Boolean,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type : Schema.Types.ObjectId,
    ref: 'Category'
  },
  imageId: [{
    type : Schema.Types.ObjectId,
    ref: 'Image'
  }],
  featureId: [{
    type : Schema.Types.ObjectId,
    ref: 'Feature'
  }],
  activityId: [{
    type : Schema.Types.ObjectId,
    ref: 'Activity'
  }]
})
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;