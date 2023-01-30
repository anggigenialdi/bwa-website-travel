const mongoose = require("mongoose");
const { objectId } =mongoose.Schema;
const Schema =mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  itemId: [{
    type : Schema.Types.ObjectId,
    ref: 'Item'

  }]
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;