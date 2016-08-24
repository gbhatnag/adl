// node modules
const fs = require("fs");
const firebase = require("firebase");
const data = JSON.parse(fs.readFileSync('geocouncils.json', 'utf8'));

// initialize firebase database
firebase.initializeApp({
  serviceAccount: "/Users/gcb/code/auth/AfricanDrummingLaws-5837bc435a4c.json",
  databaseURL: "https://africandrumminglaws.firebaseio.com"
});
const db = firebase.database();
db.ref("geo/councils").set(data);
