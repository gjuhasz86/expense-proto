var router = require('express').Router();
var bodyParser = require('body-parser');

var db = require('./db');

router.use(bodyParser.json());

router.get('/test', function (req, res) {
    return res.send({ok: 1});
});

function ensureAdmin(req, res, next) {
    var user = req.user.id;
    db.dbRef.collection("admins").find({userId: user}).limit(1).next(function (err, doc) {
        console.log("Checking for admin rights [" + user + "]");
        console.log(JSON.stringify(doc));
        if (doc) {
            return next();
        } else {
            return res.sendStatus(401);
        }
    });
};

module.exports = router;

