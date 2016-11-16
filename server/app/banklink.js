var router = require('express').Router();
var bodyParser = require('body-parser');
var sys = require('sys');
var exec = require('child_process').exec;
var _ = require('underscore');

var db = require('./db');
var conf = require('./config/bankclients');

router.use(bodyParser.json());

router.post('/citibank', function (req, res, next) {
    var owner = req.user.id;
    var user = req.body.user;
    var pass = req.body.pass;
    download(conf.citiclient, user, pass, res, function (tnxs, refs) {
        find("transactions", {reference: {$in: refs}, owner: owner}, {reference: 1}, res,
            function (matchingExRefObjs) {
                find("pendingtnxs", {reference: {$in: refs}, owner: owner}, {reference: 1}, res,
                    function (matchingPenRefObjs) {
                        var matchingRefs = matchingExRefObjs.concat(matchingPenRefObjs)
                            .map(function (x) {
                                return x.reference;
                            });
                        var newTnxs = _.chain(tnxs).reject(function (x) {
                            return _.contains(matchingRefs, x.reference);
                        }).value();
                        console.log("New refs: " + newTnxs.length);
                        saveTnxs("pendingtnxs", newTnxs, owner, res);
                    });
            });
    })
});

function download(downloaderPath, user, pass, res, callback) {
    console.log("Downloading transactions fron Citibank for [" + user + "]");
    exec("java -Dfile.encoding=UTF-8 -jar " + downloaderPath + " " + user + " " + pass + " true", {encoding: "utf8"},
        function (error, stdout, stderr) {
            console.error(stderr);
            console.log(stdout.toString('utf8'));
            if (!error) {
                var tnxs = JSON.parse(stdout.toString('utf8'));
                var refs = tnxs.map(function (t) {
                    return t.reference;
                });
                console.log(refs);
                callback(tnxs, refs);
            } else {
                console.error(error);
                return res.sendStatus(500);
            }
        }
    )
    ;
}

function find(coll, filter, project, res, callback) {
    db.dbRef.collection(coll).find(filter, project).toArray(function (err, docs) {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        console.log(JSON.stringify(filter) + ' found:' + docs.length);

        callback(docs);
    });
}

function saveTnxs(coll, tnxs, owner, res) {
    if (tnxs.length == 0) {
        return res.send({});
    }

    tnxs.forEach(function (item) {
        item.date = new Date(item.date);
        item.owner = owner;
    });

    console.log(Array.isArray(tnxs));
    console.log('saving ' + coll + " " + JSON.stringify(tnxs));
    db.dbRef.collection(coll).insertMany(tnxs, function (err, result) {
        if (!err) {
            console.log(result.ops[0]);
            return res.send(result.ops[0]);
        } else {
            console.error("ERROR saving");
            console.error(err);
            return res.sendStatus(500);
        }
    });
}

module.exports = router;