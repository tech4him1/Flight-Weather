import * as mapHandlers from './map_handlers/index';

export function createMap(mapType, mapID) {
  var map = L.map(mapID).setView([39.8282, -98.5795], 4);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  mapHandlers[mapType](function(layers){
    for (let layer in layers) {
      if (layers.hasOwnProperty(layer)) {
        map.addLayer(layers[layer]);
      }
    }
    L.control.layers(null, layers).addTo(map);
  });
}
