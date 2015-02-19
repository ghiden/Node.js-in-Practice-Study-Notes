let stream = require('stream');

class GreanStream extends stream.Writable {
  constructor(options) {
    super(options);
  }

  _write(chunk, encoding, callback) {
    process.stdout.write(`\u001b[32m${chunk}\u001b[39m`);
    callback();
  }
}

process.stdin.pipe(new GreanStream());
