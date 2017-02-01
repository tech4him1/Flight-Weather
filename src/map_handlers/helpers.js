export function removeBeginEndDuplicates(polygon) {
  return polygon;//FILLER
}

export function addToLayer(layers, mapItem, type) {
  if (layers[type] === undefined) {
    layers[type] = L.layerGroup();
  }
  layers[type].addLayer(mapItem);
}
