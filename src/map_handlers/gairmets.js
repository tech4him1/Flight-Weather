import flightData from '../flightdata.json';
import {removeBeginEndDuplicates, addToLayer} from './helpers.js';

var flightTime = new Date(flightData.time);
console.log(flightData.time, flightTime);

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

const HOURS = 60*60*1000;

// A storage space for groups of layers.
var layers = {};

export default function( xml ) {
  $( xml )
    .find( "GAIRMET" )
    .filter(function(){
      // Only use AIRMETs that are 1.5 hours or less from the flight time. AIRMETs are issued every three hours for three hour periods in advance, so 1.5 hours is half of 3.
      let airmet_time = new Date( $( this ).children( "expire_time" ).text() );
      if (Math.abs(airmet_time - flightTime) < 1.5*HOURS) {
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

        // Add the item to the appropriate layer.
        addToLayer(layers, mapItem, type);
      });
  return layers;
}
