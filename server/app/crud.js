var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var router = express.Router();

// router.use(bodyParser.json());

router.post('/save', function (req, res) {
    console.log("reading debug");
    console.log(req.debug);
    req.body.owner = req.user.id;
    delete req.body._id;
    var coll = req.collection;
    console.log('saving ' + coll + " " + JSON.stringify(req.body));
    var db = req.db;
    db.collection(coll).insertOne(req.body, function (err, result) {
        console.log(result.ops[0]);
        res.send(result.ops[0]);
    });
});

router.post('/savemany', function (req, res) {
    req.body.forEach(function (item) {
        item.owner = req.user.id;
        delete item._id;
    });
    var coll = req.collection;
    console.log('saving ' + coll + " " + JSON.stringify(req.body));
    var db = req.db;
    db.collection(coll).insertMany(req.body, function (err, result) {
        console.log(result.ops[0]);
        res.send(result.ops[0]);
    });
});

router.post('/list', function (req, res) {
    req.body.owner = req.user.id;
    var coll = req.collection;
    console.log("querying " + coll + " " + JSON.stringify(req.body));
    var db = req.db;
    db.collection(coll).find(req.body).toArray(function (err, docs) {
        console.log(JSON.stringify(req.body) + ' found:' + docs.length);
        res.send(docs);
    });
});

router.post('/delete', function (req, res) {
    var coll = req.collection;
    console.log("deleting " + coll + " " + JSON.stringify(req.body));
    var idToDelete = new mongodb.ObjectID(req.body._id);
    console.log(idToDelete);
    var db = req.db;
    db.collection(coll).deleteOne({_id: idToDelete, owner: req.user.id}, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log(docs.deletedCount);
        }
        res.end();
    });
});

router.post('/deletemany', function (req, res) {
    var ids = req.body.map(function (item) {
        return new mongodb.ObjectID(item);
    });
    var delObj = { _id: { "$in": ids}, owner: req.user.id};
    var coll = req.collection;
    console.log('deleting many ' + coll + " " + JSON.stringify(delObj));
    var db = req.db;
    db.collection(coll).deleteMany(delObj, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log(docs.deletedCount);
        }
        res.end();
    });

});


router.post('/update', function (req, res) {
    var coll = req.collection;
    console.log("updating1 " + coll + " " + JSON.stringify(req.body));
    var idToUpdate = new mongodb.ObjectID(req.body._id);
    console.log(idToUpdate);
    req.body._id = idToUpdate;
    var db = req.db;

    var find = {_id: idToUpdate};
    if (!req.ignoreOwner) {
        req.body.owner = req.user.id;
        find.owner = req.user.id;
    }
    console.log("updating2 " + coll + " " + JSON.stringify(req.body));
    db.collection(coll).updateOne(find, req.body, null, function (err, docs) {
        if (err)
            console.log(err);
        else {
            console.log(docs.modifiedCount);
        }
        res.end();
    });
});

module.exports = router;