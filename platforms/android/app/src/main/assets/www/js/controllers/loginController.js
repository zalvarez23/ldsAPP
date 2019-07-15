angular.module('app.loginController', [])

.controller('loginCtrl',function($scope,$http,$timeout,$ionicPlatform,VersionAppR,$rootScope,$state,loginServices,gpsServices,popupServices,$cordovaBatteryStatus,$provide,$cordovaDevice){

	$scope.params = {
		nomusu : '',
		passusu : '',
		tipo : 1,
		idDevice : '1',
		Version : 67
	}
	var IdValues = 1;
    $ionicPlatform.ready(function() {
    	//IdValues = $cordovaDevice.getUUID();    	
    	$scope.params.idDevice = IdValues
    	$scope.params.Version = VersionAppR;
        $rootScope.$on("$cordovaBatteryStatus:status", function(event, args) {
            if(args.isPlugged) {
              gpsServices.saveBatteryDevice(args.level)                
            } else {                
              gpsServices.saveBatteryDevice(args.level)          
            }
        });
    });

    $timeout(function(){
    	gpsServices.saveBatteryDevice(1) 
    },1000);

	var dataUser = localStorage.getItem('dataUser');
	
	if (dataUser != null) {
		if (dataUser !=0) {
			$state.go('menu.home');
		
		}
	}
	$scope.showLoaderLogIn = false;
	$scope.showButtonLog = true;
	$scope.logIn = function(){	
		
		// PRUEBA
		/*
			loginServices.logIn($scope.params).then(function(result){				
				$scope.showButtonLog = true;
				$scope.showLoaderLogIn = false;
					
				if (result == null) {
					popupServices.alertPop('Error','Contraseña y/o Usuario incorrectos');
				}else{
					
					//if (result.id_device != $scope.params.idDevice) {
					//	popupServices.alertPop('Error','Usuario no tiene permisos para ingresar en este dispositivo.');				
					//	return;
					//}
					localStorage.setItem('dataUser', JSON.stringify(result));
				
					$state.go('menu.home');
				}
			},function(err){
				popupServices.alertPop('Error','Ocurrio un problema con el servidor.');				
				$scope.showButtonLog = true;
				$scope.showLoaderLogIn = false;
				console.log(err)
			})
		return;
		*/
		$scope.showButtonLog = true;
		$scope.showLoaderLogIn = true;			
		cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
			var enabledAux = (enabled ? true : false);
			if (enabledAux) {
				// GPS ACTIVO
				//$scope.showLoaderLogIn = true;
				//$scope.showButtonLog = false;
			    gpsServices.getCurrentPosition().then(function(result){				
					executeLogin();
				},function(err){
					executeLogin();
					//popupServices.alertPop('Error','Gps no activado');
					//$scope.showButtonLog = true;
					//$scope.showLoaderLogIn = false;
				})				
			}else{
				$scope.showButtonLog = true;
				$scope.showLoaderLogIn = false;
				var title = "Información !";
				var template = "El Gps se encuentra deshabilitado, Desea ir al menú de Configuración ?";
				popupServices.confirmPop(title,template).then(function(res){
					if (res) {
						
					    window.cordova.plugins.settings.open("location", function() {
					            console.log('opened settings');
					        },
					        function () {
					            console.log('failed to open settings');
					        }
					    );
						// ABRIMOS CONFIGURACIÓN DE GPS
					}
				})
			}

		}, function(error){
			popupServices.alertPop('Error','Ocurrio un problema con la conexión.');				
			$scope.showButtonLog = true;
			$scope.showLoaderLogIn = false;
			console.log(err)			
		});
		var executeLogin = function(){
			loginServices.logIn($scope.params).then(function(result){
				$scope.showButtonLog = true;
				$scope.showLoaderLogIn = false;		
				console.log(result)
				if (result == null) {
					popupServices.alertPop('Error','Contraseña y/o Usuario incorrectos');
				}else{
					/*if (result.id_device != $scope.params.idDevice) {
						popupServices.alertPop('Error','Usuario no tiene permisos para ingresar en este dispositivo.');				
						return;
					}	*/				
					localStorage.setItem('dataUser', JSON.stringify(result));
				
					$state.go('menu.home');
				}
			},function(err){
				popupServices.alertPop('Error','Ocurrio un problema con el servidor.');				
				$scope.showButtonLog = true;
				$scope.showLoaderLogIn = false;
				console.log(err)
			})
		}
	}
})