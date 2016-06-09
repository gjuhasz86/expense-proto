var router = require('express').Router();
var bodyParser = require('body-parser');
var sys = require('sys');
var exec = require('child_process').exec;

var db = require('./db');

router.use(bodyParser.json());

router.post('/citibank', function (req, res, next) {
    var owner = req.user.id;
    var user = req.body.user;
    var pass = req.body.pass;
    exec("java -jar d:\\_dev\\scala\\citi-downloader.jar " + user + " " + pass, function (error, stdout, stderr) {
        console.log(error);
        console.log(stdout);
        console.log(stderr);
        if (!error) {
            var tnxs = JSON.parse(stdout);
            var r = JSON.stringify(tnxs, null, 2);
            console.log(r);

            var refs = tnxs.map(function (t) {
                return t.reference;
            });
            console.log(refs);
            db.dbRef.collection("transactions").find({
                reference: {$in: refs},
                owner: owner
            }, {reference: 1}).toArray(function (err0, docs) {
                if (err0) {
                    console.error(err0);
                    res.send(500);
                }
                console.log(JSON.stringify(refs) + ' found:' + docs.length);

                tnxs.forEach(function (item) {
                    item.date = new Date(item.date);
                    item.owner = req.user.id;
                });
                var coll = "pendingtnxs";
                console.log('saving ' + coll + " " + JSON.stringify(tnxs));
                db.dbRef.collection(coll).insertMany(tnxs, function (err, result) {
                    if (!err) {
                        console.log(result.ops[0]);
                        res.send(result.ops[0]);
                    } else {
                        console.error("ERROR saving");
                        console.error(err);
                        res.send([]);
                    }
                });
            });
        } else {
            res.end();
        }
    });
})
;


module.exports = router;