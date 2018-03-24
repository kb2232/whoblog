var express = require('express'),
  bodyParser = require('body-parser'),
  router = express.Router(),
  mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  passport = require('passport'),
  nev = require('email-verification')(mongoose);

// Load User Model
require('../models/User');
var User = mongoose.model('users');

// sync version of hashing function
var myHasher = function (password, tempUserData, insertTempUser, callback) {
  var hash = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(8), null);
  return insertTempUser(hash, tempUserData, callback);
};

// async version of hashing function
myHasher = function (password, tempUserData, insertTempUser, callback) {
  bcrypt.genSalt(8, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      return insertTempUser(hash, tempUserData, callback);
    });
  });
};

//congigure
nev.configure(
  {
    /*the url sent to the user to click  */
    verificationURL: 'www.kunleblog.com/users/email-verification/${URL}',
    URLLength: 48,
    /*mongoose model for the persistent user */
    persistentUserModel: User,//this can be null
    //The tempuser is generated below

    //the name of the MongoDB collection for temporary users.
    tempUserCollection: 'tempusers',
    emailFieldName: 'email',
    passwordFieldName: 'password',
    URLFieldName: 'GENERATED_VERIFYING_URL',
    expirationTime: 3600, // 1 minutes

    //the options that will be passed to //nodemailer.createTransport
    transportOptions: {
      service: 'Gmail',
      auth: {
        user: 'kb22324134@gmail.com',
        pass: 'KB1988@nyu'
      }
    },
    verifyMailOptions:
      {
        from: 'Do Not Reply <kb22324134_do_not_reply@gmail.com>',
        subject: 'Please confirm account',
        html: '<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ' +
          'paste the following link into your browser:</p><p>${URL}</p>',
        text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}'
      },
    shouldSendConfirmation: true,
    confirmMailOptions: 
    {
      from: 'Do Not Reply <kb22324134_do_not_reply@gmail.com>',
      subject: 'Successfully verified!',
      html: '<p>Your account has been successfully verified.</p>',
      text: 'Your account has been successfully verified.'
    },
    hashingFunction: myHasher
  }, function (err, options) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('configured:' + (typeof options === 'object'));
  });

// generating the tempuser model, pass the User model defined //earlier
nev.generateTempUserModel(User, (err, tempUserModel) => {
  if (err) {
    throw err;
    return;
  }
  console.log('----------------temp user model------------------');
  console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});


// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash('error_msg', 'Email already regsitered');
        res.redirect('/users/register');
      } else {
        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        //creating a temp user
        nev.createTempUser(newUser, (err, existingPersistentUser, newTempUser) => {
          if (err) {
            req.flash('error_msg', 'Creating temp user failed');
          }
          // user already exists in persistent collection
          if (existingPersistentUser) {
            req.flash('error_msg', 'You have already signed up and confirmed your account. Did you forget your password?')

          }
          //new temp user in temp collection
          if (newTempUser) {
            var URL = newTempUser[nev.options.URLFieldName];

            nev.sendVerificationEmail(newTempUser.email, URL, function (err, info) {
              if (err) {
                req.flash('error_msg', 'sending verification email FAILED');
              }

              req.flash('success_msg', 'An email has been sent to you. Please check it to verify your account. Check your SPAM inbox if not in regular inbox');

              res.redirect('/users/login');

            });
            //user exist in temp collection
          } else {
            req.flash('error_msg', 'You have already signed up. Please check your email to verify your account.');
          }

        });
      }
    });
  }
});

// user accesses the link that is sent
router.get('/email-verification/:URL', function (req, res) {
  var url = req.params.URL;
  nev.confirmTempUser(url, function (err, user) {
    console.log(err);
    if (err) {
      console.log(err);
      return;
    }
    if (user) {
      nev.sendConfirmationEmail(user.email, function (err, info) {
        if (err) {
          req.flash('error_msg', 'verification email FAILED');
        }
        req.flash('success_msg', 'YOUR ARE CONFIRMED!');
        res.redirect('/users/login');
      });
    } else {
      req.flash('error_msg', 'confirmination FAILED');
    }
  });
});

//Logout user
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', "You are Logout");
  res.redirect('/users/login');
});

module.exports = router;