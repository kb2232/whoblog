var mongoose = require('mongoose');

// Create Schema
var BlogSchema = mongoose.Schema({
  owner:{
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
  usern: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('blogs', BlogSchema);