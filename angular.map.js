vm.carregar_mapa = () => {
    vm.mapa = new google.maps.Map(document.getElementById('mapa'), {
      zoom: 5,
      center: {
        lat: -14.2400732,
        lng: -53.1805018
      },
      mapTypeId: google.maps.MapTypeId.HYBRID,
      gestureHandling: 'greedy'
    });
    // console.log('mapa_loaded');
  };

  /**
   * @param {Object} lat_lng
   */
  vm.centralizar_mapa = (lat_lng) => {
    vm.mapa.setCenter(lat_lng);
    // vm.mapa.setZoom(20);
  };

  /**
   * revisar essa funcao, talvez deve ser por cidade
   * 
   * @param {Int} cidade_id id da cidade
   */
  vm.trazer_colaboradores = (cidade_id) => {

  };

  vm.add_marcadores = (colaboradores) => {
    angular.forEach(colaboradores, (colaborador, index) => {

      const coord = {
        lat: colaborador.lat,
        lng: colaborador.lng,
      }

      var marker = vm.obter_markers(coord, vm.mapa, colaborador);

      vm.markers.push(marker);

    });
  };

  vm.obter_markers = (coords, map, colaborador) => {
    var marker = new google.maps.Marker({
      position: coords,
      map: map,
    });

    google.maps.event.addListener(marker, 'click', function (event) {
      alert(colaborador.name);
    });

    return marker;
  };

  vm.limpar_mapa = () => {
    $.each(vm.markers, function (i, marker) {
      try {
        marker.setMap(null);
      } catch (ex) { }
    });

    markers = [];
  };
