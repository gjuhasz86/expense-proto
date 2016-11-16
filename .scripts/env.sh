echo -n "Git repo (Leave empty if app is existing on openshift): "
read gitrepo
echo -n "App name: "
read app

if [ -z "$gitrepo" ]; then
  d_dbname=$(rhc ssh -a $app 'echo $EXPENSE_DB');
  d_user=$(rhc ssh -a $app 'echo $EXPENSE_DB_USER');
  d_pass=$(rhc ssh -a $app 'echo $EXPENSE_DB_PWD');
  d_googleclid=$(rhc ssh -a $app 'echo $EXPENSE_GOOGLE_CLIENT_ID');
  d_googleclsec=$(rhc ssh -a $app 'echo $EXPENSE_GOOGLE_CLIENT_SECRET');
fi

echo -n "Database name [$d_dbname]: "
read dbname
dbname=${dbname:-$d_dbname}

echo -n "Database user name [$d_user]: "
read user
user=${user:-$d_user}

echo -n "Database user password [$d_pass]: "
read pass
pass=${pass:-$d_pass}

echo -n "Google client id [$d_googleclid]: "
read googleclid
googleclid=${googleclid:-$d_googleclid}

echo -n "Google client secret [$d_googleclsec]: "
read googleclsec
googleclsec=${googleclsec:-$d_googleclsec}

#d_citi=$(rhc ssh -a $app 'echo $EXPENSE_DB');
#echo -n "Citibank client location on server: "
#read citi

echo
echo rhc env-set EXPENSE_DB=$dbname -a $app;
echo rhc env-set EXPENSE_DB_USER=$user -a $app;
echo rhc env-set EXPENSE_DB_PWD=$pass -a $app;
echo rhc env-set EXPENSE_GOOGLE_CLIENT_ID=$googleclid -a $app;
echo rhc env-set EXPENSE_GOOGLE_CLIENT_SECRET=$googleclsec -a $app;
echo

while true; do
    read -p "Continue? (y/n)?" yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done


if [ -z "$gitrepo" ]; then
  echo "Skip creating app";
else
  rhc app-create $app https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml --from-code $gitrepo;

  rhc cartridge add -c https://raw.githubusercontent.com/gjuhasz86/openshift-cartridge-mongodb/master/metadata/manifest.yml --app $app;

  rhc app-restart -a $app;
fi


echo "setting dns $appdns"
appdns=$(rhc ssh -a $app 'echo $OPENSHIFT_APP_DNS');
mongoip=$(rhc ssh -a $app 'echo $OPENSHIFT_MONGODB_IP');
mongoport=$(rhc ssh -a $app 'echo $OPENSHIFT_MONGODB_PORT');


rhc env-set EXPENSE_DB=$dbname -a $app;
rhc env-set EXPENSE_DB_USER=$user -a $app;
rhc env-set EXPENSE_DB_PWD=$pass -a $app;
rhc env-set EXPENSE_MONGODB_DB_HOST=$mongoip -a $app;
rhc env-set EXPENSE_MONGODB_DB_PORT=$mongoport -a $app;

rhc env-set EXPENSE_GOOGLE_CLIENT_ID=$googleclid -a $app;
rhc env-set EXPENSE_GOOGLE_CLIENT_SECRET=$googleclsec -a $app;
rhc env-set EXPENSE_APP_DNS=$appdns -a $app;

# TODO handle case when the user already exists
# create user in the database
addUserCmd="db.getSiblingDB('$dbname').createUser({user:'$user', pwd:'$pass', roles: ['readWrite']})";
rhc ssh -a $app 'mongo $EXPENSE_MONGODB_DB_HOST:$EXPENSE_MONGODB_DB_PORT/$EXPENSE_DB --eval "'$addUserCmd'"';
