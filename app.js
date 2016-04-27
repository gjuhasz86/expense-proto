var express = require('express');
//var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)

var env = process.env;

var app = express();

//mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
//app.use(methodOverride());


app.get('/debug', function (req, res) {
    res.send('debug called');
});

app.get('/health', function (req, res) {
    res.writeHead(200);
    res.end();
});


app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
    console.log('Application worker %s started...', process.pid);
});
