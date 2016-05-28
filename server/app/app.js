var express = require('express');
var morgan = require('morgan');
var routes = require('./routes');

var app = express();
var env = process.env;

app.use(morgan('dev'));
app.use(routes);

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
    console.log('Application worker %s started...', process.pid);
});
