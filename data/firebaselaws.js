// node modules
const fs = require("fs");
const firebase = require("firebase");

// helper function to clean up citations
// i.e. "W.R.L.N. 13 of 1956" --> "WRLN13of1956"
var sanitizeCitation = function (str) {
  return str.split('.').join('').split(' ').join('');
};

// get law data
const lawdata = JSON.parse(fs.readFileSync('laws_fullish.json', 'utf8'));
const laws = lawdata.laws;

// initialize firebase database
firebase.initializeApp({
  serviceAccount: "/Users/gcb/code/auth/AfricanDrummingLaws-5837bc435a4c.json",
  databaseURL: "https://africandrumminglaws.firebaseio.com"
});
const db = firebase.database();

// write law data to the database at /laws
laws.forEach(function (law) {
  var refstr = "laws/" + sanitizeCitation(law.citation);
  console.log("write: " + refstr);
  db.ref(refstr).set(law);
});
