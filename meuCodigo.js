var map;
var marker;
var markers = [];

function carregar_mapa() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: -14.2400732, lng: -53.1805018},
    mapTypeId : google.maps.MapTypeId.HYBRID,
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
    var contentString = `<div class="mainInfoWindow">
      <div class="infoWindowImage">
      <img src="${colaborador.photo}" style="height: 40px; width: 40px; border-radius: 100%" />
      </div>
      <div class="infoWindowNameSetor">
      <div>${colaborador.name}</div>
      <div>${colaborador.sector}</div>
      <div>Supervisor: ${colaborador.supervisor}</div>
      </div>
      </div>`;

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });


    coord = {
      lat: parseFloat(colaborador.lat || colaborador.lat_cidade_origem),
      lng: parseFloat(colaborador.lng || colaborador.lng_cidade_origem)
    };
    var marker = obterMarkers(coord, colaborador.photo, colaborador.name, colaborador.cpf, map, colaborador.icone, colaborador.pulando);

    // google.maps.event.addListener(marker, 'click', function(event) {
    //   clickColaborador(colaborador.cpf);
    // });

    google.maps.event.addListener(marker, 'mouseover', function (event) {
      infowindow.open(map, marker);
    });
    google.maps.event.addListener(marker, 'mouseout', function (event) {
      infowindow.close();
    });

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
