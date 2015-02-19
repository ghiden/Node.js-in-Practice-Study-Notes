var assert = require('assert');
var CountStream = require('./countstream');
var cs = new CountStream('example');
var fs = require('fs');
var passed = 0;

cs.on('total', function(count) {
  assert.equal(count, 1);
  passed++;
});

fs.createReadStream(__filename).pipe(cs);

process.on('exit', function() {
  console.log('Assertions passed:', passed);
});
