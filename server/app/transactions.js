var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.json());

function validSort(sortField) {
    return !(['date', 'amount', '_id'].indexOf(sortField) == -1);
}

function defaultQuery(q) {
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
        descriptionFilter.$regex = q.description;
        hasDescriptionFilter = true;
    }

    if (hasDescriptionFilter) {
        q.filter.description = descriptionFilter;
    }

}

router.get('/search', function (req, res) {
    var q = req.query;
    defaultQuery(q);
    q.filter.owner = req.user.id;
    var coll = req.collection;
    console.log("querying " + coll + " " + JSON.stringify(req.query));
    req.db.collection(coll).find(q.filter).sort(q.sort).skip(q.skip).limit(q.limit)
        .toArray(function (err, docs) {
            console.log(JSON.stringify(req.query) + ' found:' + docs.length);
            res.send(docs);
        });
});

module.exports = router;