angular.module('SocketService', ['btford.socket-io'])
  .factory('socket', function (socketFactory) {
    var serverBaseUrl = 'http://52.87.216.253:9999';
    var myIoSocket = io.connect(serverBaseUrl);

    var socket = socketFactory({
      ioSocket: myIoSocket
    });

    return socket;

});