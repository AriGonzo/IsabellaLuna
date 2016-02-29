// app/routes.js

// grab the user model we just created
var User = require('./models/user');

module.exports = function(app) {

  // server routes ===========================================================
  // handle things like api calls
  // authentication routes

  // frontend routes =========================================================
  // route to handle all angular requests
  app.get('*', function(req, res) {
    res.sendFile( path.join( __dirname, 'public/index.html' ) );
  });

};