/*
 * Print out unique drum names, ids and counts
 */

// node modules
const fs = require('fs');
const _ = require('underscore');

// load data
const lawdata = JSON.parse(fs.readFileSync('laws_drums.json', 'utf8'));
const laws = lawdata.laws;

// define output
var out = {
  namecount: 0,
  idcount: 0,
  names: {},
  ids: {},
  id_name_map: {},
  sorted: {
    by_name: [],
    by_id: [],
    by_namecount: [],
    by_idcount: []
  }
};

// iterate through laws
laws.forEach(function (law) {
  if (law.drums) {
    law.drums.forEach(function (drum) {
      if (out.names[drum.drum_name]) {
        out.names[drum.drum_name]++;
      } else {
        out.names[drum.drum_name] = 1;
      }
      if (out.ids[drum.drum_id]) {
        out.ids[drum.drum_id]++;
      } else {
        out.ids[drum.drum_id] = 1;
      }
      if (out.id_name_map[drum.drum_id]) {
        if (out.id_name_map[drum.drum_id][drum.drum_name]) {
          out.id_name_map[drum.drum_id][drum.drum_name]++;
        } else {
          out.id_name_map[drum.drum_id][drum.drum_name] = 1;
        }
      } else {
        var obj = {};
        obj[drum.drum_name] = 1;
        out.id_name_map[drum.drum_id] = obj;
      }
    });
  }
});

// count data
out.namecount = Object.keys(out.names).length;
out.idcount = Object.keys(out.ids).length;

// sort data
var _sortednames = _.sortBy(_.keys(out.names));
_sortednames.forEach(function (name) {
  var obj = {};
  obj[name] = out.names[name];
  out.sorted.by_name.push(obj);
});
var _sortedids = _.sortBy(_.keys(out.ids));
_sortedids.forEach(function (id) {
  var obj = {};
  obj[id] = out.ids[id];
  out.sorted.by_id.push(obj);
});
out.sorted.by_namecount = _.sortBy(out.sorted.by_name, function (obj) {
  return -_.values(obj)[0];
});
out.sorted.by_idcount = _.sortBy(out.sorted.by_id, function (obj) {
  return -_.values(obj)[0];
});

// write stats data
fs.writeFileSync('drum_stats.json', JSON.stringify(out, null, 2));

process.exit();
