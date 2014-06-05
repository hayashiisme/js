// googlemaps apiで地図とストリートビュー、ルートを使う
// 
//
var svGeo = new google.maps.Geocoder();
var svDir = new google.maps.DirectionsService();
var svStv = new google.maps.StreetViewService();
var aEnd, pEnd; // 目的地の名称と位置
var map, dir;

function mapRoute(a){
  var q = {origin:a, destination:aEnd,
           travelMode: google.maps.TravelMode.WALKING};
  svDir.route(q, function(r, s){
    if(s == google.maps.DirectionsStatus.OK){
      dir.setDirections(r);
    }
  });
}

function nearbyPano(pos){
  var radius = 200; //メートル
  svStv.getPanoramaByLocation(pos, radius, function(r, s){
    if(s == google.maps.StreetViewStatus.OK){
      var panoOptions = {pano: r.location.pano, //position: r.location.pano,
                         pov: { heading:165, pitch:10}, zoom: 1};
      var pano = new google.maps.StreetViewPanorama(
        document.getElementById('streetview-canvas'), panoOptions);
      //pano.setVisible(true);
      map.setStreetView(pano);
    }
  });
}

function initialize(){
  var o = document.getElementById('route-end');
  aEnd = o.innerHTML; // 目的地の名称
  svGeo.geocode({'address': aEnd}, function(r, s){ // 目的地の位置
    if(s == google.maps.GeocoderStatus.OK){
      pEnd = r[0].geometry.location;
      var mapOptions = { zoom:12, center: pEnd}; // zoom値を可変にしたい
      map = new google.maps.Map(
        document.getElementById('map-canvas'), mapOptions); // 地図生成
      dir = new google.maps.DirectionsRenderer();
      dir.setMap(map);
      nearbyPano(pEnd);
    }
  });
}

function getRoute(a){
  svGeo.geocode({'address': a}, function(r, s){ // 出発地の位置
    if(s == google.maps.GeocoderStatus.OK){
      var p = r[0].geometry.location;
      nearbyPano(p);
      mapRoute(a);
    }
  });
}

function getRouteFromSelect(){
  var o = document.getElementById('route-starts');
  var i = o.selectedIndex;
  getRoute(o.options[i].value);
}

google.maps.event.addDomListener(window, 'load', initialize);
