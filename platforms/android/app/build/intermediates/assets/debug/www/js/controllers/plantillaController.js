angular.module('app.menuActividadesController', [])

.controller('menuActividadesCtrl' , function($scope,$timeout,sqliteServices,$state,popupServices){
	$scope.showLoaderPlan = true;
	$scope.showListPlantillas = false;	
	var datos_Operario = JSON.parse(localStorage.getItem('dataUser'));	
	var ID_Operario =  datos_Operario.ID_Operario;
	var tipoUsuario = datos_Operario.TipoUsuario;
	if (tipoUsuario == 0 || tipoUsuario == null || tipoUsuario == "null") {
		$scope.showUsuarioNormal = true;
	}else{
		$scope.showUsuarioNormal = false;
	}
	$timeout(function(){
		$scope.showLoaderPlan = false;
		$scope.showListPlantillas = true;		
  	},1300)
	$scope.changeView = function(state){
		
		if (state == "menu.home-listaLecturas") {
			sqliteServices.getTbl_SuministrosValidar(ID_Operario,2).then(function(res){
				if (res.length != 0) {
					var template = "<div style='text-align:center;'>Finalizar Verificaciones para ingresar a Lecturas."+
					"<i style='color:#387ef5;padding-left:15px'class='ion-alert'></i></div>";
					popupServices.alertPop('Alerta' , template);
					return;					
				}else{
					$state.go(state);			
					return;
				}
			})
			
		}else{
			$state.go(state);	
		}
		//GUARDAMOS EL ID PLANTILLA
		
	};
	$scope.goHome = function(){
		$state.go('menu.home');
	};
})

.controller('cuadrillaCtrl' , function($scope,$timeout,$state){
	$scope.showLoaderCua = true;
	$scope.showListCuadrillas = false;
	$scope.listCuadrillas = JSON.parse(localStorage.getItem('dataUser'));	
	$timeout(function(){
		$scope.showLoaderCua = false;
		$scope.showListCuadrillas = true;
	},1300)
	$scope.changeView = function(state,item){
		var parameters = JSON.parse(localStorage.getItem('parameters'));
		// CREAMOS NUEVO OBJETO ID_CUADRILLA PARA GUARDARLO EN LOS PARAMETROS LOCASLTORE
		parameters['id_cuadrilla'] = item.id_cuadrilla;
		localStorage.setItem('parameters',JSON.stringify(parameters))		
		$state.go(state, {idCuadrilla : item.id_cuadrilla});
	};
	$scope.goHome = function(){
		$state.go('menu.home');
	};	
})