var MessageBus = require('./messagebus');
var messageBus = new MessageBus();
var $ = require('jquery');
console.log($);

messageBus.on('message', function(msg) {
  $('#messages').append('<p>' + msg + '</p>');
});

$(function() {
  messageBus.emit('message', 'Hello from example 2');
});
