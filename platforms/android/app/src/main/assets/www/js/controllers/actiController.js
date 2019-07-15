angular.module('app.actiController', [])

.controller('actividadesCtrl',function($scope,$http,$state,$timeout,$stateParams,sqliteServices,popupServices){
	var idCuadrilla = $state.params.idCuadrilla;
	var idPersonal = JSON.parse(localStorage.getItem('dataUser'))[0].id_personal;
		// TRAEMOS IDSERVICIO DE LOCAL STORAGE
	var datosServicio = JSON.parse(localStorage.getItem('idServicios'));
	var idServicio = datosServicio.id_servicio;
	var desServicio = datosServicio.nomServicio;
	$scope.showLoaderActi = true;
	$scope.nomServicio = desServicio == undefined ? "Seleccionar servicio" : desServicio;	
	$timeout(function() {
		$scope.showLoaderActi = false;
		$scope.showListMovilOt = true;
	}, 1300);	
	// Variables para loading infinito
	var cant = 0;
	$scope.listMovilOt = [];
	$scope.hasMoreData = false;	
	$scope.getTbl_movil_ot = function(){	
		cant = 0 ;			
		$scope.listMovilOt = [];		
		$timeout(function(){
			sqliteServices.getTbl_movil_ot(idPersonal,idCuadrilla,idServicio,cant).then(function(data){
            	if (data.length == 0) {$scope.hasMoreData = false; $scope.showLoaderActi = false; 
				$scope.showListMovilOt = true; return;  };					
				data.forEach(function(item,index){
					$scope.listMovilOt.push(item);
				});
				cant = data[data.length - 1].id;
				$scope.showLoaderActi = false;
				$scope.showListMovilOt = true;
			},function(err){
				console.log(err)
			})
			$scope.$broadcast('scroll.refreshComplete');
			$scope.hasMoreData = true;
		},1000)
	}
	$scope.getMoreTbl_movil_ot = function(){				
		$timeout(function(){
			sqliteServices.getTbl_movil_ot(idPersonal,idCuadrilla,idServicio,cant).then(function(data){				
            	if (data.length == 0) {$scope.hasMoreData = false; return;};
				data.forEach(function(item,index){
					$scope.listMovilOt.push(item);
				});
				cant = data[data.length - 1].id;
				$scope.$broadcast('scroll.infiniteScrollComplete');  
			},function(err){
				console.log(err);
			})
		},1000)
	}
	$scope.getServicios = function(){
		sqliteServices.getTbl_servicios(idPersonal).then(function(res){
			$scope.listServicios = res;			
		},function(err){
			console.log(err)
		})
	}
	var alertPop;

	$scope.changeServicio = function(item){
		$scope.showLoaderActi = true;
		$scope.showListMovilOt = false;
		$scope.nomServicio = item.nombre_servicio;
		idServicio = item.id_servicio;
		$scope.getTbl_movil_ot();
		// REEMPLAZAMOS EL IDSERVICIO
		localStorage.setItem('idServicios',JSON.stringify({id_servicio : item.id_servicio, nomServicio : item.nombre_servicio}));
		alertPop.close();
	}
	$scope.modalServicios = function(){
		var cabecera = "Seleccionar una empresa";
		var template = '<div class="modalStyle">' +
					   '<div class="card-panel grey lighten-5 z-depth-1 cardP" ng-repeat="item in listServicios">' +
          			   '<div class="row valign-wrapper contentPlantilla" ng-click="changeServicio(item);">' +
            		   '<div class="col s4 m2 colP">' +
                       '<a href=""><i class="small material-icons" style="font-size:20px !important"></i></a>' +
            		   '</div><div class="col s8 m10"><span class="black-text">{{item.nombre_servicio}}</span>' +
            		   '</div></div></div></div>';

		alertPop = popupServices.alertPop(cabecera,template,'',$scope);
	}
	$scope.changeView = function(item){
		
		// VALIDAMOS SI ESTA ORDEN YA ESTA REGISTRADO O NO POR SU ESTADO
			// SI EL ESTADO ES = 6 THEN SI ESTA REGISTRADO
		if (item.Estado_OT == 6 ) {
			item['registrado'] = "si";
		}	// SI ESTA EN 8 NO ESTA REGISTRADO
		else if (item.Estado_OT == 8){
			item['registrado'] = "no";
		}
		localStorage.setItem('dataActi', JSON.stringify(item));
		console.log(idServicio)
	
		if (idServicio == 28) {
			// BUNQUER MT INSPECCIONES
			$state.go('menu.home-inspeccionesB_MT');
		}else if(idServicio == 29){
			// BUNQUER MT INSTALACIONES
			$state.go('menu.home-instalacionB_MT');
		}else if(idServicio == 31){
			// BUNQUER BT INSTALACIONES
			$state.go('menu.home-InspeccionesB_BT');			
		}else if(idServicio == 30){
			// BUNQUER BT INSPECCIONES
			$state.go('menu.home-InstalacionB_BT');
		}else if(idServicio == 34){
			// SIMS INSPECCIÓN
			$state.go('menu.home-SimsInspecciones');
		}else if(idServicio == 35){
			// SIMS INSTALACIONES
			$state.go('menu.home-SimsInstalaciones');
		}else if(idServicio == 32){
			// 5 PERNOS INSPECCIÓN
			$state.go('menu.home-5Personas_Inspecciones');
		}else if(idServicio == 33){
			// 5 PERNOS INSTALACIONES
			$state.go('menu.home-5PersonasInstalacion');
		}
		else{
			$state.go('menu.home-plantillaA1');	
		}
		
	}
	$scope.getBorderEstatus = function(estado){
		// YA REGISTRADO
		if (estado == 6) {
			return 'borderSucces'
		}
	};
	$scope.goHome = function(){
		$state.go('menu.home');
	};	
	
})