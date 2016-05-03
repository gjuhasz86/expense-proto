var express = require('express');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var dao = require('./dao');

var app = express();

var env = process.env;

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
// app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
// app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json


// var findDoc = function (db, callback) {
//     db.collection('log').find({}).toArray(function (err, docs) {
//         assert.equal(err, null);
//         console.log("Found the following records");
//         console.dir(docs);
//         callback();
//     });
// };


app.use('/api/transactions', function (req, res, next) {
    console.log('transaction req');
    req.collection = 'transactions';
    next();
}, dao);

app.use('/api/accounts', function (req, res, next) {
    console.log('account req');
    req.collection = 'accounts';
    next();
}, dao);

app.get('/debug', function (req, res) {
    console.log("debug");
    console.log(req.query);
    res.send('debug called');
});

app.get('/health', function (req, res) {
    res.writeHead(200);
    res.end();
});


app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
    console.log('Application worker %s started...', process.pid);
});
