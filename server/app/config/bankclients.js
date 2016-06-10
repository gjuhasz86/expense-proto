var env = process.env;
var conf = {};

conf.citiclient = env.OPENSHIFT_EXPENSE_CITI_CLIENT;

module.exports = conf;