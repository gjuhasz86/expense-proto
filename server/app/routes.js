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
var banklink = require('./banklink');
var admin = require('./admin');
var public = require('./public');
var debug = require('./debug');

var router = express.Router();
const MongoStore = require('connect-mongo')(session);

router.use(express.static(path.join(__dirname, '/../../public')));

router.use(cookieParser());
router.use(bodyParser.json());
router.use(db, function (req, res, next) {
    session({
        secret: 'some secret',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({db: req.db})
    })(req, res, next);
});

router.use(auth);

router.use('/public', public);

router.use("/api", auth.isAuthenticated, jump);
router.use('/api/transactions', coll('transactions'), db, transactions, crud);
router.use('/api/pendingtnxs', coll('pendingtnxs'), db, transactions, crud);
router.use('/api/accounts', coll('accounts'), db, crud);
router.use('/api/categories', coll('categories'), db, crud);
router.use('/api/banklink', banklink);

router.use('/api/admin', auth.ensureAdmin, jump);
router.use('/api/admin', admin, jump);
router.use('/api/admin/config', coll('config'), db, ignoreOwner, crud);

router.use('/debug', debug);

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

function jump(req, res, next) {
    next();
}

function ignoreOwner(req, res, next) {
    req.ignoreOwner = true;
    next();
}
/////////////////////
/// MODULE EXPORT

module.exports = router;