var router = require('express').Router();
var bodyParser = require('body-parser');

var db = require('./db');

router.use(bodyParser.json());

router.get('/globalconfig', function (req, res) {
    globalConf(function (conf) {
        res.send(conf);
    });
});


var defaultGlobalConf = {scope: "global", signupEnabled: true};
function globalConf(callback) {
    db.dbRef.collection("config").findOneAndUpdate(
        {scope: "global"},
        {$setOnInsert: defaultGlobalConf},
        {upsert: true, returnOriginal: false}, function (err, doc) {
            console.log("loaded global config");
            console.log(JSON.stringify(doc));
            return callback(doc.value);
        }
    );
}


module.exports = router;
