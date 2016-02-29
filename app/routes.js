// app/routes.js

// grab the nerd model we just created
var User = require('./models/user');

module.exports = function(app) {

  // server routes ===========================================================
  // handle things like api calls
  // authentication routes

  // sample api route
  app.get('/api/users', function(req, res) {
    // use mongoose to get all nerds in the database
    User.find(function(err, users) {

      // if there is an error retrieving, send the error.
      // nothing after res.send(err) will execute
      if (err)
        res.send(err);

      res.json(users); // return all nerds in JSON format
    });
  });

  // route to handle creating goes here (app.post)
  // route to handle delete goes here (app.delete)

  // frontend routes =========================================================
  // route to handle all angular requests
  app.get('*', function(req, res) {
    res.sendFile( path.join( __dirname, 'public/index.html' ) );
  });

  app.post('/setup', function(req, res) {
    //Array of chat data. Each object properties must match the schema object properties
    var chatData = [
      {

      }
    ];

    //Loop through each of the chat data and insert into the database
    for (var c = 0; c < chatData.length; c++) {
      //Create an instance of the chat model
      var newChat = new Chat(chatData[c]);
      //Call save to insert the chat
      newChat.save(function(err, savedChat) {
        console.log(savedChat);
      });
    }
    //Send a resoponse so the serve would not get stuck
    res.send('created');
  });

};