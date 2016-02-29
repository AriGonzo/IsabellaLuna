// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var server         = require('http').Server(app);
var io             = require('socket.io')(server);
var User           = require('./app/models/user');
var Post           = require('./app/models/post');
var path           = require('path');
var sassMiddleware = require('node-sass-middleware');
// configuration ===========================================

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
 mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

//sass middleware
app.use(sassMiddleware({
  src: __dirname + '/public',
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'compressed'
}));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
server.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

// sockets ==================================================

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  console.log('socket.io connected!');

  socket.on('my other event', function (data) {
    console.log('Received New User!');
    User.findOne({email: data.email || null}, function (err, oUser) {
      console.log('oUser is ',oUser)
      if (oUser == null ){
        oUser = new User();
      }
      oUser.name = data.name;
      oUser.email = data.email;
      oUser.save(function (err, user) {
        socket.emit('user saved', user)
      })
    });
  });

});

// expose app
exports = module.exports = app;
