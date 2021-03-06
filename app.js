var express = require('express');

var port = process.env.PORT;
var ip = process.env.IP;
var app = express();

var urls = [];

app.get('/new/*?', function getNewLink(req, res) {
  var validUrlRegExp = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  var url = req.params[0];
  var isValidUrl = validUrlRegExp.test(url);

  var retObj;
  if (isValidUrl){
    if (!/^http(s)?:\/\//.test(url)) {
      url = 'http://' + url;
    }
    urls.some(function isUrlThere(urlObj) {
      if (urlObj.original_url === url) {
        retObj = urlObj;
        return true;
      }
      return false;
    });

    if(!retObj) {
      var host = req.get('host');

      retObj = {
        original_url: url,
        short_url: 'http://' + host + '/' + urls.length,
      };

      urls.push(retObj);
    }

    res.json(retObj);
  } else {
    var errorObj = {
      error: 'URL invalid'
    };
    res.json(errorObj);
  }
});

app.get('/:urlIndex', function serveShotenedUrl(req, res){
  var urlIndex = req.params['urlIndex'];
  var urlObj = urls[urlIndex];
  if(urlObj === undefined) {
    urlObj = {
      error: 'No short url found for a given input'
    };
    res.json(urlObj);
  } else {
    res.redirect(urlObj.original_url);
  }
});

app.get('/', function getRoot(req, res) {
  res.end('<!doctype html>\
  <html lang="en">\
  \
  <head>\
    <meta name="viewport" content="width=device-width, initial-scale=1">\
    <title>The URL Shortener</title>\
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\
  </head>\
  \
  <body>\
    <div class="container">\
      <h1 class="header">\
        API Basejump: URL Shortener\
      </h1>\
      <blockquote>\
        User stories:\
        <ul><li>I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.</ul>\
        <ul><li>When I visit that shortened URL, it will redirect me to my original link.</ul>\
      </blockquote>\
      <h3>Example creation usage:</h3>\
      <code><a href="https://url-shortener-marzelin.herokuapp.com/new/https://www.google.com">https://url-shortener-marzelin.herokuapp.com/new/https://www.google.com</a></code>\
      <br>\
      <code><a href="https://url-shortener-marzelin.herokuapp.com/new/http://freecodecamp.com/news">https://url-shortener-marzelin.herokuapp.com/new/http://freecodecamp.com/news</a></code>\
      <h3>Example creation output:</h3>\
      <code>\
        {\
          "original_url": "http://freecodecamp.com/news",\
          "short_url": "https://url-shortener-marzelin.herokuapp.com/4"\
        }\
      </code>\
      <h3>Usage:</h3>\
      <code><a href="https://url-shortener-marzelin.herokuapp.com/4">https://url-shortener-marzelin.herokuapp.com/4</a></code>\
      <h3>Will redirect to:</h3>\
      <code><a href="http://freecodecamp.com/news">http://freecodecamp.com/news</a></code>\
    </div>\
  </body>\
  \
  </html>');
});

app.listen(port, ip);
