var fs = require('fs');

var S3_KEY = 'AKIAIDIQLTX244X2X7MA';
var S3_SECRET = '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';
var S3_BUCKET = 'isabelly';

var knox = require('knox').createClient({
  key: S3_KEY,
  secret: S3_SECRET,
  bucket: S3_BUCKET
});

var putBuffer = function (buffer, filePath, options, successCB, errorCB) {
  knox.putBuffer(buffer, filePath, options, function(err, result) {
    if (200 == result.statusCode) {
      console.log('Uploaded to Amazon S3');
      if (successCB)
        successCB(S3_BUCKET);
    }
    else {
      console.log('Failed to upload file to Amazon S3', err, result);
      if (errorCB)
        errorCB();
    }
  });
};

var __save = function (file, path, callback) {
  console.log('file is ', file);
  fs.exists(file.path, function(exists) {
    if (exists) {
      path = (path || "users") + "/";
      var uuid1 = uuid.v1();
      var file_name = uuid1+"."+file.extension;
      var file_path = path+file_name;
      var originalname = file.originalname;
      var extension = file.extension;
      var mimetype = file.mimetype;
      var size = file.size;
      var upload = new Upload();
      upload.original_file_name = originalname;
      upload.extension = extension;
      upload.content_type = mimetype;
      upload.size = size;
      upload.file_name = file_name;
      upload.file_path = file_path;
      upload.in_amazon_s3 = true;
      putBuffer(file.path, file_path, {'Content-Type': mimetype}, function (bucket) {
        upload.amazon_s3_bucket = bucket;
        upload.save(function (err, upload) {
          if (err) {
            console.log(err);
            callback(err, null);
          } // if
          else {
            callback(null, upload);
          }
        });
      }, function () {
        console.log("Error uploading to storage server.");
        callback(new Error("Error uploading to storage server."), null);
      });
    }
    else {
      console.log("File does not exist.");
      callback(new Error("File does not exist."), null);
    }
  });
};

exports.save = __save;
