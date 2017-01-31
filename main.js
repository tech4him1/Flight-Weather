const styles = {
  "TURB-HI": { color: "darkorange" },
  "TURB-LO": { color: "darkred" },
  "LLWS": { color: "darkpurple" },
  "ICE": { color: "darkblue" },
  "FZLVL": { color: "blue" },
  "IFR": { color: "darkpurple" },
  "MT_OBSC": { color: "darkpink" },
}

const disabledTypes = ["FZLVL", "IFR", "MT_OBSC"];

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
      flightPath: "0;KDEN;KSHR",
      hoursBeforeNow: 3,
  },
  dataType : "xml",
  crossDomain: true,
})
.done(function( xml ) {
  console.log(xml);
  $( xml ).find( "GAIRMET" ).each(function(){
    let type = $( this ).children( "hazard" ).attr( "type" );
    if ( disabledTypes.includes(type) ) return;
    let outline = [];
    $( this ).find( "area point" ).each(function(){
        let longitude = $(this).children("longitude")[0].innerHTML;
        let latitude = $(this).children("latitude")[0].innerHTML;
        outline.push([Number(latitude), Number(longitude)]);
    });
    // Remove duplicate beginning and ending elements.
    outline = removeBeginEndDuplicates(outline);
    let geometry_type =  $( this ).children( "geometry_type" )[0].innerHTML;
    if (geometry_type === "AREA") {
      L.polygon(outline, styles[type])
        .addTo(mainMap)
        .bindTooltip(type);
    } else if (geometry_type === "LINE") {
      L.polyline(outline, styles[type])
        .addTo(mainMap);
    }
  });
});

function removeBeginEndDuplicates(polygon) {
  return polygon;//FILLER
}
