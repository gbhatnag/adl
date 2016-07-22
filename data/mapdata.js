// node modules
const readline = require('readline');
const fs = require('fs');

// filename constants
var LAW_DATA = 'laws_wn.json';
var OUTPUT_DATA = 'laws_wn_latlon.json';
var DATA_FILE = 'mapdata/dc_latlon01.csv';

// load current JSON data
var lawdata = JSON.parse(fs.readFileSync(LAW_DATA, 'utf8'));
var laws = lawdata.laws;

// read and load CSV latitude, longitude data
var dcs = {};
const rl = readline.createInterface({
  input: fs.createReadStream(DATA_FILE)
});

console.log('// Start reading CSV file');
rl.on('line', function (row) {
  var columns = row.split(',');
  if (columns[0]) {
    console.log('Processing: ', row);
    dcs[columns[0]] = {
      lat: parseFloat(columns[1]),
      lon: parseFloat(columns[2])

    };
  }
}).on('close', function () {
  console.log('// Done reading CSV file');
  console.log('// Merging law data with latitude-longitude data');

  // merge law data with latitude-longitude data
  laws.forEach(function (law) {
    var dc = dcs[law.name];
    if (dc) {
      law.location = {
        "lat": dc.lat,
        "lon": dc.lon
      };
    }
  });

  console.log("// Writing new data to: " + OUTPUT_DATA);
  var json = {laws: laws};
  fs.writeFileSync(OUTPUT_DATA, JSON.stringify(json, null, 2));

  console.log('// Done');
  process.exit(0);
});
