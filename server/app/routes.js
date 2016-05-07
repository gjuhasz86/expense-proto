var express = require('express');
var path = require('path');
var dao = require('./dao');

var router = express.Router();


router.use(express.static(path.join(__dirname, '/../../public')));

router.use("/api", function (res, req, next) {
    console.log("foooooooo");
    next();
});

// DB access routes
router.use('/api/transactions', coll('transactions'), dao);
router.use('/api/accounts', coll('accounts'), dao);

router.get('/debug', function (req, res) {
    console.log("debug");
    console.log(req.query);
    res.send('debug called');
});

router.get('/health', function (req, res) {
    res.writeHead(200);
    res.end();
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