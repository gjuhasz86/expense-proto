var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var path = require('path');
var crud = require('./crud');
var db = require('./db');
var auth = require('./auth');
var transactions = require('./transactions');

var router = express.Router();

router.use(express.static(path.join(__dirname, '/../../public')));

router.use(cookieParser());
router.use(bodyParser.json());
router.use(session({secret: 'some secret', resave: true, saveUninitialized: true})); // verify session setup

router.use(auth);

router.use("/api", auth.isAuthenticated, function (res, req, next) {
    next();
});

// DB access routes
router.use('/api/transactions', coll('transactions'), db, transactions, crud);
router.use('/api/accounts', coll('accounts'), db, crud);
router.use('/api/categories', coll('categories'), db, crud);

router.get('/debug', function (req, res) {
    console.log("debug");
    console.log(req.query);
    res.send('debug called');
});

router.get('/health', function (req, res) {
    res.writeHead(200);
    res.end();
});

router.get('*', function (req, res) {

    res.sendFile(path.join(__dirname, '/../../public/index.html'));
});
/////////////////////
/// HELPER FUNCTIONS

function coll(coll) {
    return function (req, res, next) {
        req.collection = coll;
        next();
    }
}

/////////////////////
/// MODULE EXPORT

module.exports = router;