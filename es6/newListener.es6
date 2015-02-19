var util = require('util');
var events = require('events');

class Pulsar extends events.EventEmitter {
  constructor(speed, times) {
    super();
    //events.EventEmitter.call(this);
    this.speed = speed;
    this.times = times;

    this.on('newListener', (eventName, listener) => {
      if (eventName === 'pulse') {
        this.start();
      }
    });
  }

  start() {
    let id = setInterval(() => {
      this.emit('pulse');
      this.times--;
      if (this.times === 0) {
        clearInterval(id);
      }
    }, this.speed);
  }
};

var pulsar = new Pulsar(500, 5);

pulsar.on('pulse', () => {
  console.log('.');
});
