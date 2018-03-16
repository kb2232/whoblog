var express = require('express');
var path = require('path');
var exphbs  = require('express-handlebars');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');

var app = express();

// Load routes
var blogs = require('./routes/blogs');
var users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

//database config
var db = require('./config/database');

// Connect to mongoose - using rl
mongoose.connect(db.mongoURI).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  //if we logged in we have access to user
  res.locals.user = req.user || null;
  next();
});

// Index Route
app.get('/', (req, res) => {
  var title = 'Welcome: Login or Register';
  res.render('index', {
    title: title
  });
});

// Use routes
app.use('/blogs', blogs);
app.use('/users', users);

var port = 4000;

app.set( 'port', ( process.env.PORT || 4000 ));

// Start node server
app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
  });