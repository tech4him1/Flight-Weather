const styles = {
  "TURB-HI": { color: "darkorange" },
  "TURB-LO": { color: "darkred" },
  "LLWS": { color: "brown" },
  "ICE": { color: "darkblue" },
  "FZLVL": { color: "blue" },
  "IFR": { color: "darkpurple" },
  "MT_OBSC": { color: "darkpink" },
}

const disabledTypes = ["FZLVL", "IFR", "MT_OBSC"];

const flightData = {
  path: "KSGU;KDEN;KSHR",
  time: new Date('2017-02-02T14:25:00Z'),
}
const searchDistance = 100;

var timeUntilFlight = flightData.time - Date.now();

const HOURS = 60*60*1000;

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
      flightPath: searchDistance + ";" + flightData.path,
      hoursBeforeNow: 3, // We just need the latest forecasts.
  },
  dataType : "xml",
  crossDomain: true,
})
.done(function( xml ) {
  $( xml )
    .find( "GAIRMET" )
    .filter(function(){
      // Only use AIRMETs that are 1.5 hours or less from the flight time. AIRMETs are issued every three hours for three hour periods in advance, so 1.5 hours is half of 3.
      let airmet_time = new Date( $( this ).children( "expire_time" ).text() );
      if (Math.abs(airmet_time - flightData.time) < 1.5*HOURS) {
        return true;
      }
    })
    .each(function(){
      var mapItem;

      // Get the hazard type.
      let type = $( this ).children( "hazard" ).attr( "type" );

      // Remove unwanted types.
      if ( disabledTypes.includes(type) ) return;

      // Make an outline of the polygon from the points.
      let outline = [];
      $( this ).find( "area point" ).each(function(){
          let longitude = $(this).children("longitude").text();
          let latitude = $(this).children("latitude").text();
          outline.push([Number(latitude), Number(longitude)]);
        });

        // Remove duplicate beginning and ending elements.
        outline = removeBeginEndDuplicates(outline);

        // Is it a polygon or a line?
        let geometry_type =  $( this ).children( "geometry_type" ).text();
        if (geometry_type === "AREA") {
          mapItem = L.polygon(outline, styles[type])
          .bindPopup(type);
        } else if (geometry_type === "LINE") {
          mapItem = L.polyline(outline, styles[type]);
        }

        // Add the item to the layer.
        addToLayer(mapItem, type);

      });

  L.control.layers(null, layers).addTo(mainMap);
});

function removeBeginEndDuplicates(polygon) {
  return polygon;//FILLER
}

var layers = {};
function addToLayer(mapItem, type) {
  if (layers[type] === undefined) {
    layers[type] = L.layerGroup();
    mainMap.addLayer(layers[type]);
  }
  layers[type].addLayer(mapItem);
}
