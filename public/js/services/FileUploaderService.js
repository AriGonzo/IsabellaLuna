angular.module('UploaderService', [])
.factory('Uploader', function ($window) {
    if (!$window.SocketIOFileUpload) {
      // If uplaoder is not available you can now provide a
      // mock service, try to load it from somewhere else,
      // redirect the user to a dedicated error page, ...
    }
    return $window.SocketIOFileUpload
  });