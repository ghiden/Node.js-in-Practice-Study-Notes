function monitor() {
    console.log(process.memoryUsage());
}
var id = setInterval(monitor, 1000);
id.unref();
setTimeout(function() {
    console.log('Done!');
}, 5000);
