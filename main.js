var mymap = L.map('mapid').setView([39.8282, -98.5795], 4);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

$.get({
  url: "https://adds-forwarder.herokuapp.com/dataserver_current/httpparam",
  data: {
      dataSource: "gairmets",
      requestType: "retrieve",
      format: "xml",
      flightPath: "0;KDEN;KSHR",
      hoursBeforeNow: 2,
  },
  dataType : "xml",
  crossDomain: true,
})
.done(function( xml ) {
  console.log(xml);
  $( xml ).find( "GAIRMET" ).each(function(){
    let shape = [];
    $( this ).find( "area point" ).each(function(){
        let longitude = $(this).children("longitude")[0].innerHTML;
        let latitude = $(this).children("latitude")[0].innerHTML;
        shape.push([Number(latitude), Number(longitude)]);
    });
    L.polygon(shape).addTo(mymap);
  });
});
