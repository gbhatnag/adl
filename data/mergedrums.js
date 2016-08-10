/*
 * Merge Stephanie's drum data with master laws JSON
 */

// node modules
const fs = require("fs");

// load data
const lawdata = JSON.parse(fs.readFileSync('laws_wn.json', 'utf8'));
const drumdata = JSON.parse(fs.readFileSync('laws_wn_drums.json', 'utf8'));
const laws = lawdata.laws;
const drums = drumdata.laws;

// consistency checks
if (laws.length != drums.length) {
  console.log("Uhh... check data files. Laws: " + laws.length + ". Drums: " + drums.length);
  process.exit();
}

// iterate through laws and drums in parallel
console.log("Iterating through data");
for (var i = 0; i < laws.length; i++) {
  laws[i].drums = null;
  var drum = drums[i];
  if (drum.drums) {
    laws[i].drums = drum.drums;
  }
}

// write new merged data
console.log("Writing data");
fs.writeFileSync('laws_drums.json', JSON.stringify({laws:laws}, null, 2));

process.exit();
