var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create Schema
var BlogSchema = new Schema({
  owner:{
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  details:{
    type: String,
    required: true
  },
  user:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('blogs', BlogSchema);