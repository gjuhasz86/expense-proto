# expense-proto
Expense manager prototype
NOTE: packages are severely outdated

# Requirements
Verified to work with `nodejs` and `npm` versions:
```
$ node -v
v14.17.4

$ npm -v
6.14.14
```

Needs a running mongodb instance. Verifed with version 3.2

# Build
```
cd server
npm install
cd ../public
npm install
npm run tsc
```

# Run
```
# copy sample start script
cp local.sh.sample local.sh
chmod 755 local.sh

# edit local.sh and fill in the proper values

# run the server
local.sh
```
