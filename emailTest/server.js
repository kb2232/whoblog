var express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  nev = require('/Users/kb2232/Desktop/udemy/nodejs_projectBased/practice/myapp_mongodb_emailVerification/emailTest/app/index')(mongoose);
mongoose.connect('mongodb://localhost/testDB');

//load real user model
var User = require('./app/userModel');

//congigure
nev.configure({
  /*the url sent to the user to click  */
  verificationURL: 'http://myawesomewebsite.com/email-verification/${URL}',
  /*mongoose model for the persistent user */
  persistentUserModel: User,//this can be null
//The tempuser is generated below

//the name of the MongoDB collection for temporary users.
  tempUserCollection: 'tempusers',

//the options that will be passed to nodemailer.createTransport
  transportOptions: {
      service: 'Gmail',
      auth: {
          user: 'myawesomeemail@gmail.com',
          pass: 'mysupersecretpassword'
      }
  },
  /*
  the options that will be passed to nodemailer.createTransport({...}).sendMail when sending an email for verification. You must include ${URL} somewhere in the html and/or text fields to put the URL in these strings.

  */
  verifyMailOptions: {
      from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
      subject: 'Please confirm account',
      html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
      text: 'Please confirm your account by clicking the following link: ${URL}'
  }
}, function(error, options)
{
  if(error)
  {
    console.log(error);
    return;
  }
});

// generating the tempuser model, pass the User model defined //earlier
nev.generateTempUserModel(User, (err,tempUserModel)=>{
  if(err)
  {
    throw err;
    return;
  }
  console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});

/////////////////////////EXPRESS

//homepage
//takes you to
app.use(bodyParser.urlencoded());
app.get('/',(req,res)=>{
  res.sendFile('index.html',{
    root: _dirname
  });
});

app.listen(8000);
console.log('Express & NEV example listening on 8000...');