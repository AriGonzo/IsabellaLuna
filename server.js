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
  console.log('socket.io connected!');

  socket.on('submit post', function (post) {
    console.log('Received New Post!');

    var oPost = new Post();
    oPost.text = post.text;
    oPost.save(function (err, post) {
      console.log('post saved!');
      socket.emit('post saved', post)
    });
  });

  socket.on('get posts', function (a, b) {
    Post.find().exec(function (err, posts) {
      socket.emit('sending posts', posts);
    })
  })

});

// expose app
exports = module.exports = app;
