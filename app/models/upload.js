var mongoose         = require('mongoose');
var Schema           = mongoose.Schema;

var UploadSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  original_file_name: String,
  media_type: String,
  file_name: String,
  file_path: String,
  content_type: String,
  extension: String,
  size: Number,
  modified_by: { type: Schema.Types.ObjectId, ref: 'User' },
  modified_on: Date,
  created_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', UploadSchema);