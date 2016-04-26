var express = require('express');
var app = express();

var env = process.env;

app.get('/', function (req, res) {
    res.send('Hello World1');
});

app.get('/health', function (req, res) {
    res.writeHead(200);
    res.end();
});


app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
    console.log('Application worker %s started...', process.pid);
});
