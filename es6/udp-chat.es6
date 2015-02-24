let dgram = require('dgram');
let defaultSize = 16;
let port = 41234;

class Client {
  constructor(remoteIP) {
    let socket = dgram.createSocket('udp4');
    let readline = require('readline');
    let rl = readline.createInterface(process.stdin, process.stdout);

    socket.send(new Buffer('<JOIN>'), 0, 6, port, remoteIP);

    rl.setPrompt('Message> ');
    rl.prompt();

    rl.on('line', (line) => {
      sendData(line);
    }).on('close', () => {
      process.exit(0);
    });

    socket.on('message', (msg, rinfo) => {
      console.log(`\n<${rinfo.address} ${msg.toString()}`);
      rl.prompt();
    });

    function sendData(message) {
      socket.send(new Buffer(message), 0, message.length, port, remoteIP,
          (err, bytes) => {
            console.log('Send: ', message);
            rl.prompt();
          }
      );
    }
  }
}

class Server {
  constructor() {
    let clients = [];
    let server = dgram.createSocket('udp4');

    server.on('message', (msg, rinfo) => {
      let clientId = rinfo.address + ':' + rinfo.port;

      msg = msg.toString();

      if (!clients[clientId]) {
        clients[clientId] = rinfo;
      }

      if (msg.match(/^</)) {
        console.log('Control message: ', msg);
        return;
      }

      for (let client in clients) {
        if (client !== clientId) {
          client = clients[client];
          server.send(
            new Buffer(msg), 0, msg.length, client.port, client.address, 
            (err, bytes) => {
              if (err) console.error(err);
              console.log('Bytes sent: ', bytes);
            }
          );
        }
      }
    });

    server.on('listening', () => {
      console.log('Server ready: ', server.address());
    });

    server.bind(port);
  }
}

module.exports = {
  Client: Client,
  Server: Server
};

if (!module.parent) {
  switch (process.argv[2]) {
    case 'client':
      new Client(process.argv[3]);
      break;
    case 'server':
      new Server();
      break;
    default:
      console.log('unknown option');
  }
}
