var env = process.env;
var conf = {};

conf.citiclient = env.OPENSHIFT_DATA_DIR + env.OPENSHIFT_EXPENSE_CITI_CLIENT;

module.exports = conf;