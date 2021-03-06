var appRoot = require('app-root-path');
console.log(appRoot.path);
var express = require('express');
var googlehome = require('./google-home-notifier');
var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var app = express();
require('dotenv').config({ path: `${appRoot.path}/.env` });
const serverPort = process.env.PORT; // default port

const basicAuth = require('express-basic-auth')

app.use(basicAuth({
  challenge: true,
  users: { [process.env.AUTH_USER]: process.env.AUTH_PASSWORD }
}));
var deviceName = process.env.DEVICE_NAME;
//var ip = '192.168.1.20'; // default IP
//var ip = process.env.DEVICE_IP; // default IP

var urlencodedParser = bodyParser.urlencoded({ extended: false });
console.log(deviceName);

app.post('/google-home-notifier', urlencodedParser, function (req, res) {
  
  if (!req.body) return res.sendStatus(400)
  console.log(req.body);
  
  var text = req.body.text;
  
  if (req.query.ip) {
     ip = req.query.ip;
  }

  var language = 'ja'; // default language code
  if (req.query.language) {
    language;
  }

  console.log(deviceName);
  //googlehome.ip(ip, language);
  googlehome.device(deviceName,language);

  if (text){
    try {
      if (text.startsWith('http')){
        var mp3_url = text;
        googlehome.play(mp3_url, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will play sound from url: ' + mp3_url + '\n');
        });
      } else {
        googlehome.notify(text, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will say: ' + text + '\n');
        });
      }
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  }else{
    res.send('Please GET "text=Hello Google Home"');
  }
})

app.get('/google-home-notifier', function (req, res) {

  console.log(req.query);

  var text = req.query.text;

  if (req.query.ip) {
     ip = req.query.ip;
  }

  var language = 'ja'; // default language code
  if (req.query.language) {
    language;
  }

  //googlehome.ip(ip, language);
  googlehome.device(deviceName,language);

  if (text) {
    try {
      if (text.startsWith('http')){
        var mp3_url = text;
        googlehome.play(mp3_url, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will play sound from url: ' + mp3_url + '\n');
        });
      } else {
        googlehome.notify(text, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will say: ' + text + '\n');
        });
      }
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  }else{
    res.send('Please GET "text=Hello+Google+Home"');
  }
})

// ngrokを非同期で起動
async function connectNgrok() {
    let url = await ngrok.connect({addr:serverPort,authtoken: process.env.TOKEN, auth: `${process.env.AUTH_USER}:${process.env.AUTH_PASSWORD}`});
    return url;
}

app.listen(serverPort, function () {
  console.log('linsten done');
  // connectNgrok().then(url => {
  //   console.log('URL : ' + url);
  //   console.log('Endpoints:');
  //   console.log('    ' + url + '/google-home-notifier');
  //   console.log('GET example:');
  //   console.log('curl -X GET ' + url + '/google-home-notifier?text=Hello+Google+Home');
  //   console.log('POST example:');
  //   console.log('curl -X POST -d "text=Hello Google Home" ' + url + '/google-home-notifier');
  // });
  //const url = await ngrok.connect(serverPort, function (err, url) {
  //  console.log(err);
  //  console.log('Endpoints:');
  //  console.log('    http://' + ip + ':' + serverPort + '/google-home-notifier');
  //  console.log('    ' + url + '/google-home-notifier');
  //  console.log('GET example:');
  //  console.log('curl -X GET ' + url + '/google-home-notifier?text=Hello+Google+Home');
  //  console.log('POST example:');
  //  console.log('curl -X POST -d "text=Hello Google Home" ' + url + '/google-home-notifier');
  //});
})
