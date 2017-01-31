var mymap = L.map('mapid').setView([10, 10], 5);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

$.get({
  url: "https://adds-forwarder.herokuapp.com/dataserver_current/httpparam",
  data: {
      dataSource: "gairmets",
      requestType: "retrieve",
      format: "xml",
      flightPath: "112;KSGU;KDEN;KSHR",
      hoursBeforeNow: 6,
  },
  dataType : "xml",
  crossDomain: true,
})
.done(function( xml ) {
  var airmets = $( xml ).find( "GAIRMET" );
  for(let i=0; i < airmets.length; i++) {
    let points = $( airmets[i] ).children( "area point" );
    let shape = [];
    for(let j=0; j < points.length; j++) {
        let longtitude = $(points[j]).children("longtitude")[0];
        let latitude = $(points[j]).children("latitude")[0];
        shape.push([latitude, longtitude];
    }
    L.polygon(shape).addTo(mymap);
  }
});
