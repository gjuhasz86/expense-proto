var env = process.env;

var conf = {};

conf.clientId = env.EXPENSE_GOOGLE_CLIENT_ID;
conf.clientSecret = env.EXPENSE_GOOGLE_CLIENT_SECRET;
conf.callbackURL = env.EXPENSE_APP_REDIRECT_PROTOCOL + "://" + env.EXPENSE_APP_DNS + "/auth/google/callback"

module.exports = conf;