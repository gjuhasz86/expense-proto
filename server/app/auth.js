var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var db = require('./db');

var router = express.Router();
var env = process.env;

router.use(passport.initialize());
router.use(passport.session());

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())return next();
    res.sendStatus(401);
};

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    // if (id == '31337') {
    //     done(null, {id: '31337', username: 'admin'});
    // }
    // else if (id == '4006') {
    //     done(null, {id: '4006', username: 'noob'});
    // }
    // else {
    //     done({error: "no such user"});
    // }
    db.dbRef.collection("users").find({id: id}).limit(1).next(function (err, doc) {
        console.log("deserialized user");
        console.log(JSON.stringify(doc));
        return done(null, doc);
    })
});

passport.use(new GoogleStrategy({
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        console.log("authenticating");
        console.log(JSON.stringify(profile));
        db.dbRef.collection("users").findOneAndUpdate(
            {id: profile.id},
            {$set: {id: profile.id, username: profile.displayName}},
            {upsert: true, returnOriginal: false}, function (err, r) {
                console.log("created user");
                console.log(JSON.stringify(r));
                return done(null, r.value);
            }
        );


    }
));

// passport.use('local-login', new LocalStrategy(
//     function (username, password, done) {
//         console.log("authenticating");
//         if (username == 'admin' && password == 'simple') {
//             return done(null, {id: '31337', username: 'admin'});
//         } else if (username == 'noob' && password == 'simple') {
//             return done(null, {id: '4006', username: 'noob'});
//         } else {
//             return done(null, false, {message: 'Incorrect username or password.'});
//         }
//     }
// ));

router.get('/auth/google',
    passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}));

router.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/');
    });


router.post('/auth/login', passport.authenticate('local-login'), function (req, res) {
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

module.exports = router;