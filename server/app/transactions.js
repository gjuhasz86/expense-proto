var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.json());

function validSort(sortField) {
    return !(['date', 'amount', '_id'].indexOf(sortField) == -1);
}

function defaultSearchQuery(q) {
    var order = 1;
    if (q.order == 'asc') {
        order = 1;
    } else if (q.order == 'desc') {
        order = -1;
    }

    if (!validSort(q.sort)) {
        q.sort = {};
    } else {
        q.sort = JSON.parse('{"' + q.sort + '":' + order + '}');
    }

    if (q.skip == undefined) {
        q.skip = 0;
    } else {
        q.skip = parseInt(q.skip);
    }

    if (q.limit == undefined) {
        q.limit = 0;
    } else {
        q.limit = parseInt(q.limit);
    }

    q.filter = {};
    var dateFilter = {};
    var hasDateFilter = false;
    if (q.startDate != undefined) {
        dateFilter.$gte = new Date(q.startDate).toJSON();
        hasDateFilter = true;
    }

    if (q.endDate != undefined) {
        dateFilter.$lte = new Date(q.endDate).toJSON();
        hasDateFilter = true;
    }

    if (hasDateFilter) {
        q.filter.date = dateFilter;
    }

    var descriptionFilter = {};
    var hasDescriptionFilter = false;

    if (q.description != undefined) {
        // TODO: sanitize user input
        descriptionFilter.$regex = new RegExp(q.description, "i");
        hasDescriptionFilter = true;
    }

    if (hasDescriptionFilter) {
        q.filter.description = descriptionFilter;
    }

    if (q.account != undefined) {
        q.filter.accountId = q.account;
    }

}

router.get('/search', function (req, res) {
    var q = req.query;
    defaultSearchQuery(q);
    q.filter.owner = req.user.id;
    var coll = req.collection;
    console.log("searching " + coll + " " + JSON.stringify(req.query));
    console.log("searching " + coll + " with filter: " + JSON.stringify(q.filter));
    req.db.collection(coll).find(q.filter).sort(q.sort).skip(q.skip).limit(q.limit)
        .toArray(function (err, docs) {
            console.log(JSON.stringify(req.query) + ' found:' + docs.length);
            res.send(docs);
        });
});

router.get('/size', function (req, res) {
    var q = req.query;
    defaultSearchQuery(q);
    q.filter.owner = req.user.id;
    var coll = req.collection;
    console.log("counting " + coll + " " + JSON.stringify(req.query));
    req.db.collection(coll).find(q.filter).sort(q.sort)
        .count(false, {}, function (err, docs) {
            console.log(JSON.stringify(req.query) + ' found:' + docs);
            res.send({count: docs});
        });
});

router.post('/update', function (req, res, next) {
    req.body.date = new Date(req.body.date);
    return next();
});

router.post('/save', function (req, res, next) {
    req.body.date = new Date(req.body.date);
    return next();
});

router.post('/savemany', function (req, res, next) {
    console.log("switching date many");
    req.body.forEach(function (item) {
        item.date = new Date(item.date);
    });
    return next();
});

router.get('/stats/monthly', function (req, res) {
    var q = req.query;
    var coll = req.collection;
    req.db.collection(coll)
        .aggregate([
            // {$match: {owner: req.user.id, date: {$gt: new Date("2016-01-01")}}},
            {$match: {owner: req.user.id}},
            {
                $project: {
                    year: {$year: "$date"},
                    month: {$month: "$date"},
                    day: {$dayOfMonth: "$date"},
                    accountId: "$accountId",
                    amount: "$amount"
                }
            },
            {
                $group: {
                    _id: {
                        accountId: "$accountId",
                        // accountId: "57428e502325366c136bbb96",
                        year: "$year",
                        month: "$month",
                        day: "$day"
                    },
                    sum: {$sum: "$amount"}
                }
            }
        ], function (err, docs) {
            console.log(err);
            console.log(JSON.stringify(req.query) + ' found:' + docs);
            res.send(docs);
        });
});

router.get('/stats/total', function (req, res) {
    var q = req.query;
    var coll = req.collection;
    req.db.collection(coll)
        .aggregate([
            // {$match: {owner: req.user.id, date: {$gt: new Date("2016-01-01")}}},
            {$match: {owner: req.user.id}},
            {
                $project: {
                    year: {$year: "$date"},
                    month: {$month: "$date"},
                    day: {$dayOfMonth: "$date"},
                    // day: 1,
                    // accountId: "$accountId",
                    amount: "$amount"
                }
            },
            {
                $group: {
                    _id: {
                        // accountId: "$accountId",
                        // accountId: "57428e502325366c136bbb96",
                        year: "$year",
                        month: "$month",
                        day: "$day"
                    },
                    sum: {$sum: "$amount"}
                }
            }
        ], function (err, docs) {
            console.log(err);
            console.log(JSON.stringify(req.query) + ' found:' + docs);
            res.send(docs);
        });
});

module.exports = router;