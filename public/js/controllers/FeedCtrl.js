angular.module('FeedCtrl', ['SocketService', 'ngMaterial'])
  .controller('FeedController', function($scope, $timeout, socket, fileReader) {

    //controller variables
    $scope.posts = [];
    $scope.postImages = [];
    $scope.imageSrc = "";
    $scope.showImages = false;

    //Sockets
    socket.service.emit('get posts');
    socket.service.on('sending posts', function (posts) {
      $scope.posts = posts;
    });
    socket.service.on('post saved', function (post) {
      console.log('saved this post!', post);
      console.log($scope.posts);
      $scope.posts.push(post);
    });

    //Functions
    $scope.imageUpload = function (selector) {
      setTimeout(function() {
        document.getElementById(selector).click();
        $scope.clicked = true;
      }, 0);
    };

    $scope.submitPost = function (post) {
      console.log('submitting post', post);

      socket.service.emit('submit post', {post: post.text, files: $scope.postImages});
      $scope.post.text = null;
      $scope.postImages = [];
      $scope.showImages = false;
    };

    $scope.$watch('imageSrc', function () {
      $scope.imageSrc !== "" ? $scope.postImages.push($scope.imageSrc) : "";
      $scope.postImages.length > 0 ? $scope.showImages = true : $scope.showImages = false;
    })

})
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