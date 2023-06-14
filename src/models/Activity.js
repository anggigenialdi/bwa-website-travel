const mongoose = require('mongoose')
const {
  objectId
} = mongoose.Schema;
const Schema = mongoose.Schema;



const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  isPopular: {
    type: Boolean,
  },
  itemId: {
    // type: objectId,
    type : Schema.Types.ObjectId,
    ref: 'Item'
  }
})
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;