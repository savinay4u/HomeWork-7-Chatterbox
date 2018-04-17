var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
console.log('websockets server started');
ws.on('connection', function(socket) {
  console.log('client connection established');
  messages.forEach(function(msg) {
    socket.send(msg);
  });
  socket.on('message', function(data) {
    console.log('message received: ' + data);
    var mysavedString = data.split(' ');
    if (mysavedString[0] == '/topic') {
      var topicName = data.substr(data.indexOf(' ') + 1);
      var changeMessage = '*** Topic has changed to ' + topicName;
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(changeMessage);
      });
      if (messages.length > 0) {
        if (messages[0].indexOf('Topic') == -1) {
          messages.unshift('*** Topic is' + topicName);
        }
      } else {
        messages.shift();
        messages.unshift('*** Topic is' + topicName);
      }
    } else {
      messages.push(data);
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    }
  });
});
