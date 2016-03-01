angular.module('FeedCtrl', ['SocketService'])
  .controller('FeedController', function($scope, socket) {

    $scope.posts = [];
    socket.emit('get posts');
    socket.on('sending posts', function (posts) {
      $scope.posts = posts;
    });

    $scope.submitPost = function (post) {
      socket.emit('submit post', post);
    };

    socket.on('post saved', function (post) {
      console.log('saved this post!', post);
      $scope.posts.push(post);
    });

});