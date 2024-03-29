var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;

var db = require('./db');

var router = express.Router();
var authConf = require('./config/auth');

router.use(passport.initialize());
router.use(passport.session());

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())return next();
    res.sendStatus(401);
};

function ensureAdmin(req, res, next) {
    var user = req.user.id;
    db.dbRef.collection("admins").find({userId: user}).limit(1).next(function (err, doc) {
        console.log("Checking for admin rights [" + user + "]" + typeof user);
        console.log(JSON.stringify(doc));
        if (doc) {
            return next();
        } else {
            return res.sendStatus(401);
        }
    });
};

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.dbRef.collection("users").find({id: id}).limit(1).next(function (err, doc) {
        console.log("deserialized user");
        console.log(JSON.stringify(doc));
        return done(null, doc);
    })
});


passport.use(new GoogleStrategy({
        clientID: authConf.clientId,
        clientSecret: authConf.clientSecret,
        callbackURL: authConf.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
        console.log("authenticating");
        console.log(JSON.stringify(profile));
        globalConf(function (conf) {
            if (conf.signupEnabled) {
                console.log("Signup enabled");
            } else {
                console.log("Signup disabled");
            }

            db.dbRef.collection("users").findOneAndUpdate(
                {id: profile.id},
                {$set: {id: profile.id, username: profile.displayName}},
                {upsert: conf.signupEnabled, returnOriginal: !conf.signupEnabled}, function (err, r) {
                    console.log("created user");
                    console.log(JSON.stringify(r));
                    return done(null, r.value);
                }
            );
        });
    }
));

passport.use(new LocalStrategy(
    function (username, password, done) {
        db.dbRef.collection("users").findOne(
            {username: "test"}, function (err, user) {
                if (err) {
                    return done(err);
                }
                return done(null, user);
            });
    }
));


router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login'],
        prompt: "select_account"
    }));

router.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/');
    });


router.get('/auth/login', passport.authenticate('local'), function (req, res) {
    res.json(req.user);
});


router.get('/auth/logout', function (req, res) {
    console.log('logout');
    req.logout();
    res.sendStatus(200);
});

router.get('/auth/currentuser', isAuthenticated, function (req, res) {
    res.json(req.user);
});

router.isAuthenticated = isAuthenticated;
router.ensureAdmin = ensureAdmin;

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