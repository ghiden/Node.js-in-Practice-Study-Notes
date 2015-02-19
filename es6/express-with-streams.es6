let stream = require('stream');
let util = require('util');
let express = require('express');
let app = express();

class StatStream extends stream.Readable {
  constructor(limit) {
    super();
    this.limit = limit;
  }

  _read(size) {
    if (this.limit === 0) {
      // Done
      this.push();
    }
    else {
      this.push(util.inspect(process.memoryUsage()));
      this.push('\r\n');
      this.limit --;
    }
  }
}

app.get('/', (req, res) => {
  let statStream = new StatStream(100);
  statStream.pipe(res);
});

app.listen(4000);
