let stream = require('stream');

class MemoryStream extends stream.Readable {
  constructor(options) {
    options = options || {};
    options.objectMode = true;
    super(options);
  }

  _read(size) {
    this.push(process.memoryUsage());
  }
}

let memoryStream = new MemoryStream();
memoryStream.on('readable', () => {
  let output = memoryStream.read();
  console.log('Type: %s, value: %j', typeof output, output);
});
