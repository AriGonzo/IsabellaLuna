angular.module('SocketService', ['btford.socket-io'])
  .factory('socket', function (socketFactory) {
    var serverBaseUrl = 'http://localhost:8080';
    var myIoSocket = io.connect(serverBaseUrl);

    var socket = socketFactory({
      ioSocket: myIoSocket
    });

    return socket;

});