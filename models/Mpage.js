var mongoose = require('mongoose');

// Create Schema
var MpageSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  details:{
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('mpages', MpageSchema);