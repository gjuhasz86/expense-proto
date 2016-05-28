#run this from gitbash

echo -n "App name: "
read app
echo -n "Database name: "
read dbname
echo -n "Database user name: "
read user
echo -n "Database user password: "
read pass

rhc env-set OPENSHIFT_EXPENSE_DB=$dbname -a $app
rhc env-set OPENSHIFT_EXPENSE_USER=$user -a $app
rhc env-set OPENSHIFT_EXPENSE_PWD=$pass -a $app