var URL_CONSULTA_CONTRATOS = '/sigem/api/v1/financeiro/contratos';
var mapa = null;
var marcadores = new Array();

$(function() {
	try {
		var mapOptions = {
			zoom : 5,
			gestureHandling: 'greedy',
			center : new google.maps.LatLng(-14.2400732, -53.1805018),
			mapTypeId : google.maps.MapTypeId.SATELLITE
		};

		mapa = new google.maps.Map(document.getElementById("mapa"), mapOptions);
		google.maps.event.trigger(mapa, "resize");
	} catch (exception) {
	}

	$('#bt_minimizar').hide();
	$('#mapa').resizable();
	ajustarMapa();
	$(window).resize(function() {
		ajustarMapa();
	});
});

function filtrarContratos() {
	var cidade = $('#id_cidade_busca').val();
	var tipo_pessoa = $('input[name=tipo_pessoa_busca]:checked').val();
	var tecnologia = $('#tecnologia_busca_input').val();
	var situacoes = $('#situacao_contrato_busca_input').val();
	var faturas_debito = $('#faturas_debito_input').val();
	var ativo_agendamento = $('#ativo_agendamento_input').is(':checked');
	var nome_cliente = $('#nome_cliente_busca').val();

	try {
		var consulta = {
			cidade : cidade,
			tipoPessoa : tipo_pessoa,
			tecnologia : tecnologia,
			situacoes : situacoes,
			faturasDebito: faturas_debito,
			ativoAgendamento: ativo_agendamento,
			nomeCliente: nome_cliente
		};

		$.ajax({
			url : URL_CONSULTA_CONTRATOS,
			data : JSON.stringify(consulta),
			type : 'post',
			dataType : 'json',
			contentType : 'application/json',
			cache : false,
			success : function(sumario) {
				preencherLegenda(sumario);
				
				addMarkers(sumario.contratos);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				showMensagem('Erro', jqXHR.responseText, 2);
			},
			complete : function(jqXHR, textStatus) {
				if (textStatus == 'success') {
					dialogFiltrar.hide();
				}
			}
		});
	} catch (exception) {
		showMensagem('Erro', exception, 2);
	}
}

function preencherLegenda(sumario) {
	var legenda = $('#panel_legenda_tab_cores');
	var tabela = '<table width="100%">';

	$.each(sumario.cabecalho.situacoes, function(i, situacao){
		tabela = tabela.concat('<tr>');
		tabela = tabela.concat('  <td><div style="background:#' + situacao.cor + ';width:16px;height:16px;"></div></td>');
		tabela = tabela.concat('  <td valign="center">' + situacao.nome + '</td>');
		tabela = tabela.concat('  <td align="right" valign="center">(' + situacao.quantidade + ')</td>');
		tabela = tabela.concat('</tr>');
	});
	
	tabela.concat('</table>');
	legenda.html(tabela);
}

function abrirLegenda() {
	dialogLegenda.show();
}

function centralizarMapa() { 
	var cidade = $('#cidade_busca_input').val();
	var geocoder = new google.maps.Geocoder();

	geocoder.geocode({
		'address' : cidade + ', brasil'
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var cidade = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());

			mapa.setCenter(cidade);
			mapa.setZoom(14);
			
			limparMapa();
		} else {
			showMensagem("Erro", "Cidade nÃ£o encontrada", 2);
		}
	});
}

function limparMapa() {
	$.each(marcadores, function(i, marcador){
		try { 
			marcador.setMap(null); 
		} catch(ex){ }
	});
	
	marcadores = new Array();
}

function addMarkers(contratos) {
	limparMapa();
	
	$.each(contratos, function(i, contrato) { 
		var marker = obterMarker(contrato, mapa);

		google.maps.event.addListener(marker, 'click', function(event) {
			$('#id_contrato_detalhe').val(contrato.id);
			
			detalhar();
		});

		marcadores.push(marker);
	});
}

function obterMarker(contrato, mapa) {
	var marker = new google.maps.Marker({
				position : new google.maps.LatLng(contrato.latitude, contrato.longitude),
				map : mapa,
				zIndex: contrato.id
			});
	
	marker.setIcon(contrato.icone);
	
	if(contrato.requerAtencao) {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}	

	return marker;
}

function showMensagem(summary, detail, severity) {
	var LEVEL = [ 'info', 'warning', 'error' ];
	detail = detail.replace(/","/gi, '<br/><br/>').replace(/"/gi, '').replace('[', '').replace(']', '');
	
	$.toast({
        heading: summary,
        text: detail,
        position: 'top-right',
        loaderBg:'#ff6849',
        icon: LEVEL[severity],
        hideAfter: 6000, 
        stack: 6
	});
}

function maximizarMapa() {
	$('#panel_mapa').css({
		width : '100%',
		height : '99%',
		position : 'absolute',
		left : 0,
		top : 0,
		zIndex: '999'
	});

	$('#mapa').css({
		height : '94%',
		width : '100%',
		position : 'absolute'
	});
	
	$('#bt_minimizar').show();
	$('#bt_maximizar').hide();
	google.maps.event.trigger(mapa, "resize");
}

function minimizarMapa() {
	$('#panel_mapa').css({
		width : 'auto',
		height : 'auto',
		position : 'relative',
		left : 0,
		top : 0,
		zIndex: 'inherit'
	});

	$('#mapa').css({
		height : '500px',
		width : 'auto',
		position : 'relative'
	});
	
	$('#bt_minimizar').hide();
	$('#bt_maximizar').show();
	
	ajustarMapa();
}

function ajustarMapa() {
	var altura = ($(window).height() - 230);
	$('#mapa').height(altura);
	google.maps.event.trigger(mapa, "resize");
}
