angular.module('SocketService', ['btford.socket-io'])
  .factory('socket', function ($window, socketFactory) {
    //var serverBaseUrl = 'http://52.87.216.253:9999';
    var serverBaseUrl = 'http://localhost:8080';
    var myIoSocket = io.connect(serverBaseUrl);

    var socket = socketFactory({
      ioSocket: myIoSocket
    });

    return {
      service: socket
    };

});