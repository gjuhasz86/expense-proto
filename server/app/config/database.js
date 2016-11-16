var env = process.env;

var conf = {};

conf.user = env.EXPENSE_DB_USER;
conf.pass = env.EXPENSE_DB_PWD;
conf.host = env.EXPENSE_MONGODB_DB_HOST;
conf.port = env.EXPENSE_MONGODB_DB_PORT;
conf.db = env.EXPENSE_DB;

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