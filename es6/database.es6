let fs = require('fs');
let EventEmitter = require('events').EventEmitter;

class Database extends EventEmitter {
  constructor(path) {
    this.path = path;

    this._records = Object.create(null);
    this._writeStream = fs.createWriteStream(this.path, {
      encoding: 'utf8',
      flags: 'a'
    });

    this._load();
    super();
  }

  _load() {
    let stream = fs.createReadStream(this.path, { encoding: 'utf8' });
    let data = '';

    stream.on('readable', () => {
      data += stream.read();
      let records = data.split('\n');
      data = records.pop();
      console.log( data );

      for (let i in records) {
        try {
          let record = JSON.parse(records[i]);
          console.log(record);
          if (record.value == null) {
            delete this._records[record.key];
          }
          else {
            this._records[record.key] = record.value;
          }
        } catch(e) {
          this.emit('error', `found invalid record: ${records[i]}`);
        }
      }
    });

    stream.on('end', () => {
      this.emit('load');
    });
  }

  get(key) {
    return this._records[key] || null;
  }

  set(key, value, cb) {
    let toWrite = JSON.stringify({key: key, value: value}) + '\n';

    if (value == null)
      delete this._records[key];
    else
      this._records[key] = value;

    this._writeStream.write(toWrite, cb);
  }

  del(key, cb) {
    return this.set(key, null, cb);
  }
}

let client = new Database('./data/test.db');

client.on('load', () => {
  let foo = client.get('foo');

  client.set('bar', 'my sweet value', (err) => {
    if (err) return console.error(err);
    console.log('write successful');
  });

  client.del('baz');
});

client.on('error', (err) => {
  console.error('Error: ', err)
});
