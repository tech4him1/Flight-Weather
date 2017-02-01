import flightData from '../flightdata.json';
import {removeBeginEndDuplicates, addToLayer} from './helpers.js';

var flightTime = new Date(flightData.time);

const styles = {
  "TURB-HI": { color: "darkorange" },
  "TURB-LO": { color: "darkred" },
  "LLWS": { color: "brown" },
  "ICE": { color: "darkblue" },
  "FZLVL": { color: "blue" },
  "IFR": { color: "darkpurple" },
  "MT_OBSC": { color: "darkpink" },
}

// A storage space for groups of layers.
var layers = {};

export default function(callback) {
  $.get({
    url: "https://adds-forwarder.herokuapp.com/dataserver_current/httpparam",
    data: {
        dataSource: "airsigmets",
        requestType: "retrieve",
        format: "xml",
        flightPath: flightData.variance + ";" + flightData.path,
        hoursBeforeNow: 4, // We just need the latest forecasts. This does exclude hurracaines.
    },
    dataType : "xml",
    crossDomain: true,
  })
  .done(function( xml ) {
    $( xml )
      .find( "AIRSIGMET" )
      .filter(function(){
        // Only use SIGMETs if they apply to the flight time.
        let sigmet_start_time = new Date( $( this ).children( "valid_time_from" ).text() );
        let sigmet_end_time = new Date( $( this ).children( "valid_time_to" ).text() );
        if ((flightTime >= sigmet_start_time) && (flightTime <= sigmet_end_time)) {
          return true;
        }
      })
      .each(function(){
        var mapItem;

        // Get the hazard type.
        let type = $( this ).children( "hazard" ).attr( "type" );

        // Make an outline of the polygon from the points.
        let outline = [];
        $( this ).find( "area point" ).each(function(){
            let longitude = $(this).children("longitude").text();
            let latitude = $(this).children("latitude").text();
            outline.push([Number(latitude), Number(longitude)]);
          });

          // Remove duplicate beginning and ending elements.
          outline = removeBeginEndDuplicates(outline);

          // SIGMETs are always polygons.
          mapItem = L.polygon(outline, styles[type])
            .bindPopup(type);

          // Add the item to the appropriate layer.
          addToLayer(layers, mapItem, type);
        });
      callback(layers);
    });
}
