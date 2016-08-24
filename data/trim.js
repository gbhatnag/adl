/*
 * Certain strings in our JSON have surrounding whitespace we need to trim.
 review lines: 526
 */
const fs = require("fs");
const _ = require('underscore');
var data = JSON.parse(fs.readFileSync('africandrumminglaws-export.json', 'utf8'));
var laws = _.values(data.laws);
laws.forEach(function (law) {
  law.council = law.council.trim();
  law.title = law.title.trim();
  if (law.signatories) {
    law.signatories.forEach(function (signer) {
      signer.name  = signer.name.trim();
      signer.org   = signer.org.trim();
      signer.title = signer.title.trim();
    })
  }
});
console.log("Writing data");
fs.writeFileSync('adl-export.json', JSON.stringify({geo:data.geo, laws:laws}, null, 2));
process.exit();
