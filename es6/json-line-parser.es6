let stream = require('stream');
let util = require('util');
let fs = require('fs');

class JSONLineReader extends stream.Readable {
  constructor(source) {
    super();
    this._source = source;
    this._foundLineEnd = false;
    this._buffer = '';

    source.on('readable', () => {
      this.read();
    });

    source.on('end', () => {
      console.log('DONE');
    });
  }

  _read(size) {
    let chunk;
    let line;
    let lineIndex;
    let result;

    if (this._buffer.length === 0) {
      chunk = this._source.read();
      this._buffer += chunk;
    }

    lineIndex = this._buffer.indexOf('\n');


    if (lineIndex !== -1) {
      line = this._buffer.slice(0, lineIndex);
      if (line) {
        result = JSON.parse(line);
        this._buffer = this._buffer.slice(lineIndex + 1);
        this.emit('object', result);
        this.push(util.inspect(result));
      }
      else {
        // empty line, forward by one
        this._buffer = this._buffer.slice(1);
      }
    }
  }
}

let input = fs.createReadStream(__dirname + '/../json-lines.txt', {
  encoding: 'utf8'
});
var jsonLineReader = new JSONLineReader(input);

jsonLineReader.on('object', function(obj) {
  console.log('name: ', obj.name);
});

