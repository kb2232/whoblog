var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

//load helper
const {ensureAuthenticated} = require('../helpers/auth');

// Load Blog Model
require('../models/Blog');
var Blog = mongoose.model('blogs');

// blog Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Blog.find({user: req.user.id}).sort({ date: 'desc' }).then(blog => {
    res.render('blogs/index', {
      blog: blog
    });
  });
});

// Add Blog Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('blogs/add');
});

// Edit Blog Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Blog.findOne({
    _id: req.params.id
  }).then(blog => {
    if(blog.user != req.user.id) {
      req.flash('error_msg',"Not Authorized");
      res.redirect("/blogs");
    } else {
      res.render('blogs/edit', {
        blog:blog
      });
    }
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  var newUser =
    {
      owner: req.body.owner,
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
  new Blog(newUser).save().then(blog => {
    console.log(req.body);
    req.flash('success_msg', 'blog added');
    res.redirect('/blogs');
  })
});

// Edit Form process
router.put('/:id',ensureAuthenticated, (req, res) => {
  Blog.findOne({
    _id: req.params.id
  }).then(blog => {
      // new values
      blog.owner = req.body.owner;
      blog.title = req.body.title;
      blog.details = req.body.details;

      blog.save().then(blog => {
          req.flash('success_msg', 'blog updated');
          res.redirect('/blogs');
        })
    });
});

// Delete Blog
router.delete('/:id',ensureAuthenticated, (req, res) => {
  Blog.remove({ _id: req.params.id }).then(() => {
      req.flash('success_msg', 'Blog removed');
      res.redirect('/blogs');
    });
});

module.exports = router;