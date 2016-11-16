var router = require('express').Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/debug', function (req, res) {
    var q = req.query;
    console.log("reading debug");
    console.log(q);
    res.send({ok: 1});
});


router.get('/debugsys', function (req, res) {
    console.log("debugsys called");
    res.end();
});


module.exports = router;

