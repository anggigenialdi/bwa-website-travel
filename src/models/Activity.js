const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true 
  },
  imageUrl: {
    type: String,
    required: true
  },
  isPopular: {
    type: Boolean,
  },
})
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;