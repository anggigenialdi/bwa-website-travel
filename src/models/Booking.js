const mongoose = require('mongoose');
const { objectId } = mongoose.Schema;
const Schema = mongoose.Schema;


const BookingSchema = new mongoose.Schema({
  bookingStartDate: {
    type: Date,
    required: true
  },
  bookingEndDate: {
    type: Date,
    required: true
  },
  itmeId: [{
    _id: {
      // type: objectId,
      type : Schema.Types.ObjectId,
      ref: 'Item'
    },
    price: {
      type: Number,
      required: true
    },
    night: {
      type: Number,
      required: true,
    }
  }],
  memberId: [{
    type : Schema.Types.ObjectId,
    ref: 'Member'
  }],
  bankId: [{
    type : Schema.Types.ObjectId,
    ref: 'Bank'
  }],
  proofPayment: {
    type: String,
    required: true,
  },
  bankForm: {
    type: String,
    required: true
  },
  accountHolder:{
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  
})

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;