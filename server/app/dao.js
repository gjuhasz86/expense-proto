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

router.use(bodyParser.json());

router.post('/save', function (req, res) {
    req.body.user = req.user.id;
    console.log('saving ' + JSON.stringify(req.body));
    var coll = req.collection;
    var db = req.db;
    db.collection(coll).insertOne(req.body, function (err, result) {
        console.log(result.ops[0]);
        res.send(result.ops[0]);
    });
});

router.get('/list', function (req, res) {
    req.query.user = req.user.id;
    console.log("querying " + JSON.stringify(req.query));
    var coll = req.collection;
    var db = req.db;
    db.collection(coll).find(req.query).toArray(function (err, docs) {
        // console.log(docs);
        res.send(docs);
    });
});

router.post('/delete', function (req, res) {
    console.log("deleting " + JSON.stringify(req.body));
    var idToDelete = new mongodb.ObjectID(req.body._id);
    console.log(idToDelete);
    var coll = req.collection;
    var db = req.db;
    db.collection(coll).deleteOne({_id: idToDelete, user: req.user.id}, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log(docs.deletedCount);
        }
        res.end();
    });
});

router.post('/update', function (req, res) {
    console.log("updating " + JSON.stringify(req.body));
    var idToUpdate = new mongodb.ObjectID(req.body._id);
    console.log(idToUpdate);
    req.body._id = idToUpdate;
    var coll = req.collection;
    var db = req.db;
    db.collection(coll).updateOne({_id: idToUpdate, user: req.user.id}, req.body, null, function (err, docs) {
        if (err)
            console.log(err);
        else {
            // console.log(docs);
            console.log(docs.modifiedCount);
        }
        res.end();
    });
});

module.exports = router;