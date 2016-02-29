angular.module('UserCtrl', ['SocketService'])
  .controller('UserController', function($scope, socket) {

    $scope.user = {
      name: 'Isabella Gonzalez',
      email: 'IzzyLuna@BAWmail.com'
    };

    $scope.submitUser = function (user) {
      socket.emit('my other event', user);
    };

    socket.on('user saved', function (data) {
      console.log('saved this user!', data);
      $scope.user = data;
      $scope.tagline = data.name;
    });

    $scope.tagline = 'To the Moon and Back!!';

});