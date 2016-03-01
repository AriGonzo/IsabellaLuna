// app/models/user.js
// grab the mongoose module
var mongoose         = require('mongoose');
var Schema           = mongoose.Schema;

// define our user model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  relationship: String,
  favoritePosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  created_on: { type: Date, default: Date.now }
});