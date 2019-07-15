angular.module('app.homeController', [])

.controller('homeCtrl',function($scope,$http,$q,$cordovaGeolocation,$cordovaDevice,$ionicPlatform,$state,ServicesPhoto,plantillaA1Services,$timeout,loginServices,popupServices,getDataSincro,sqliteServices,sincroServices,$state,$ionicPopup,envioPendientesServices,UrlApi,gpsServices,$firebaseArray,$firebaseObject,VersionApp){
	// METODOS CON FIREBASE
	//PRUEBA ALVARE
/*	$scope.paramsPosi = {
		lat : 0,
		long : 0,
		error :'success',
	}
  var watchOptions = {
    timeout : 10000,
    enableHighAccuracy: false // may cause errors if true
  };	
 var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
      $scope.paramsPosi.error = JSON.stringify(err);
    },
    function(position) {
    	console.log(position);
    	$scope.paramsPosi.lat = position.coords.latitude;
        $scope.paramsPosi.long = position.coords.longitude
  });

  */
	var IdValues = 1;
    $ionicPlatform.ready(function() {
    	IdValues = $cordovaDevice.getUUID();

    });
 	var ref = new Firebase('https://versiondsige.firebaseio.com/'); 	
 
 	
 	//var notiObject = $firebaseObject(refNotification); 	
 	//notiObject.$remove();
	 var dataUser = localStorage.getItem('dataUser');	 
	dataUser = JSON.parse(dataUser);	
	$scope.tipoUsuario = dataUser.TipoUsuario;

	var refNotification = new Firebase('https://dsigenotification.firebaseio.com/');
	var notificationAlert =  $firebaseArray(refNotification);


	notificationAlert.$watch(function(event) {
		
		var Ket = event.key;
		var idOperario = dataUser.ID_Operario;
		var result = notificationAlert.$getRecord(Ket);	
		
		if (result.idOperario == idOperario) {					
			if (result.value == 1) {
				var template = "<div style='text-align:center;'>Usted tiene fotos a verificar, favor de sincronizar."+
				"<i style='color:#387ef5;padding-left:15px'class='ion-alert'></i></div>";
				popupServices.alertPop('Alerta' , template);
				sincronizacionInternaFotos();
			}else if(result.value == 3){
				var template = "<div style='text-align:center;'>Usted tiene relecturas, favor de sincronizar."+
				"<i style='color:#387ef5;padding-left:15px'class='ion-alert'></i></div>";
				popupServices.alertPop('Alerta' , template);
				sincronizacionInternaRelectura();
			}/*else{
				var template = "<div style='text-align:center;'>Usted tiene inconsistencias, favor de sincronizar."+
				"<i style='color:#387ef5;padding-left:15px'class='ion-alert'></i></div>";
				popupServices.alertPop('Alerta' , template);
				sincronizacionInternaFotos();
			}*/
		}
	});

	$timeout(function(){
		//alert('Entro apunto..')
		//pruebaFireBase();
		//sincroServices.sincroSuministroRelectura(932);
	},1000)
	var sincronizacionInternaFotos = function(){
		console.log('iniciando . . ');
		var ID_Operario = dataUser.ID_Operario;
		sincroServices.sincroSuministroFotoInterno(ID_Operario).then(function(res){
			console.log('sucess sincronización fotos interno . . ');
			// ELIMINAMOS DATOS DE NOTIFICACIÓN DEL USUARIO
			//alert('Sincronización fotos successsssssssssss')
			notificationAlert.$loaded(function(res){
				res.forEach(function(item,index){				
					if (item.idOperario == dataUser.ID_Operario) {
						res.$remove(item);	
					}
				})			
			});
		},function(err){
			console.log('error', err);
		})
	}
	var sincronizacionInternaRelectura = function(){
		console.log('iniciando . . ');
		var ID_Operario = dataUser.ID_Operario;
		sincroServices.sincroSuministroRelectura(ID_Operario).then(function(res){
			console.log('sucess sincronización fotos interno . . ');
			// ELIMINAMOS DATOS DE NOTIFICACIÓN DEL USUARIO
			//alert('Sincronización fotos successsssssssssss')
			notificationAlert.$loaded(function(res){
				res.forEach(function(item,index){				
					if (item.idOperario == dataUser.ID_Operario) {
						res.$remove(item);	
					}
				})			
			});
		},function(err){
			console.log('error', err);
		})
	}	

 	var versionApp = VersionApp;
 	$scope.versionA= versionApp;
 	var versionAndroid;
 	$scope.blockMenu = "";

	//
	var dataUser = localStorage.getItem('dataUser');
	dataUser = JSON.parse(dataUser);	

	$scope.nameUser = dataUser.Operario_Nombre;
	// TIMEOUT PARA MOSTRAR CONTENIDO 
	$scope.showLoaderMenu = true;
	$timeout(function(){		
		$scope.showContentMenu = true;
		$scope.showLoaderMenu = false;
		// INICIALIZAMOS SERVICIO Q CAPTURA EL GPS DE MANERA AUTOMATICA
		gpsServices.saveCurrentPosition();
		//					
	},100)
	
	$scope.progress = 0;	

	// FUNCIÓN PARA MANDAR MENSAJE DE CONFIRMACIÓN
	var showModal = false;			
	$scope.getConfirmMessage = function(){
			//VALIDACIÓN ANTES DE SINCRONIZAR.
		ref.on("value", function(snapshot) {
		  //console.log(snapshot.val());
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
		var templateVal = "<div style='text-align:center;'>" +
		                         "<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";			
		var valLoader = popupServices.alertPop('Validando Actualizaciones . . .', templateVal, 'popButtonHide');		
	 	ref.on("value", function(snapshot) {
	 		console.log(showModal);
	 		if (showModal) {return;}
	 		versionAndroid = snapshot.val().LecturasLds;
	 		
	 		if (versionAndroid != versionApp) {
	 			//$scope.blockMenu = "disabledMedidor";

	 			valLoader.close();
	 			$scope.blockMenu = "";
				var title = 'Actualización Pendiente !';
				var template = 'Se publicó una nueva actualización en el Play Store, desea actualizar ?';
				showModal = true;
				popupServices.confirmPop(title,template).then(function(res){
					$scope.showContentMenu = true;
					$scope.showLoaderMenu = false;	
					if (res) {
						//window.open('https://play.google.com/store/apps/details?id=com.ionicframework.applecturaslds653018','_system','location=yes');
						window.open('https://play.google.com/store/apps/details?id=com.ionicframework.applecturaslds653018','_system','location=yes');						
						//window.open('http://www.dsige.com/descargas/luzdelsur/','_system','location=yes');
						//var versionNew = "appLDS_" + plantillaA1Services.getCodUniq() + "_" + String(parseFloat(VersionApp) + 1) + ".apk"
						/*var template = "<div style='text-align:center;'>" +
					            "<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";
								var popAlert = popupServices.alertPop('Cerrando Sesión . . .', template, 'popButtonHide');
								$timeout(function(){
									localStorage.setItem('dataUser','');
									popAlert.close();
									gpsServices.clearIntervalAll();
									$state.go('login');
							},2000); */
					}
					showModal = false;
				});
	 		}else{
	 			valLoader.close();
	 			$scope.blockMenu = "";
	 			$scope.showContentMenu = true;
				$scope.showLoaderMenu = false;
				sqliteServices.getTbl_Registros().then(function(res){
					
					if (res.length > 0) {
						var template = "<div style='text-align:center;'>Envie datos al servidor antes de sincronizar."+
								   "<i style='color:#387ef5;padding-left:15px'class='ion-alert'></i></div>";
						popupServices.alertPop('Alerta' , template);
						return;
					}
					sqliteServices.getTbl_Registros_Fotos().then(function(ress){
						if (ress.length > 0) {
							var template = "<div style='text-align:center;'>Envie las fotos al servidor antes de sincronizar."+
									   "<i style='color:#387ef5;padding-left:15px'class='ion-alert'></i></div>";
							popupServices.alertPop('Alerta' , template);
							return;
						}
						// VALIDAMOS SI EL OPERARIO ESTA HABILTIADO PARA LIMPAIR HISTORIAL.
						var templateV = "<div style='text-align:center;'>" +
						"<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";
						var popAlertV = popupServices.alertPop('Validando Información . . .', templateV, 'popButtonHide');
						getDataSincro.TBLOperariosValidar(dataUser.ID_Operario).then(function(res){
							popAlertV.close();
							if (res.flag_limpiar_historial == 1) {
								var title = 'Mensaje de Alerta';
								var template = 'Es necesario limpiar historial para poder sincronizar, desea limpiarlo ahora ?';
								popupServices.confirmPop(title,template).then(function(respop){
									if (respop) {
										if (res) {
											var template = "<div style='text-align:center;'>" +
								                              "<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";				
											var popAlert = popupServices.alertPop('Limpiando historial . . .', template, 'popButtonHide');	
											sqliteServices.limpiarTablasAll().then(function(){
												var obj = {
													id_operario : dataUser.ID_Operario
												}
												loginServices.updateStatusModel(obj).then(function(ressss){													
													popAlert.close();
													var template = "<div style='text-align:center;'>Historial borrados correctamente."+
																   "<i style='color:#387ef5;font-size: 23px;' class='icon ion-loop placeholder-icon'></i></div>";
													popupServices.alertPop('Proceso Finalizado.' , template);													
												},function(err){
													popAlert.close();
													popupServices.alertPop('Proceso Finalizado.' , 'Error de Conexión, vuelva a intentarlo');	
												})

											})							
										}								
									}
								})
							}else{							
								var executeSincro = function(){
									var title = 'Mensaje de confirmación';
									var template = 'Esta apunto de sincronizar datos , desea continuar ?';
									popupServices.confirmPop(title,template).then(function(res){
										if (res == true) {
											var template = "<div style='text-align:center;'>" +
							                               "<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";
											var popAlert = popupServices.alertPop('Sincronizando datos . . .', template, 'popButtonHide');
											var ID_Operario = dataUser.ID_Operario;
											sincroServices.initSincro(ID_Operario,IdValues).then(function(res){
												popAlert.close();
												$timeout(function(){
													var template = "<div style='text-align:center;'>Sincronización realizada correctamente."+
																   "<i style='color:#387ef5;font-size: 23px;' class='icon ion-loop placeholder-icon'></i></div>";
													popupServices.alertPop('Proceso Finalizado.' , template);
													// ELIMINAMOS DATOS DE NOTIFICACIÓN DEL USUARIO
													notificationAlert.$loaded(function(res){
														res.forEach(function(item,index){				
															if (item.idOperario == dataUser.ID_Operario) {
																res.$remove(item);	
															}
														})			
													})
													// INICIALIZAMOS SERVICIO Q CAPTURA EL GPS DE MANERA AUTOMATICA
													gpsServices.saveCurrentPosition();
													//	
												},500)
												
											},function(err){
												popAlert.close();
												popupServices.alertPop('Proceso Finalizado.' , 'Error de Conexión, vuelva a intentarlo');																				
											})
										}else{
										}
									})			
								};
								executeSincro();	
							};						
						},function(err){
							popAlertV.close();
							console.log(err);
							popupServices.alertPop('Proceso Finalizado.' , 'Error de Conexión, vuelva a intentarlo');	
						})
						//
						
					})

				})						
	 		};
	 		
	  	}, function (errorObject) {
	  		
	  		popupServices.alertPop('Proceso Finalizado.' , 'Error de Conexión, vuelva a intentarlo');
	  		valLoader.close();		
	   		$scope.showContentMenu = true;
			$scope.showLoaderMenu = false;		
	  	});			



	}
	$scope.getConfirmMessageSend = function(){

		var title = "Mensaje de Confirmación";
		var template = "Esta apunto de enviar los datos al servidor , desea continuar ?";
		popupServices.confirmPop(title,template).then(function(res){

			var popAlert;
			if (res == true) {

				var template = "<div style='text-align:center;'>" +
                               "<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";
				popAlert = popupServices.alertPop('Enviando datos . . .', template, 'popButtonHide');					
				envioPendientesServices.sendAllDataToServidor().then(function(res){					
					$timeout(function(){
						popAlert.close();
						var textInfo = res == 'nodata' ? 'No se encontraron registros de lecturas' : 'Datos enviados correctamente.';
						var template = "<div style='text-align:center;'>"+ textInfo +
									   "<i style='color:#387ef5;font-size: 23px;' class='icon ion-loop placeholder-icon'></i></div>";
						popupServices.alertPop('Proceso Finalizado.' , template);
					},1500)
								
				},function(err){
					popAlert.close();
					popupServices.alertPop('Proceso Finalizado.' , 'Ocurrio un problema, vuelva a intentarlo !');
				})

			}else{

			}
		})		
	}
	$scope.getConfirmMessageSendFotos = function(){
		var title = "Mensaje de Confirmación";
		var template = "Esta apunto de enviar las fotos al servidor , desea continuar ?";
		popupServices.confirmPop(title,template).then(function(res){
			var popAlert;
			if (res == true) {

				var template = "<div style='text-align:center;'><p id='txtFoto'>Enviando Fotos . .</p>" +
                               "<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";
				popAlert = popupServices.alertPop('', template, 'popButtonHide2');					
				envioPendientesServices.sendAllDataToServidorfotos().then(function(res){				
					$timeout(function(){
						popAlert.close();
						var textInfo = res == 'nodata' ? 'No se encontraron registros de foto' : 'Datos enviados correctamente.';
						var template = "<div style='text-align:center;'>"+ textInfo +
									   "<i style='color:#387ef5;font-size: 23px;' class='icon ion-loop placeholder-icon'></i></div>";
						popupServices.alertPop('Proceso Finalizado.' , template);
					},1500)
								
				},function(err){					
					popAlert.close();
					popupServices.alertPop('Proceso Finalizado.' , 'Ocurrio un problema, vuelva a intentarlo !');
				})

			}else{

			}
		})				
	}
	$scope.closeSession = function(){

		var title = "Cerrar Sesión";
		var template = "Esta seguro que desea cerrar la sesión ?";
		popupServices.confirmPop(title,template).then(function(res){
			if (res) {
				var template = "<div style='text-align:center;'>" +
                               "<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";
				var popAlert = popupServices.alertPop('Cerrando Sesión . . .', template, 'popButtonHide');
				
					$scope.params = {
						nomusu : dataUser.ID_Operario,
						passusu : dataUser.Operario_Contrasenia,
						tipo : 2,
					}
					$timeout(function(){
						localStorage.setItem('dataUser','');
						popAlert.close();
						gpsServices.clearIntervalAll();
						$state.go('login');
						ionic.Platform.exitApp();
					},1500)
				/*loginServices.logIn($scope.params).then(function(res){
					
				},function(err){
					console.log(err);
					popAlert.close();
					popupServices.alertPop('Error.' , 'Ocurrio un problema con la conexión, vuelva a intentarlo !');
				});*/

			}
		})
	}

	// FUNCIÓN PARA CAMBIAR DE VIEW POR ESTADOS
	$scope.changeView = function(state){
				// ELIMINAMOS STORAGE DE SERVICIOS EN LA LISTA DE ACTIVIDADES ;
		localStorage.setItem("idServicios", "0");		
		$state.go(state);
	}

})
.controller('menuCtrl',function(){

})
.controller('sendInfoCtrl',function($scope,$http,$timeout,popupServices,sqliteServices,sincroServices,$state,$ionicPopup,envioPendientesServices,UrlApi,gpsServices){
	var dataUser = localStorage.getItem('dataUser');
	dataUser = JSON.parse(dataUser);	
	$scope.nameUser = dataUser.Operario_Nombre;
	// TIMEOUT PARA MOSTRAR CONTENIDO 
	$scope.showLoaderMenu = true;
	$timeout(function(){		
		$scope.showContentMenu = true;
		$scope.showLoaderMenu = false;
		//					
	},100);
	// CAPTURAMOS EL DÍA DE LA SEMANA Y VALIDAMOS
	$scope.showDeleteHistorial = false;

	$scope.getConfirmMessageSend = function(){

		var title = "Mensaje de Confirmación";
		var template = "Esta apunto de reenviar los datos al servidor , desea continuar ?";
		popupServices.confirmPop(title,template).then(function(res){
			if (res == true) {

				var template = "<div style='text-align:center;'>" +
                               "<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";
				var popAlert = popupServices.alertPop('Enviando datos . . .', template, 'popButtonHide');					
				envioPendientesServices.sendAllDataToServidor_Back().then(function(res){				
					$timeout(function(){
						popAlert.close();
						var textInfo = res == 'nodata' ? 'No se encontraron registros de lecturas' : 'Datos enviados correctamente.';
						var template = "<div style='text-align:center;'>"+ textInfo +
									   "<i style='color:#387ef5;font-size: 23px;' class='icon ion-loop placeholder-icon'></i></div>";
						popupServices.alertPop('Proceso Finalizado.' , template);
					},1500)								
				},function(err){
					popAlert.close();
					popupServices.alertPop('Proceso Finalizado.' , 'Ocurrio un problema, vuelva a intentarlo !');
				})

			}else{

			}
		})		
	}
	$scope.LimpiarHistorial = function(){
		
		var title = "Mensaje de Confirmación";
		var template = "Esta apunto de limpiar el historial, desea continuar?";
		popupServices.confirmPop(title,template).then(function(res){
			if (res) {
				var template = "<div style='text-align:center;'>" +
                               "<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";				
				var popAlert = popupServices.alertPop('Limpiando historial . . .', template, 'popButtonHide');	
				sqliteServices.limpiarTablasAll().then(function(){
					popAlert.close();
						var template = "<div style='text-align:center;'>Historial borrados correctamente."+
									   "<i style='color:#387ef5;font-size: 23px;' class='icon ion-loop placeholder-icon'></i></div>";
						popupServices.alertPop('Proceso Finalizado.' , template);
				})							
			}

		})

	}
	$scope.getConfirmMessageSendFotos = function(){
		var title = "Mensaje de Confirmación";
		var template = "Esta apunto de reenviar las fotos al servidor , desea continuar ?";
		popupServices.confirmPop(title,template).then(function(res){
			if (res == true) {

				var template = "<div style='text-align:center;'><p id='txtFoto'>Enviando Fotos . .</p>" +
                               "<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";
				popAlert = popupServices.alertPop('', template, 'popButtonHide2');				
				envioPendientesServices.sendAllDataToServidorfotos_back().then(function(res){					
					$timeout(function(){
						popAlert.close();
						var textInfo = res == 'nodata' ? 'No se encontraron registros de foto' : 'Datos enviados correctamente.';
						var template = "<div style='text-align:center;'>"+ textInfo +
									   "<i style='color:#387ef5;font-size: 23px;' class='icon ion-loop placeholder-icon'></i></div>";
						popupServices.alertPop('Proceso Finalizado.' , template);
					},1500)
								
				},function(err){
					popAlert.close();
					popupServices.alertPop('Proceso Finalizado.' , 'Ocurrio un problema, vuelva a intentarlo !');
				})

			}else{

			}
		})				
	}	

})