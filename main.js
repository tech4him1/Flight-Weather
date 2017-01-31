var mymap = L.map('mapid').setView([10, 10], 5);

L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
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
    let points = $( airmets[i] ).find( "area point" );
    for(let j=0; j < points.length; j++) {
        console.log(points[j].innerText);
    }
  }
   L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
  ]).addTo(mymap);
});
