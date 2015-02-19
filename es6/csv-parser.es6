let fs = require('fs');
let stream = require('stream');

class CSVParser extends stream.Transform {
  constructor(options) {
    super(options);
    this.value = '';
    this.headers = [];
    this.values = [];
    this.line = 0;
  }

  _transform(chunk, encoding, done) {
    let c;

    chunk = chunk.toString();

    for (let i in chunk) {
      let c = chunk.charAt(i);

      if (c === ',') {
        this.addValue();
      }
      else if (c === '\n') {
        this.addValue();
        if (this.line > 0) {
          this.push(JSON.stringify(this.toObject()));
        }
        this.values = [];
        this.line++;
      }
      else {
        this.value += c;
      }
    }

    done();
  }

  toObject() {
    let obj = {};
    for (let i in this.headers) {
      obj[this.headers[i]] = this.values[i];
    }
    return obj;
  }

  addValue() {
    if (this.line === 0) {
      this.headers.push(this.value);
    }
    else {
      this.values.push(this.value);
    }
    this.value = '';
  }
}

let parser = new CSVParser();
fs.createReadStream(__dirname + '/../data/sample.csv')
  .pipe(parser)
  .pipe(process.stdout);

