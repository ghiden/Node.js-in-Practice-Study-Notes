var EventEmitter = require('events').EventEmitter;
var util = require('util');

function MessageBus(options) {
  EventEmitter.call(this, options);
  this.on('message', this.messageReceived.bind(this));
}

util.inherits(MessageBus, EventEmitter);

MessageBus.prototype.messageReceived = function(message) {
  console.log('RX:', message);
};

module.exports = MessageBus;
