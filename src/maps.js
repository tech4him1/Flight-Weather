//import L from 'leaflet';
//import $ from 'jQuery';

import gairmets from './map_handlers/gairmets';

import flightData from './flightdata.json';

var mainMap = L.map('mainMap').setView([39.8282, -98.5795], 4);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mainMap);

$.get({
  url: "https://adds-forwarder.herokuapp.com/dataserver_current/httpparam",
  data: {
      dataSource: "gairmets",
      requestType: "retrieve",
      format: "xml",
      flightPath: flightData.variance + ";" + flightData.path,
      hoursBeforeNow: 3, // We just need the latest forecasts.
  },
  dataType : "xml",
  crossDomain: true,
})
.done(function(data){
  let layers = gairmets(data);
  for (let layer in layers) {
    if (layers.hasOwnProperty(layer)) {
      mainMap.addLayer(layers[layer]);
    }
  }
  L.control.layers(null, layers).addTo(mainMap);
});
