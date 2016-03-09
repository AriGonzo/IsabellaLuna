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
var Upload         = require('./app/models/upload');
var path           = require('path');
var sassMiddleware = require('node-sass-middleware');
var siofu          = require("socketio-file-upload");
var ImageService   = require('./app/services/ImageService.js');
var AWS            = require('aws-sdk');
AWS.config.loadFromPath('./resources/s3_config.json');
var s3Bucket       = new AWS.S3( { params: {Bucket: 'isabelly'} } );
var async          = require('async');
var fileType       = require('file-type');
// configuration ===========================================

// config files
var db = require('./config/db');

// set our port
//var port = process.env.PORT || 9999;
var port = process.env.PORT || 8080;

// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
 mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// set up socket.io image uploader
app.use(siofu.router);
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

  //Setup
  var uploader = new siofu();
  uploader.listen(socket);


  // Listeners
  socket.on('submit post', function (postBody) {
    console.log('Received new post!', postBody.post);
    var postUploads = [];
    //TODO: Create a new upload object and give it the proper information before triggering the AWS upload
    var oPost = new Post();
    oPost.text = postBody.post;
    oPost.save(function (err, post) {
      if (postBody.files.length > 0) {
        var async_functions = [];
        var postImages = postBody.files;
        async_functions.push(function (parallel_callback) {
          async.each(postImages, function (postImage, callback) {
            var thisUpload = new Upload();
            var buf = new Buffer(postImage.replace(/^data:image\/\w+;base64,/, ""),'base64');
            var data = {
              Key: thisUpload._id.toString(),
              Body: buf,
              ContentEncoding: 'base64',
              ContentType: fileType(buf).mime,
              ACL:'public-read'
            };
            s3Bucket.putObject(data, function(err, data){
              if (err) {
                callback(err, data);
                console.log('Error uploading data: ', data);
              } else {
                postUploads.push(thisUpload._id);
                thisUpload.save(function (err, upload) {
                  if (err) {
                    console.log('err saving upload model ', err);
                    callback(err, null);
                  }
                  callback(err, data);
                  console.log('successfully uploaded the image!', data);
                });
              }
            });
          }, function (err, data) {
            if (err) {
              parallel_callback(err, null)
            } else {
              parallel_callback(err, data);
            }
          });
        });
        async.series(async_functions, function (err, results) {
          if (err) {
            console.log(err)
          } else {
            oPost.uploads = postUploads;
            oPost.save(function () {
              console.log('post saved!', post);
              io.emit('post saved', post);
            });
          }
        });
      } else {
        console.log('post saved!', post);
        io.emit('post saved', post);
      }
    });
  });

  socket.on('get posts', function () {
    Post.find().exec(function (err, posts) {
      socket.emit('sending posts', posts);
    })
  });

  uploader.on('start', function (payload) {
    console.log('a is ',a);
    console.log('b is ',b);
  })

});

// expose app
exports = module.exports = app;
