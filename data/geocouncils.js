// node modules
const fs = require("fs");
const _ = require("underscore");
const data = JSON.parse(fs.readFileSync('new_entities.json', 'utf8'));
const councils = _.values(data.councils);
var features = [];
councils.forEach(function (council) {
  var location = {
    lon: 4.13611482750207,
    lat: 5.605318891280973
  };
  if (council.location) {
    location = council.location;
  }
  var shortname = council.name.substring(0, council.name.lastIndexOf(' '));
  shortname = shortname.substring(0, shortname.lastIndexOf(' '));
  features.push({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [location.lon, location.lat]
    },
    properties: {
      id: council.id,
      shortname: shortname,
      fullname: council.name,
      numdrums: Object.keys(council.drums).length,
      numlaws: Object.keys(council.laws).length,
      location: council.location
    }
  });
});

console.log("Writing new data");
fs.writeFileSync('geocouncils.json', JSON.stringify({
  type: "FeatureCollection",
  features: features
}, null, 2));
process.exit();
