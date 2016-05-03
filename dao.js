var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var mongodb = require('mongodb');
var mongo = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/test';
var myDb;

function connect(callback) {
    if (myDb === undefined) {
        mongo.connect(url, function (err, db) {
            if (err) {
                return callback(err)
            }
            myDb = db;
            callback(null, db);
        });
    } else {
        callback(null, myDb);
    }
}

router.use(function (req, res, next) {
    connect(function (err, db) {
        if (err) {
            console.log("Error connecting to database: " + err);
            res.writeHead(500);
            res.end();
        } else {
            req.db = db;
            next();
        }
    });
});

router.use(bodyParser.json());

// define the home page route
router.get('/', function (req, res) {
    console.log(req.collection);
    res.send('Birds home page');
});

router.post('/save', function (req, res) {
    console.log('saving ' + JSON.stringify(req.body));
    var coll = req.collection;
    var db = req.db;
    db.collection(coll).insertOne(req.body, function (err, result) {
        console.log(result.ops[0]);
        res.send(result.ops[0]);
    });
});

router.get('/list', function (req, res) {
    console.log("querying " + req.query);
    console.log(req.query);
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
    db.collection(coll).deleteOne({_id: idToDelete}, function (err, docs) {
        if (err)
            console.log(err);
        else {
            // console.log(docs);
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
    db.collection(coll).updateOne({_id: idToUpdate}, req.body, null, function (err, docs) {
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