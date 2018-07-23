var map;
var marker;
var markers = [];

function carregar_mapa() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: -14.2400732, lng: -53.1805018},
    mapTypeId: 'satellite',
    gestureHandling: 'greedy' // zoom com scroll do mouse
  });
}

function centralizar_mapa(LatLng_cidade) {
  map.setCenter(LatLng_cidade);
  map.setZoom(14);
}

function trazer_colaboradores(cidade_id) {
  $http({
    method: 'GET',
    url: brisanet.api.rh_url + 'api/users_mapa.php?cidade_id='+cidade_id
  }).then(function(response) {
    addMakers(response.data.colaboradores);
    $('.modal').modal('hide');
  })
}

function addMakers(colaboradores) {
  $.each(colaboradores, function (index, colaborador) {
    coord = {
      lat: parseFloat(colaborador.lat),
      lng: parseFloat(colaborador.lng)
    };
    var marker = obterMarkers(coord, colaborador.photo, map);

    // google.maps.event.addListener(marker, 'click', function(event) {
    // 	console.log(coords.coord.lat);
    //  ver_detalhes(colaborador.id);
    // });

    markers.push(marker);
  })
}

function obterMarkers(coords, photo, map) {
  var marker = new google.maps.Marker({
    position: coords,
    map: map,
  });

  var image = {
    url: photo,
    size: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(50, 50)
  };

  marker.setIcon(image);

  return marker;
}

function limparMapa() {
  $.each(markers, function(i, marker){
    try {
      marker.setMap(null);
    } catch(ex){ }
  });

  markers = [];
}
