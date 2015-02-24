let http = require('http');
let https = require('https');
let url = require('url');

class Request {
  constructor() {
    this.maxRedirects = 10;
    this.redirects = 0;
  }

  get(href, callback) {
    let uri = url.parse(href);
    let options = { host: uri.host, path: uri.path };
    let httpGet = uri.protocal === 'http:' ? http.get : https.get;

    console.log('GET:', href);

    function processResponse(response) {
      if (response.statusCode >= 300 && response.statusCode < 400) {
        if (this.redirects >= this.maxRedirects) {
          this.error = new Error(`Too many redirects for: ${href}`)
        } else {
          this.redirects++;
          href = url.resolve(options.host, response.headers.location);
          return this.get(href, callback);
        }
      }

      response.url = href;
      response.redirects = this.redirects;

      console.log('Redirected:', href);

      response.on('data', function(data) {
        console.log('Got data, length: ', data.length);
      });

      response.on('end', () => {
        console.log('Connection ended');
        callback(this.error, response);
      });
    }

    httpGet(options, processResponse.bind(this))
      .on('error', (err) => {
        callback(err);
      });
  }
}

let request = new Request();
request.get('http://google.com/', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Fetched URL: ', res.url, 'with', res.redirects, 'redirects');
    process.exit();
  }
});

