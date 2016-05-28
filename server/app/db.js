var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var dbConf = require('./config/database');

var router = express.Router();
var mongo = mongodb.MongoClient;

var myDb = undefined;
mongo.connect(dbConf.url, function (err, db) {
    if (err) {
        console.error("Could not initialize database");
        return console.error(err);
    } else {
        console.log("Database has been initialized");
        myDb = db;
    }
});

router.use(function (req, res, next) {
    req.db = myDb;
    next();
});

module.exports = router;