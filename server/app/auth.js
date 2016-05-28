var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var router = express.Router();

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
    if (id == '31337') {
        done(null, {id: '31337', username: 'admin'});
    }
    else if (id == '4006') {
        done(null, {id: '4006', username: 'noob'});
    }
    else {
        done({error: "no such user"});
    }
});

passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
        console.log("authenticating");
        if (username == 'admin' && password == 'simple') {
            return done(null, {id: '31337', username: 'admin'});
        } else if (username == 'noob' && password == 'simple') {
            return done(null, {id: '4006', username: 'noob'});
        } else {
            return done(null, false, {message: 'Incorrect username or password.'});
        }
    }
));

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