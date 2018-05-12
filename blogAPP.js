var express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  path = require('path'),
  exphbs  = require('express-handlebars'),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  session = require('express-session'),
  passport = require('passport'),
  mongoose = require('mongoose');


// Load routes

//load blog
var blogs = require('./routes/blogs');
//load user
var users = require('./routes/users');
//load user page
var mpage = require('./routes/mpage');

// Passport Config
require('./config/passport')(passport);

//database config
var db = require('./config/database');

// Connect to mongoose - using uri
mongoose.connect(db.mongoURI);
var db_obj = mongoose.connection;
db_obj.on('error', console.error.bind(console, 'connection error:'));
db_obj.once('open', function() {
  console.log('MongoDB Connected...');
});

//path middleware
app.use('/', express.static(path.join(__dirname, 'myapp')));

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
app.use('/mpage', mpage);

var port = process.env.PORT || 4000;
app.listen(port,()=>{
  console.log(`Server started on port ${port}`);
});