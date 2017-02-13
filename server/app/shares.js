var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var dbConf = require('./config/database');

var router = express.Router();

router.use(function (req, res, next) {
    var owner = req.user.id;
    console.log("Populating shared data");
    var db = req.db;
    db.collection("shares").find({users: owner}).toArray(function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            req.shares = docs.map(function (e) {
                return e.owner;
            });
            req.shares.push(owner);
            console.log('Found shares:' + JSON.stringify(req.shares));
        }
        next();
    });

});

module.exports = router;