console.time('check');
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(text) {
  process.stdout.write(text.toUpperCase());
});

process.stdin.on('end', function() {
  console.log('DONE');
  console.timeEnd('check');
});
