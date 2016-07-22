var fs = require("fs");
var prettyjson = require("prettyjson");
var shortid = require("shortid");

var ROOT_DIR = '/Users/gcb/Documents/dost/projects/ADL/Laws';
var REMOTE_DIR = '/laws';

var laws = [];
var years = {
  all: {},
  gambia: {},
  ghana: {},
  malawi: {},
  northern_nigeria: {},
  seychelles: {},
  uganda: {},
  western_nigeria: {}
};

var countries = fs.readdirSync(ROOT_DIR);
for (var i = 0; i < countries.length; i++) {
  var files = fs.readdirSync(ROOT_DIR + '/' + countries[i]);
  for (var j = 0; j < files.length; j++) {
    var filename = files[j].split('.');
    if (filename[1] == "jpeg") {
      continue;
    }
    var fullpath = REMOTE_DIR + '/' + countries[i] + '/' + filename[0];
    var nameparts = filename[0].split('(');
    var law = {};
    law.key = shortid.generate();
    law.countryID = countries[i];
    law.year = nameparts[1].slice(0, 4);
    law.thumbPath = fullpath + ".jpeg";
    law.pdfPath = fullpath + ".pdf";
    law.name = nameparts[0].slice(0, -1);
    if (countries[i] == 'western_nigeria') {
      law.countryLabel = "Western Nigeria";
    } else if (countries[i] == 'northern_nigeria') {
      law.countryLabel = "Northern Nigeria";
    } else {
      law.countryLabel = null;
    }
    var year = law.year.toString();
    years.all[year] = year;
    years[law.countryID][year] = year;
    laws.push(law);
  }
}

var json = {
  laws: laws
};
fs.writeFileSync('laws.json', JSON.stringify(json, null, 2));

var yearjson = {};
Object.keys(years).forEach(function (country) {
  yearjson[country] = [];
  Object.keys(years[country]).forEach(function (year) {
    yearjson[country].push({label:year});
  });
});

console.log(JSON.stringify(yearjson, null, 2));

process.exit();
