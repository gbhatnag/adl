/*
 * Create JSON for other entities in the system (Drums, Councils)
 2805
 */
const fs = require("fs");
const _ = require('underscore');
var data = JSON.parse(fs.readFileSync('adl-export.json', 'utf8'));
var laws = _.values(data.laws);
var drums = {};
var councils = {};

// helper function to clean up citations
// i.e. "W.R.L.N. 13 of 1956" --> "WRLN13of1956"
var sanitizeCitation = function (str) {
  return str.split('.').join('').split(' ').join('');
};

// helper function to create unique id based on given string
var hash = function (str) {
  var hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

laws.forEach(function (law) {
  var councilId = hash(law.council);
  if (councils[councilId]) {
    councils[councilId].laws[sanitizeCitation(law.citation)] = true;
    if (law.drums) {
      law.drums.forEach(function (drum) {
        councils[councilId].drums[drum.drum_id] = true;
      });
    }
  } else {
    var location = law.location;
    if (!law.location) {
      console.log(law.citation + " has no location");
      location = null;
    }
    var council_laws = {};
    var councildrums = {};
    council_laws[sanitizeCitation(law.citation)] = true;
    if (law.drums) {
      law.drums.forEach(function (drum) {
        councildrums[drum.drum_id] = true;
      });
    }
    councils[councilId] = {
      id: councilId,
      name: law.council,
      location: location,
      laws: council_laws,
      drums: councildrums
    };
  }

  if (law.drums) {
    law.drums.forEach(function (drum) {
      if (drums[drum.drum_id]) {
        if (drums[drum.drum_id].names[drum.drum_name]) {
          drums[drum.drum_id].names[drum.drum_name]++;
        } else {
          drums[drum.drum_id].names[drum.drum_name] = 1;
        }
        if (drums[drum.drum_id].law_mentions[sanitizeCitation(law.citation)]) {
          drums[drum.drum_id].law_mentions[sanitizeCitation(law.citation)]++;
        } else {
          drums[drum.drum_id].law_mentions[sanitizeCitation(law.citation)] = 1;
        }
        if (drums[drum.drum_id].council_mentions[councilId]) {
          drums[drum.drum_id].council_mentions[councilId]++;
        } else {
          drums[drum.drum_id].council_mentions[councilId] = 1;
        }
      } else {
        var names = {};
        var law_mentions = {};
        var council_mentions = {};
        names[drum.drum_name] = 1;
        law_mentions[sanitizeCitation(law.citation)] = 1;
        council_mentions[councilId] = 1;
        drums[drum.drum_id] = {
          id: drum.drum_id,
          names: names,
          shortdesc: "consult spreadsheet",
          longdesc: "consult spreadsheet",
          picture: "consult spreadsheet",
          law_mentions: law_mentions,
          council_mentions: council_mentions
        };
      }
    });
  } else {
    console.log(law.citation + " has no drums (must adopt or revoke only)");
  }
});

// write new data
console.log("Writing data");
fs.writeFileSync('new_entities.json', JSON.stringify({drums:drums, councils:councils}, null, 2));
process.exit();
