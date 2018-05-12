var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

//load helper
const {ensureAuthenticated} = require('../helpers/auth');

// Load Mpage Model
require('../models/Mpage');
var Mpage = mongoose.model('mpages');

//add CREATE blog
router.get('/create', ensureAuthenticated,function(req,res){
  res.render('mpages/create');
});

module.exports = router;