angular.module('FeedCtrl', ['SocketService', 'ngMaterial'])
  .controller('FeedController', function($scope, socket) {

    $scope.posts = [];
    socket.emit('get posts');
    socket.on('sending posts', function (posts) {
      $scope.posts = posts;
    });

    $scope.submitPost = function (post) {
      socket.emit('submit post', post);
      $scope.post.text = null;
    };

    socket.on('post saved', function (post) {
      console.log('saved this post!', post);
      $scope.posts.push(post);
    });
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
});