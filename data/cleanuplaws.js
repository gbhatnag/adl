/*
 * Standardize law data collected thus far
 */

// node modules
const fs = require("fs");

// helper function to clean up citations
// i.e. "W.R.L.N. 13 of 1956" --> "WRLN13of1956"
var sanitizeCitation = function (str) {
  return str.split('.').join('').split(' ').join('');
};

// load data
var lawdata = JSON.parse(fs.readFileSync('laws_drums.json', 'utf8'));
var laws = lawdata.laws;

// change data
laws.forEach(function (law) {
  // remove keys
  delete law.key;
  if (law.adopted_from) {
    law.adopted_from.forEach(function (citation) {
      delete citation.key;
    });
  }
  if (law.revokes) {
    law.revokes.forEach(function (citation) {
      delete citation.key;
    });
  }

  // consolidate citations
  if (law.adopted_from) {
    var adopted_array = [];
    law.adopted_from.forEach(function (citation) {
      adopted_array.push(sanitizeCitation(citation.citation));
    });
    law.adopted_from = adopted_array;
  }
  if (law.revokes) {
    var rarr = [];
    law.revokes.forEach(function (citation) {
      rarr.push(sanitizeCitation(citation.citation));
    });
    law.revokes = rarr;
  }

  // convert year to date_of_publication; add other new fields
  if (law.year) {
    law.date_of_publication = law.year;
    law.date_of_issue = "get from law document";
    law.date_of_effect = "get from law document";
    law.adopted_from = [];
    law.signatories = [];
    law.revokes = [];
    delete law.year;
  }

  // convert name to title
  if (law.name) {
    law.title = law.name;
    law.council = law.name;
    delete law.name;
  }

  // add id
  law.id = sanitizeCitation(law.citation);

  // check for no citation
  if (!law.citation) {
    console.log(law.pdfPath);
  }
});

// write new data
console.log("Writing data");
fs.writeFileSync('laws_fullish.json', JSON.stringify({laws:laws}, null, 2));

process.exit();
