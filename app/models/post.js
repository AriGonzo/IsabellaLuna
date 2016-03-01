// app/models/user.js
// grab the mongoose module
var mongoose = require('mongoose');
var Schema           = mongoose.Schema;

// define our user model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Post', {
  name: String,
  type: String,
  posted_date: Date,
  isabellaAge: Number,
  metaDate: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  uploads: [{ type: Schema.Types.ObjectId, ref: 'Uploads' }],
  text: String,
  tags: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  first: String,
  created_on: { type: Date, default: Date.now }
});