echo -n "Git repo (Leave empty if app is existing on openshift): "
read gitrepo
echo -n "App name: "
read app
echo -n "Database name: "
read dbname
echo -n "Database user name: "
read user
echo -n "Database user password: "
read pass
echo -n "Google client id: "
read googleclid
echo -n "Google client secret: "
read googleclsec
echo -n "Citibank client location on server: "
read citi

if [ -z "$gitrepo" ]; then
  echo "Skip creating app";
else
  rhc app-create $app https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml --from-code $gitrepo;
  
  # workaround for npm 3.9.3 bug - delete temporary npm dir
  rhc ssh 'rm -rf app-root/data/.nodejs/lib/node_modules/npm/.nyc_output'

  rhc cartridge add -c mongodb-2.4 --app $app  
  
  rhc cartridge add -c rockmongo --app $app

  rhc app-restart -a $app
fi

# set environment variables that the app is using
rhc env-set OPENSHIFT_EXPENSE_DB=$dbname -a $app
rhc env-set OPENSHIFT_EXPENSE_USER=$user -a $app
rhc env-set OPENSHIFT_EXPENSE_PWD=$pass -a $app
rhc env-set GOOGLE_CLIENT_ID=$googleclid -a $app
rhc env-set GOOGLE_CLIENT_SECRET=$googleclsec -a $app
rhc env-set OPENSHIFT_EXPENSE_CITI_CLIENT=$citi -a $app

# create user in the database
addUserCmd="db.getSiblingDB('$dbname').addUser('$user', '$pass')"
rhc ssh -a $app 'mongo $OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/admin -u $OPENSHIFT_MONGODB_DB_USERNAME -p $OPENSHIFT_MONGODB_DB_PASSWORD --eval "'$addUserCmd'"'

rhc app-restart -a $app