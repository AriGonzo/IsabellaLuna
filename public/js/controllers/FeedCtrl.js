angular.module('FeedCtrl', ['SocketService', 'ngMaterial', 'ngPhotoswipe'])
  .controller('FeedController', function($scope, $timeout, socket) {

    //controller variables
    $scope.posts = ['test'];
    $scope.postImages = [];
    $scope.imageSrc = "";
    $scope.showImages = false;
    $scope.showLoader = false;
    $scope.openGallery = false;
    $scope.uploadList - [];
    $scope.getObj = function (list) {
      $scope.uploadList = list || [];
      return $scope.uploadList
    };
    $scope.opts = {
      index: 0,
      history: false
    };

    //Sockets
    socket.service.emit('get posts');
    socket.service.on('sending posts', function (posts) {
      angular.forEach(posts, function (post) {
        var imgArray = [];
        if (post.uploads){
          angular.forEach(post.uploads, function (upload) {
            imgArray.push({
              src:'https://s3.amazonaws.com/isabelly/' + upload,
              h: 500, w:500
            })
          })
        }
        post.uploads = imgArray;
      });
      $scope.posts = posts;
    });
    socket.service.on('post saved', function (post) {
      console.log('saved this post!', post);
      $scope.showLoader = false;
      socket.service.emit('get posts');
    });

    //Functions
    $scope.imageUpload = function (selector) {
      setTimeout(function() {
        document.getElementById(selector).click();
        $scope.clicked = true;
      }, 0);
    };
    $scope.submitPost = function (post) {
      $scope.showLoader = true;
      console.log('submitting post', post);

      socket.service.emit('submit post', {post: post.text, files: $scope.postImages});
      $scope.post.text = null;
      $scope.postImages = [];
      $scope.showImages = false;
    };
    $scope.showGallery = function (i, list) {
      $scope.getObj(list);
      if(angular.isDefined(i)) {
        $scope.opts.index = i;
      }
      $scope.openGallery = true;
    };
    $scope.closeGallery = function () {
      $scope.openGallery = false;
      $scope.uploadList = [];
    };

    //Event Listeners
    $scope.$watch('imageSrc', function () {
      $scope.imageSrc !== "" ? $scope.postImages.push($scope.imageSrc) : "";
      $scope.postImages.length > 0 ? $scope.showImages = true : $scope.showImages = false;
    });

}) // Pressing Enter to Submit
  .directive('myEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.myEnter);
        });

        event.preventDefault();
      }
    });
  };
})
  .factory("fileReader", function($q, $log) {
    var onLoad = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.resolve(reader.result);
        });
      };
    };

    var onError = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.reject(reader.result);
        });
      };
    };

    var onProgress = function(reader, scope) {
      return function(event) {
        scope.$broadcast("fileProgress", {
          total: event.total,
          loaded: event.loaded
        });
      };
    };

    var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
    };

    var readAsDataURL = function(file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);

      return deferred.promise;
    };

    return {
      readAsDataUrl: readAsDataURL
    };
  })
  .directive("ngFileSelect", function(fileReader, $timeout) {
    return {
      scope: {
        ngModel: '='
      },
      link: function($scope, el) {
        function getFile(file) {
          fileReader.readAsDataUrl(file, $scope)
            .then(function(result) {
              $timeout(function() {
                $scope.ngModel = result;
              });
            });
        }

        el.bind("change", function(e) {
          var file = (e.srcElement || e.target).files[0];
          getFile(file);
        });
      }
    };
  });