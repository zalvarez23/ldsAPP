
angular.module('app.listaAvanceController', [])

.controller('listaAvanceCtrl',function($scope,$timeout,$state,$ionicPopup,plantillaA1Services,UrlApi,$http){
	$scope.goHome = function(){
		$state.go('menu.home');
	};
	$scope.paramsFilter = {
		nom_Servicio : 'Lectura',
		id_Servicio : '1',
		nom_Sector : '01',
		id_Sector : '01',
		nom_Sucursal : 'Seleccionar',
		id_Sucursal : '0',
	}
	var txtFechaAsig;
	$scope.showLoader = false;

	$timeout(function(){
		txtFechaAsig = document.getElementById('txtFechaAsig');
		txtFechaAsig.value = plantillaA1Services.getDateHoyF();
	},500)
	$scope.listAvance = [];
	$scope.getListAvance = function(){
		$scope.listAvance = [];
		$scope.showLoader = true;
		var params = {
			fechaAsigna : txtFechaAsig.value,
			id_sector : $scope.paramsFilter.id_Sector,
			sucursal : $scope.paramsFilter.id_Sucursal,
			id_servicio : $scope.paramsFilter.id_Servicio
		}
		console.log(params);
		var url = UrlApi + 'TBLOperarios'
  		$http.get(url,{ params : params })
  		.success(function(res){  			
			$scope.listAvance = res;
			$scope.showLoader = false;
  		}).error(function(err){
  			$scope.showLoader = false;  			
  			console.log(err);
  		});
	}
 	var alertPopAux = function(title,template,css,$scope){
	    var alertPopup = $ionicPopup.alert({
	      title: title,
	      template: template,
	      cssClass: css,
	      scope:$scope
	    });
	    return alertPopup;
  	}
  	$scope.listSucursal = [];
  	var getSucursal = function(){
  		$scope.showLoader = true;
  		var params = {
  			idUsuario : 16
  		};
  		var url = UrlApi + 'TBLOperarios'
  		$http.get(url,{ params : params })
  		.success(function(res){  			
			$scope.listSucursal = res;
			$scope.showLoader = false;
			$scope.paramsFilter.nom_Sucursal = res[0].des;
			$scope.paramsFilter.id_Sucursal = res[0].id;
  		}).error(function(err){
  			$scope.showLoader = false;  			
  			console.log(err);
  		});
  		
  	}
  	// INIT
  	getSucursal();
  	//

	$scope.closeModal = function() {
	    $scope.modal.hide();
	    $scope.showListModal = false;
	};
	var alertPop;
	var listServicio = [
		{ id : 1 , des : 'Lectura'},
		{ id : 2 , des : 'Verificación'}
	];
	var listSector = [];
	for (var i = 1; i < 20; i++) {
		var sector;
		sector = i;
		if (i > 0 && i < 10) {
			sector = '0' + i;
		}
		listSector.push({
			id : sector,
			des : 'Sector : ' +  sector
		})
	}
	
	$scope.getModalSelect = function(tipo){
		var cabecera,template;		
		if (tipo == 1) {
			cabecera = "Seleccionar Servicio";
			$scope.listGrupo = listServicio;
		}else if(tipo == 2){
			cabecera == "Seleccionar Sector";
			$scope.listGrupo = listSector;
		}else if(tipo == 3){
			console.log($scope.listSucursal.length);
			if ($scope.listSucursal.length == 0) {
				cabecera = "NO SE CARGÓ INFORMACIÓN, ACTIVAR DATOS Y VOLVER A INGRESAR !";	
			}else{
				cabecera = "Seleccionar Sucursal";
			}
			
			$scope.listGrupo = $scope.listSucursal;
		}
		template = '<div class="modalStyle">' +
				   '<div class="card-panel grey lighten-5 z-depth-1 cardP" ng-repeat="item in listGrupo">' +
	       		   '<div class="row valign-wrapper contentPlantilla" ng-click="selectId(item,' + tipo +' );">' +
	       		   '<div class="col"><span class="black-text">{{item.des}}</span>' +
	      		   '</div></div></div></div>';
		alertPop = alertPopAux(cabecera,template,'',$scope)			
		
	}
	$scope.selectId = function(item,tipo){
		if (tipo == 1) {
			$scope.paramsFilter.nom_Servicio = item.des;
			$scope.paramsFilter.id_Servicio = item.id;
		}else if(tipo == 2){
			$scope.paramsFilter.nom_Sector = item.id;
			$scope.paramsFilter.id_Sector = item.id;
			console.log(item);
		}else if(tipo == 3){
			$scope.paramsFilter.nom_Sucursal = item.des;
			$scope.paramsFilter.id_Sucursal = item.id;
		}
		
		alertPop.close();
	}

})