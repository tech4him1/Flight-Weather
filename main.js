var mymap = L.map('mapid');//.setView([51.505, -0.09], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
    let area = airmets[i].find( "area" );
    console.log(area);
  }
   L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
  ]).addTo(mymap);
});
