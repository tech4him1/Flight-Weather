var mymap = L.map('mapid');//.setView([51.505, -0.09], 13);

L.tileLayer('https://[a|b|c].tile.openstreetmap.org/${z}/${x}/${y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  //maxZoom: 18,
}).addTo(mymap);

$.get({
  url: "//www.aviationweather.gov/adds/dataserver_current/httpparam",
  data: {
      dataSource: "gairmets",
      requestType: "retrieve",
      format: "xml",
      flightPath: "KSGU;KDEN;KSHR",
  },
  dataType : "jsonp",
  crossDomain: true,
})
.done(function( xml ) {
  $xml = $.parseXml(xml);
  var airmets = $xml.find( "GAIRMET" );
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
