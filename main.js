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
    let points = $( airmets[i] ).find( "area point" );
    let shape = [];
    for(let j=0; j < points.length; j++) {
        let longitude = $(points[j]).children("longitude")[0].innerHTML;
        let latitude = $(points[j]).children("latitude")[0].innerHTML;
        shape.push([Number(latitude), Number(longitude)]);
    }
    L.polygon(shape).addTo(mymap);
  }
});
