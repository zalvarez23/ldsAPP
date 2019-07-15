angular.module('app.alertaController', [])

.controller('alertaCtrl',function($scope,$timeout,$q,$state,ServicesPhoto,popupServices,plantillaA1Services,sqliteServices,$ionicModal,gpsServices,alertaServices){
	var dataUser;
	$scope.initView = function(){
		$scope.showLoader = true;
		$scope.nomSelect = "";		
		dataUser = JSON.parse(localStorage.getItem('dataUser'));
		var idOperario = dataUser.ID_Operario;
		sqliteServices.getTbl_TipoReporteDiario().then(function(res){
			$scope.listModal = res;
		})
		$timeout(function(){
			$scope.showLoader = false;
		},200)
	}	
	$scope.goHome = function(){
		$state.go('menu.home');
	};
	var alertModal;	
	$scope.modalSelectGrupo = function(tipo){				
		var cabecera,template;		
		template = '<div class="modalStyle">' +
				   '<div class="card-panel grey lighten-5 z-depth-1 cardP" ng-repeat="item in listModal"  ng-click="selectId(item,'+ tipo +');">' +
	       		   '<div class="row valign-wrapper contentPlantilla">' +
	      		   '<div class="col"><span class="black-text">{{item.des}}</span>' +
	      		   '</div></div></div></div>';
		alertModal = popupServices.alertPop(cabecera,template,'',$scope);		
	}
	$scope.selectId = function(item,tipo){
		$scope.nomSelect = item.des;
		alertModal.close();
	}
	$scope.sendAlert = function(){
		if ($scope.nomSelect == "") {
			var template = "<div style='text-align:center;'>"+ "Ingresar un tipo de Alerta !" +
			"<i style='color:#F44336;font-size: 23px;' class='icon ion-android-alert placeholder-icon'></i></div>";
			popupServices.alertPop('Alerta !' , template);
			return;	
		}
		$scope.showLoader = true;
		gpsServices.getCurrentPosition().then(function(res){
			var params = {
				lat : res.lat,
				lon : res.long,
				incidencia : $scope.nomSelect,
				operario : dataUser.Operario_Nombre
			}
			console.log(params)
			alertaServices.sendEmailAlert(params).then(function(res){
				var pop = popupServices.alertPop('Correcto !' , "Alerta enviada correctamente !" );
				$scope.showLoader = false;
				pop.then(function(){
					$scope.initView();
				})
			},function(err){
				var template = "<div style='text-align:center;'>"+ "Ocurrio un problema, volver a intentar." +
					"<i style='color:#F44336;font-size: 23px;' class='icon ion-android-alert placeholder-icon'></i></div>";
				popupServices.alertPop('Alerta !' , template);
				$scope.showLoader = false;				
			})
		})

	}

})
