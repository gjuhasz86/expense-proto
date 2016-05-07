var env = process.env;

var conf = {};

conf.user = env.OPENSHIFT_EXPENSE_USER;
conf.pass = env.OPENSHIFT_EXPENSE_PWD;
conf.host = env.OPENSHIFT_MONGODB_DB_HOST;
conf.port = env.OPENSHIFT_MONGODB_DB_PORT;
conf.db = env.OPENSHIFT_EXPENSE_DB;

conf.userPass = function () {
    if (this.user)
        return this.user + ':' + this.pass;
    else
        return "";
}.bind(conf)();

conf.url = function () {
    var u = 'mongodb://' + this.userPass + '@' + this.host + ':' + this.port + '/' + this.db;
    console.log(u);
    return u;
}.bind(conf)();

module.exports = conf;