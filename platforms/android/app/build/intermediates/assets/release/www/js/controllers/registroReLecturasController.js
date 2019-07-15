
angular.module('app.registroReLecturasController', [])

.controller('registroReLecturasCtrl',function($scope,$ionicPopup,$timeout,$state,sqliteServices,plantillaA1Services,loginServices,popupServices,$ionicActionSheet,$q,$ionicModal,ServicesPhoto,gpsServices,envioPendientesServices,$firebaseArray,$firebaseObject,$rootScope, $cordovaNetwork){
	// INIT CARGA DE LOAD	
	$scope.showAll = "";			
	var onlineState,offlineState;
	/*document.addEventListener("deviceready", function () {

		var type = $cordovaNetwork.getNetwork()	
		var isOnline = $cordovaNetwork.isOnline();
		if(isOnline){
			//$scope.showAll = "";
		}else{
			//$scope.showAll = "disabledContent";
		}
		//var isOffline = $cordovaNetwork.isOffline()	
	
		// listen for Online event
		$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
			//$scope.showAll = "";			
		})
	
		// listen for Offline event
		$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
			//$scope.showAll = "disabledContent";
			popupServices.alertPop('Confirmación !','Activar sus datos para continuar con el trabajo.');		
		})
	
	  }, false);*/

	  
	var refNotification = new Firebase('https://dsigelecturas.firebaseio.com/');
	var notificationAlert =  $firebaseArray(refNotification);
			// SEGUNDA CARGA ESPERANDO EVENTOS.
	notificationAlert.$watch(function(event) {	
		
		if(event.event == "child_removed"){
			return;
		}
		
		var Ket = event.key;		
		var SuministroNumeroAux = $scope.itemSuministro.Suministro_Numero;	
		var result = notificationAlert.$getRecord(Ket);				
		if (result.Suministro_Numero == SuministroNumeroAux) {
			popupServices.alertPop('Confirmación !','Se habilitó la observación!');		
			$scope.itemSuministro.cliente_vip = 0;
			notificationAlert.$loaded(function(res){
				res.forEach(function(item,index){					
					if (item.Suministro_Numero == SuministroNumeroAux) {						
						res.$remove(item);
					}
				})			
			})
		}
	});

	$scope.onlyNumbers = /^\d+$2/;
	var Operario_EnvioEn_Linea;
	$scope.iconPosition = "ion-android-arrow-forward";
	var txtregLectura;
	var dataUser;
	var tiempoEnvio = 2;
	var ordenAux = "asc";
	var ordenAuxM = ">";
	var txtNroSuministro,txtNroMedidor;
	var existeAux = false;
	var existeAux2 = false;
	var tomaFoto = 0;
	var primerIngreso = 0;
	var tipoProcesoAux = '4';
	var showFueraRango = true;
	$scope.listRegistros = {
		total : 0,
		registrados : 0,
	}	
	$scope.flagSelfie = false;
	$scope.initCarga = function(){
	$timeout(function(){
		primerIngreso = 0;
		dataUser = localStorage.getItem('dataUser');
		dataUser = JSON.parse(dataUser);		
		tiempoEnvio = dataUser.tiempoEnvio;
		
		Operario_EnvioEn_Linea = dataUser.Operario_EnvioEn_Linea;		
		$scope.showListLecturas = false;
		$scope.showLoaderPlan = true;
		$scope.showDns = true;
		$scope.showSum = false;
		var itemFirst = localStorage.getItem('dataSuministro5');				
		var executeInit = function(){
			// VALIDACIONES AL INICIAR
				// SI EL SUMINISTRO_DNS == "SI" ENTONCES EL CAMPO DE DNS APARECERÁ, SI NO , NO APARECERA Y SE GUARDARA COMO 0
			if ($scope.itemSuministro.Suministro_dns != "S") {
					$scope.showDns = false;
			}	
			$timeout(function(){
				$scope.showLoaderPlan = false;
				$scope.showListLecturas = true;
				// TRAEMOS LOS DATOS DEL ITEM SELECCIONADO		
			},100);
			//
			// CREAMOS PARAMETROS EL CUAL REGISTRAREMOS EN LA TABLA DE LECTURAS
			$scope.paramsLecturas = {
		       ID_Suministro : $scope.itemSuministro.ID_Suministro,       
		       ID_TipoLectura : 1,
		       Registro_Fecha_SQLITE : plantillaA1Services.getDateHoy(),
		       Registro_Latitud : '',
		       Registro_Longitud : '',
		       Registro_Lectura : '',       
		       Registro_Confirmar_Lectura : '',
		       Registro_Observacion : '',
		       Grupo_Incidencia_Codigo : '',
		       Registro_dns : '',
		       Registro_Ubicacion : '',
		       Registro_TieneFoto : '',
		       ID_General : '',
		       Registro_Medidor : ''
			}
			$scope.paramsLecturasA = {
				Registro_Lectura : '',
				Registro_LecturaD : '',			
			}
			$timeout(function(){
				$scope.getCantidadSuministros();
			},100)			
			txtregLectura = document.getElementById('regLectura');	
			txtNroSuministro = document.getElementById('txtNroSuministro');
			txtNroMedidor = document.getElementById('txtNroMedidor');		
			txtregLectura.maxLength = $scope.itemSuministro.Suministro_CantidadDigitos;
			$scope.nroLength = $scope.itemSuministro.Suministro_CantidadDigitos;
			$timeout(function(){
				txtregLectura.focus();
			},500)
		}
		var txtHeader;
		if (itemFirst == 'undefined' || itemFirst == null) {
			// CONSULTAMOS AL PRIMER REGISTRO
			sqliteServices.getTbl_Suministros(0,'',dataUser.ID_Operario,tipoProcesoAux).then(function(data){				
				$scope.itemSuministro = data[0];
				txtHeader = $scope.itemSuministro.SuministroOrden;								
				localStorage.setItem('dataSuministro5',JSON.stringify(data[0]));				
				executeInit();
			});
		}else{			
			if (!existeAux) {				
				$scope.colorButton= "";							
			}
			if (!existeAux2) { // si es falso
				$scope.itemSuministro = JSON.parse(itemFirst);	
				txtHeader = $scope.itemSuministro.SuministroOrden;				
				if (!existeAux) {					
					localStorage.setItem('dataSumAnterior5',itemFirst)
				}

			}else{				
				$scope.itemSuministro = JSON.parse(localStorage.getItem('dataSumAnterior5'));
				txtHeader = $scope.itemSuministro.SuministroOrden;				
				existeAux2 = false;				
			};
			
			executeInit();			
		}	
		console.log($scope.itemSuministro);
		$scope.textObservacion = "";			
		// LECTURA OBSERVADA CONDICIÓN
		if($scope.itemSuministro.Suministro_TipoProceso == 3){
			$scope.textObservacion = "Lectura Observada";
		}else{
			$scope.textObservacion = "";
		};
		// LECTURA CLIENTE VIP CONDICIÓN
		$scope.textClienteVip = "";
		if($scope.itemSuministro.cliente_vip == 1){
			$scope.textClienteVip = "Caso requiere foto obligatoria";	
		}else if($scope.itemSuministro.cliente_vip == 2){
			$scope.textClienteVip = "Caso critico requiere, lectura y foto obligatoria";
		}
		$timeout(function(){				
			$scope.txtHeader = txtHeader;
		},1000);

		// EVNETO QUE RECIBE EL ACCESO DESDE LA WEB
		if($scope.itemSuministro.cliente_vip == 2){	
			var SuministroNumero = $scope.itemSuministro.Suministro_Numero;		
			// PRIMERA CARGA
			notificationAlert.$loaded(function(res){
				res.forEach(function(item,index){					
					if (item.Suministro_Numero == SuministroNumero) {
						$timeout(function(){
							popupServices.alertPop('Confirmación !','Se habilitó la observación! ');
							$scope.itemSuministro.cliente_vip = 0;
							res.$remove(item);
						},1000)						
						
					}
				})			
			})
		}

		//
	})	

	}

	var pruebaFireBase = function(){
		var refNotification = new Firebase('https://dsigelecturas.firebaseio.com/');
		var notificationAlert = $firebaseArray(refNotification);
		var nroSuministro = 1175149 // CAMBIAR POR NUMERO DE SUMINISTRO
		var person = {
			Suministro_Numero : nroSuministro, 
			value: 1
		}		
		notificationAlert.$loaded(function (res) {
			res.forEach(function (item, index) {
				if (item.Suministro_Numero == nroSuministro) {
					res.$remove(item);
				}
			});
			$timeout(function () {
				notificationAlert.$add(person).then(function (ref) {
					
				});
			}, 100)

		});
	}

	$timeout(function(){
		
		//pruebaFireBase();
	},500)
	$scope.classDisabled = "";
	$scope.getCantidadSuministros = function(){		
		$timeout(function(){
			sqliteServices.getTbl_Suministros_Cant(dataUser.ID_Operario,tipoProcesoAux).then(function(res){				
				if (res.length == 1) {
					// NO HAY NINGUN REGISTRO EN ESTADO B
					$scope.listRegistros.total = res[0].cantidad;
					var paramsSelfie = {
						inicio : 0,
						mitad : parseInt($scope.listRegistros.total / 2),
						final : 1
					};
					/*if ($scope.listRegistros.registrados == paramsSelfie.inicio) {
						popupServices.confirmPop("Tomar Selfie","Antes de iniciar lecturas es neceasario tomar un selfie, desea continuar?").then(function(res){
							if (res) {				
								
							}else{
								//$scope.classDisabled = "disabledContent";
							};
						});
					};*/

				}else{
					// SE ENCONTRO REGISTRO EN ESTADO B					
					$scope.listRegistros.total = res[0].cantidad  + res[1].cantidad;
					$scope.listRegistros.registrados = res[1].cantidad;

				}
			})			
		})
	}	
	$scope.goHome = function(){
		$state.go('menu.home');
	};
	var flagReLec = false;
	var returnInsert = true;
	$scope.disabledInput = false;
	var validarSelfiexDia = function(){
		var q = $q.defer();
		var inicio = 0;
		var mitad = parseInt($scope.listRegistros.total / 2);
		var final = parseFloat($scope.listRegistros.total - 1);
		var valReg = $scope.listRegistros.registrados;
		var fechahoy = plantillaA1Services.getDateHoyF();

		var selfieParams = localStorage.getItem('flagSelfie');
		
		if (selfieParams == null) {
			q.resolve(true);
		}else{
			var selfieParams = JSON.parse(selfieParams);
			//if (selfieParams.numberFlag == 1 && selfieParams.fecha == fechahoy) {				
			if (selfieParams.numberFlag == 1) {				
				// SI ES 1 Y FECHA DE HOY , QUIERE SECIR QUE EL PROXIMO SELFIE ES EN LA MITAD DEL TOTAL DE REGISTROS
				// SI NO ES ASI , RETORNAMOS FALSE;
				if (valReg == mitad) {
					q.resolve(true);
				}else{
					q.resolve(false);
				};
			}else if(selfieParams.numberFlag == 2){				
				// SI ES 2 Y FECHA DE HOY , QUIERE SECIR QUE EL PROXIMO SELFIE ES EN LA MITAD DEL TOTAL DE REGISTROS
				// SI NO ES ASI , RETORNAMOS FALSE;				
				if (valReg == final) {
					q.resolve(true);
				}else{
					q.resolve(false);
				};
			}else if(selfieParams.numberFlag == 3){
				// SI ES 3 Y FECHA DE HOY , ENTONCES YA REALIZO TODOS LOS SELFIES.
				// ASI QUE RETORNAMOS FALSE, PARA QUE GRABE DE FRENTE.
				q.resolve(false);
			}else{
				q.resolve(true);
			};
		};		
		return q.promise;
	}
	var myPopupNew;
	var tomaFotoNew = 0;

	var showModalMedidor = function() {
	  $scope.data = {};

	  // An elaborate, custom popup
	  $scope.closeModalNew = function(){
	  	$timeout(function(){
			var text = $scope.data.wifi.length;
	  		if (text == 2) {
	  			myPopupNew.close();	
	  		}
	  	})
	  	
	  }
	  myPopupNew = $ionicPopup.show({
	    template: '<input type="tel" id="txtNewInput" ng-keydown="closeModalNew()" numeric-only maxlength="2" ng-model="data.wifi">',
	    title: 'Validación',
	    subTitle: 'Ingresar 2 ultimos digitos del medidor.',
	    scope: $scope,
	  
	  });

		myPopupNew.then(function(res){			
			var digitosIngresados = String($scope.data.wifi);
			var medidorDigitos = String($scope.itemSuministro.Suministro_Medidor);
			medidorDigitos = medidorDigitos.substring(medidorDigitos.length - 2 ,medidorDigitos.length);
			console.log(medidorDigitos,digitosIngresados);
			if (digitosIngresados != medidorDigitos) {
				var pop = popupServices.alertPop('Alerta','Digitos ingresados no coinciden con la del medidor.');	
				pop.then(function(){
					showModalMedidor();
				})
				tomaFotoNew = 0;
			}else{
				tomaFotoNew = 1;
				executeSaveSelfie();
			}
			showModal = false;
		})	  	
	  $timeout(function(){
		var newInput = document.getElementById('txtNewInput');
	  	newInput.focus();
	  },100)
	  
	}
	var showModal = false;
	$scope.saveSelfie = function(){
		if (!returnInsert) {			
			return;
		};		
		//getPorceCalculo(2);
		tomaFotoNew = 0;
		// VALIDAMOS EL DECIMAL
			// SI EL CAMPO LECTURA ESTA LLENO, OBLIGATORIAMENTE TENEMOS QUE PONER UN DECIMAL.			
			if ($scope.paramsLecturasA.Registro_Lectura.length > 0) {
				console.log($scope.paramsLecturasA.Registro_LecturaD);
				if ($scope.paramsLecturasA.Registro_LecturaD.length == 0) {
					var pop = popupServices.alertPop('Alerta','No ha ingresado un decimal !.');
					return;
					// ODECIMAL OBLIGATORIO
				}				
			}
		//
// ULTIMA VALIDACIÓN , SI CONSUMOACTUAL > CONSUMOPROMEDIO X 2 , GUARDAR 2 ULTIMOS DIGITOS DEL MEDIDOR												
			returnInsert = true;
			$scope.disabledInput = false;
			var nroLecturas = String($scope.paramsLecturasA.Registro_Lectura);// + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
			if ($scope.paramsLecturasA.Registro_LecturaD.length == 0) {
				$scope.paramsLecturasA.Registro_LecturaD = 0;
			};
			var lecturaActual = String($scope.paramsLecturasA.Registro_Lectura) + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
			var lecturaAnterior = $scope.itemSuministro.LecturaAnterior;
			var consumoActual = parseFloat(lecturaActual) - parseFloat(lecturaAnterior);							
			var consumoPromedioAux = (parseFloat($scope.itemSuministro.ConsumoPromedio) * 2);			
			if ($scope.itemSuministro.ConsumoPromedio > 0) {
				if (consumoActual > consumoPromedioAux) {
					tomaFotoNew = 1;
					executeSaveSelfie();
					//if (showModal) { return;};
					//showModalMedidor();
					//showModal = true;			
					//return;
				}else{
					executeSaveSelfie();
				};					
			}else{
				executeSaveSelfie();
			}

	}

		var executeSaveSelfie = function(){
			if($scope.itemSuministro.cliente_vip == 2){
				if($scope.paramsLecturas.Registro_Observacion != 00 && $scope.paramsLecturas.Registro_Observacion != 25){			
						var template = "<div style='text-align:center;'>" +
						"<ion-spinner icon='android' class='loadingok'></ion-spinner></div>";
						 var popAlert = popupServices.alertPop('Validando cobertura . . .', template, 'popButtonHide');
						 $scope.params = {
							nomusu : '11',
							passusu : '22',
							tipo : 1,
						}
						loginServices.logInPrueba($scope.params).then(function(result){				
							var pop = popupServices.alertPop('CON COBERTURA !','Si Desea cambiar de Observacion Comunicarse con el Administrador de las lecturas.');
							popAlert.close();
						},function(err){
							var pop = popupServices.alertPop('SIN COBERTURA !','Se habilitó la observación');
							$scope.itemSuministro.cliente_vip = 0;
							popAlert.close();
						})

					return;
				}			
			}
			var popAlert;
			var txtReturn;
			var inicio = 0;
			var mitad = parseInt($scope.listRegistros.total / 2);
			var final = parseFloat($scope.listRegistros.total - 1);
			var valReg = $scope.listRegistros.registrados;
			var numberFlag = 0;
			if (valReg == inicio) {
				numberFlag = 1;
			}else if(valReg == mitad){
				numberFlag = 2;
			}else if(valReg == final){
				numberFlag = 3;
			};
			var flagSelfieAux = $scope.itemSuministro.flagSelfie;
			
			if (valReg == inicio || valReg == mitad || valReg == final){
				validarSelfiexDia().then(function(res){				
					if (res){
						if (showModal) { return;};				
						showModal = true;
						var txtReturn = document.getElementById('txtRegUb');
						popupServices.confirmPop("Tomar Selfie","Antes de continuar, es neceasario tomar un selfie, desea continuar?").then(function(res){
							if (res) {
								 //PRUEBAS ALVAREZ
								//$scope.saveLectura();
								//return;
								showModal = false;
								$scope.flagSelfie = true;
								$scope.takePhotoSelfie(numberFlag).then(function(){
									alert('Selfie Tomada Correctamente');
									$timeout(function(){									
										$scope.saveLectura();
									})
								},function(err){
									var template = "<div style='text-align:center;'>"+ 'Tomar el selfie es obligatorio !' +
												   "<i style='color:#F44336;font-size: 23px;' class='icon ion-android-alert placeholder-icon'></i></div>";
									var pop = popupServices.alertPop('Alerta !' , template);
									pop.then(function(){
										$timeout(function(){
											txtReturn.focus();
											showModal = false;
										},500);
									})
								});
							}else{
								$scope.flagSelfie = false;
								var template = "<div style='text-align:center;'>"+ 'Tomar el selfie es obligatorio !' +
											   "<i style='color:#F44336;font-size: 23px;' class='icon ion-android-alert placeholder-icon'></i></div>";
								var pop = popupServices.alertPop('Alerta !' , template);
								pop.then(function(){
									$timeout(function(){
										txtReturn.focus();
										showModal = false;
									},500);
								});
							}
						});					
					}else{					
						$scope.saveLectura();
					};
				});
			}else{
				$scope.flagSelfie = false;
				$scope.saveLectura();
			};				
		}	
	// PARAMETROS NUEVO CAMPO

	$scope.saveLectura = function(){
		if (!returnInsert) {			
			return;
		};
		returnInsert = false;
		$scope.disabledInput = true;
		cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
			var enabledAux = (enabled ? true : false);		
			var enabledAux = true;	
			if (enabledAux) {
				// GPS ACTIVO
				$timeout(function(){

					$scope.valicacionLecturas().then(function(res){							
							// CAPTURAMOS EL RESULTADO DE LA VALIDACIÓN ( LECTURA INGRESADA ESTA DENTRO DEL INTERVALO MINIMA Y MAXIMA)
							if (res) {
								// VALIDAMOS SI LA LEECTURA ES VACIO
								if ($scope.paramsLecturasA.Registro_Lectura.length == 0) {
									tomaFoto = 1;
								}else if($scope.itemSuministro.ConsumoPromedio == 0 | $scope.itemSuministro.ConsumoPromedio == "0"){
									tomaFoto = 1;
								}
								// VALIDAMOS IS LA LECTURA ACTUAL ES MENOR A LA LECTURA ANTERIOR
								var p = $scope.paramsLecturasA;							
								var lecturaAnterior = parseFloat($scope.itemSuministro.LecturaAnterior);						
								var lecturaIngresada = parseFloat( String(p.Registro_Lectura) + '.' + String(p.Registro_LecturaD));
								
								
								if(lecturaIngresada <= lecturaAnterior){
									tomaFoto  = 1;
									var resultLec = lecturaAnterior - lecturaIngresada;
									resultLec = Math.round(resultLec * 100) / 100;
									if (resultLec == 0.1) {
										tomaFoto = 0;																		
										if (flagReLec) {
											$scope.paramsLecturas.Registro_Confirmar_Lectura = lecturaAnterior;
										}else{
											$scope.paramsLecturas.Registro_Lectura = lecturaAnterior;
										}
										console.log($scope.paramsLecturas);
									}
								}							
								// DENTRO DEL INTERVALO : REGISTRAMOS							
								if (tomaFoto == 1 || $scope.itemSuministro.cliente_vip == 1 || $scope.itemSuministro.cliente_vip == 2 || tomaFotoNew == 1) {
									// SIGNIFICA QUE OBSERVACIÓN SELECCIONADA PIDE FOTO , 
									//CUMPLA O NO CONDICIÓN DE LECTURA MINIMA Y MAXIMA
									tomaFoto = 1;
								    $timeout(function(){
								    	$scope.takePhoto(1);
								    })					
								}else{
									tomaFoto = 0;
									if ($scope.flagSelfie == false) {
										$scope.paramsLecturas.ID_General = plantillaA1Services.getCodUniq();
									};						
									insertLectura($scope.paramsLecturas).then(function(){						
										if (Operario_EnvioEn_Linea == 1) {
											envioPendientesServices.sendAllDataToServidor().then(function(res){								
												nextSuministro().then(function(res){								
													$scope.showListLecturas = false;
													$scope.showLoaderPlan = true;								
													$scope.initCarga();								
													flagReLec = false;
													returnInsert = true;
													$scope.disabledInput = false;
												});
											},function(err){
												
											})
										}else{
											nextSuministro().then(function(res){
												$scope.initCarga();
												$scope.showListLecturas = false;
												$scope.showLoaderPlan = true;
												flagReLec = false;
												returnInsert = true;
												$scope.disabledInput = false;		
											});
										}
									});					
								}				

							}else{
								// FUERA DEL INTERVALO
								/*if (!flagReLec) {
									flagReLec = true;
									$scope.paramsLecturasA.Registro_Lectura = "";
									$scope.paramsLecturasA.Registro_LecturaD = "";
									var txtregLectura = document.getElementById('regLectura');
									$timeout(function(){
										txtregLectura.focus();
									},500)
								}else{
									$timeout(function(){
								    	$scope.takePhoto(1);
								    })
								}*/			
								tomaFoto = 1;
								$timeout(function(){									
								   	$scope.takePhoto(1);
								});
							}

						//
					},function(err){
						var template = "<div style='text-align:center;'>"+ err +
									   "<i style='color:#F44336;font-size: 23px;' class='icon ion-android-alert placeholder-icon'></i></div>";
						popupServices.alertPop('Alerta !' , template);
					})

				},200);

			}else{
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
					}else{
						var txtSeg = document.getElementById('txtRegUb');
						$timeout(function(){
							txtSeg.focus();
						},200)						
					}
				});
				returnInsert = true;
				$scope.disabledInput = false;
			}
		}, function(error){
			popupServices.alertPop('Error','Ocurrio un problema con la conexión.');
			returnInsert = true;
			$scope.disabledInput = false;
		});

	}
	$scope.saveFotoFolder = function(){
		if ($scope.listFotos.length < 1) {
			popupServices.alertPop('Error !' , "Ingresar como minimo 1 foto .");
			return;
		}
		var cantFoto = $scope.listFotos.length -1;
		// FLAG SELFIE
		if ($scope.flagSelfie == false) {
			$scope.paramsLecturas.ID_General = plantillaA1Services.getCodUniq();
		};
		insertLectura($scope.paramsLecturas).then(function(res){
			var ID_Registro = res.insertId;
			$scope.listFotos.forEach(function(item,index){
				ServicesPhoto.savePhotoFolder(item.SrcUri,item.RutaFoto).then(function(resFolder){
					var params = [{
						ID_Registro : 0,
						RutaFoto : item.RutaFoto,
						Fecha_Sincronizacion_Android : item.Fecha_Sincronizacion_Android,
						ID_General : $scope.paramsLecturas.ID_General,
						urlFoto : resFolder.nativeURL,
						flag_prioridad : 0,
					}];
					sqliteServices.saveTbl_Registros_Foto_Back(params);
					sqliteServices.saveTbl_Registros_Foto(params).then(function(res){						
						if (cantFoto == index) {				
							if (Operario_EnvioEn_Linea == 1) { // ENVIA DATOS ONLINE
								envioPendientesServices.sendAllDataToServidor().then(function(res){									
									nextSuministro().then(function(){
										$scope.closeModal();
										$scope.initCarga();
										$scope.showListLecturas = false;
										$scope.showLoaderPlan = true;
										returnInsert = true;
										$scope.disabledInput = false;
										flagReLec = false;
										$scope.listFotos = [];					
									});	
								},function(err){
									
								})	
							}else{ // GUARDA DATOS OFFLINE								
								nextSuministro().then(function(){
									$scope.closeModal();
									$scope.initCarga();
									$scope.showListLecturas = false;
									$scope.showLoaderPlan = true;
									flagReLec = false;
									returnInsert = true;
									$scope.disabledInput = false;
									$scope.listFotos = [];					
								});								
							}								
						};						
					});

				})
			})
		});
	}
	// ACTIVATE INTERNVAL GPS
	gpsServices.activateGps();
	var loadPop;	
	var insertLectura = function(params){
		var q = $q.defer();
		//loadPop = popupServices.loaderPop("Guardando lectura . . ");
		$scope.showLoaderPlan = true;
		$scope.paramsLecturas.Registro_TieneFoto = tomaFoto;
		var objRespaldo = $scope.paramsLecturas;
		var params = ['B',$scope.itemSuministro.id];
		
			// RESPALDO
			var resultBak = "";
			for (var item in $scope.paramsLecturas) {
				resultBak += $scope.paramsLecturas[item] + '|';
			}
			resultBak = resultBak.substring(0,resultBak.length -1);
			var objectRespaldo = {
				lectura : resultBak,
				device : '0',
				id_device : '0',
				suministro : $scope.itemSuministro.Suministro_Numero,
				fecha_movil : $scope.paramsLecturas.Registro_Fecha_SQLITE,
				id_operario : dataUser.ID_Operario
			}		
			
			var resGps = gpsServices.getGpsAux();
			objRespaldo.Registro_Latitud =	resGps.lat;
			objRespaldo.Registro_Longitud = resGps.lon;
			
			sqliteServices.saveTbl_Registros(objRespaldo).then(function(res){				
				sqliteServices.saveTbl_Registros_back(objRespaldo).then(function(){
					sqliteServices.saveTbl_Suministro_Back(objectRespaldo).then(function(){
						sqliteServices.updateEstatusTbl_Suministros(params).then(function(){									
							q.resolve('success');
							//loadPop.close();				
							$timeout(function(){					
								if (existeAux) {// SI ES TRUE SI EXISTE EL REGISTRO Y LO ACTUALIZA
									existeAux2 = false; 
								}
								$scope.flagSelfie = false;
								$scope.colorButton = "";			
			//					var params = ['B',$scope.itemSuministro.id];					
								
								sqliteServices.getTbl_ParametrosById(7).then(function(res){						
									var totalReg = tiempoEnvio;						// GUARDAR FINAL

									sqliteServices.getTbl_Suministros_CantTotal(dataUser.ID_Operario,tipoProcesoAux).then(function(ress){
										
										var totalRestante = ress[0].cantidad;									
										if(totalRestante == 0){
											console.log('ENVIANDO SERVIDOR . . ');								
											envioPendientesServices.sendAllDataToServidor2().then(function(res){
												console.log('Envio registros interno correcto')
												envioPendientesServices.sendAllDataToServidorfotosInterno().then(function(res){
													console.log('Envio Fotos interno correcto')
												},function(err){
													console.log('envio fotos itnerno error');
												});							
											},function(err){
												console.log('ocurrio un errro en el envio interno',err)
											});
																			
										}else{
											
											if ($scope.listRegistros.registrados >= totalReg) {
												console.log('ENVIANDO SERVIDOR . . ');
												envioPendientesServices.sendAllDataToServidor2().then(function(res){
													console.log('Envio registros interno correcto')
													envioPendientesServices.sendAllDataToServidorfotosInterno().then(function(res){
														console.log('Envio Fotos interno correcto')
													},function(err){
														console.log('envio fotos itnerno error');
													});							
												},function(err){
													console.log('ocurrio un errro en el envio interno',err)
												});
											}								
										};
									})
								})

							},100)						
						},function(err){
							popupServices.alertPop('Error !' , "Ocurrio un error al registrar lectura 6!");
							flagReLec = false;
							returnInsert = true;
							$scope.disabledInput = false;				
							//loadPop.close();
							q.reject(err);	
						});

					},function(err){
						popupServices.alertPop('Error !' , "Ocurrio un error al registrar lectura 5!");
						flagReLec = false;
						returnInsert = true;
						$scope.disabledInput = false;				
						//loadPop.close();
						q.reject(err);		
					});		
				},function(err){
					popupServices.alertPop('Error !' , "Ocurrio un error al registrar lectura 3!");
					flagReLec = false;
					returnInsert = true;
					$scope.disabledInput = false;				
					//loadPop.close();
					q.reject(err);
				});

			},function(err){
				popupServices.alertPop('Error !' , "Ocurrio un error al registrar lectura !");
				flagReLec = false;
				returnInsert = true;
				$scope.disabledInput = false;				
				//loadPop.close();
				q.reject(err);				
			})			

		return q.promise;
	}
	var getPorceCalculo = function(value){
		var lecturaActual;
		if (value == 1) {
			lecturaActual = String($scope.paramsLecturasA.Registro_Lectura);
		}else{
			if ($scope.paramsLecturasA.Registro_LecturaD.length == 0) {
				$scope.paramsLecturasA.Registro_LecturaD = 0;
			};		
			lecturaActual = String($scope.paramsLecturasA.Registro_Lectura) + '.' + String($scope.paramsLecturasA.Registro_LecturaD);		
		}
	
		var lecturaAnterior = parseFloat($scope.itemSuministro.LecturaAnterior);						
		
		var consumoActual = parseFloat(lecturaActual) - parseFloat(lecturaAnterior);

		var porceCalculoReal = 0;
		var inicialReal = 0;
		var minimoReal = 0;
		var maximoReal = 0;
		var consumoPromedioReal = parseFloat($scope.itemSuministro.ConsumoPromedio);
		if (consumoActual >= 15 && consumoActual <=30) {
			inicialReal = 15;
			porceCalculoReal = 75;
		}else if(consumoActual >=31 && consumoActual <=100){
			inicialReal = 31;
			porceCalculoReal = 45;
		}else if(consumoActual > 100){
			inicialReal = 101;
			porceCalculoReal = 25;
			minimoReal = lecturaAnterior + (consumoPromedioReal -(consumoPromedioReal * 0.25));
			maximoReal = lecturaAnterior + (consumoPromedioReal +(consumoPromedioReal * 0.25));
			$scope.itemSuministro.Suministro_LecturaMinima = parseFloat(minimoReal);
			$scope.itemSuministro.Suministro_LecturaMaxima = parseFloat(maximoReal);
		}
		$scope.itemSuministro.inicial = parseFloat(inicialReal);
		$scope.itemSuministro.PorceCalculo = parseFloat(porceCalculoReal);
	}	
	$scope.valicacionLecturas = function(){
		var q = $q.defer();
		var p = $scope.paramsLecturas;
		// VALIDAMOS OBSERVACIÓN : GRUPO 1
		var params = [1,p.Registro_Observacion];
		sqliteServices.getTbl_Detalle_grupoByGrupo_Codigo(params).then(function(res){
			if (res.length == 0) {				
				q.reject("Codigo de Observación no existe !");
				p.Registro_Observacion = "";
				return;
			}
			// VALIDAMOS DNS : GRUPO 3
			params = [3,p.Registro_dns];
			sqliteServices.getTbl_Detalle_grupoByGrupo_Codigo(params).then(function(res){
				if ($scope.showDns == true) {
					if (res.length == 0) {				
						q.reject("Codigo de DNS no existe !");
						p.Registro_dns = "";
						return;
					}					
				}
				// VALIDAMOS UBICACIÓN : GRUPO 4
				params = [4,p.Registro_Ubicacion];
				sqliteServices.getTbl_Detalle_grupoByGrupo_Codigo(params).then(function(res){
					if (res.length == 0) {				
						q.reject("Codigo de Ubicación no existe !");
						p.Registro_Ubicacion = "";
						return;
					}					
					// SI LECTURA INGRESADA ES MENOR A LECTURA ANTERIOR, TOMA FOTO
					var nroLecturas = String($scope.paramsLecturasA.Registro_Lectura);// + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
					if ($scope.paramsLecturasA.Registro_LecturaD.length == 0) {
						$scope.paramsLecturasA.Registro_LecturaD = 0;
					}					
					var nroLecturasReg = String($scope.paramsLecturasA.Registro_Lectura) + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
					if (flagReLec) {
						$scope.paramsLecturas.Registro_Confirmar_Lectura = nroLecturasReg;
					}else{
						$scope.paramsLecturas.Registro_Lectura = nroLecturasReg;
					}						
					var p = $scope.paramsLecturasA;							
					var lecturaAnterior = parseFloat($scope.itemSuministro.LecturaAnterior);						
					var lecturaIngresada = parseFloat( String(p.Registro_Lectura) + '.' + String(p.Registro_LecturaD));
					if(lecturaIngresada <= lecturaAnterior){						
						q.resolve(true);
						return;
					}					//
					
					// VALIDAMOS SI EL PROCENTAJE ES 0 , NO PIDE FOTO
					if ($scope.itemSuministro.PorceCalculo == 0) {
						var nroLecturas = String($scope.paramsLecturasA.Registro_Lectura);// + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
						if ($scope.paramsLecturasA.Registro_LecturaD.length == 0) {
							$scope.paramsLecturasA.Registro_LecturaD = 0;
						}					
						var nroLecturasReg = String($scope.paramsLecturasA.Registro_Lectura) + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
						if (flagReLec) {
							$scope.paramsLecturas.Registro_Confirmar_Lectura = nroLecturasReg;
						}else{
							$scope.paramsLecturas.Registro_Lectura = nroLecturasReg;
						}	
						q.resolve(true);
					}else if($scope.itemSuministro.PorceCalculo == 25){
					// POR ULTIMO VALIDAMOS SI LA LECTURA INGRESADA ES MAYOR O IGUAL A LA MINIMA Y MENOS O IGUAL AL MAXIMO
						var nroLecturas = String($scope.paramsLecturasA.Registro_Lectura);// + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
						if ($scope.paramsLecturasA.Registro_LecturaD.length == 0) {
							$scope.paramsLecturasA.Registro_LecturaD = 0;
						}					
						var nroLecturasReg = String($scope.paramsLecturasA.Registro_Lectura) + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
						if (flagReLec) {
							$scope.paramsLecturas.Registro_Confirmar_Lectura = nroLecturasReg;
						}else{
							$scope.paramsLecturas.Registro_Lectura = nroLecturasReg;
						}					
						nroLecturas = parseFloat(nroLecturasReg);
						var lecturasMin = parseFloat($scope.itemSuministro.Suministro_LecturaMinima);
						var lecturasMax = parseFloat($scope.itemSuministro.Suministro_LecturaMaxima);
						if ((nroLecturas >= lecturasMin) && (nroLecturas <= lecturasMax)) {
							q.resolve(true)
						}else{
							q.resolve(false)
						}
					//
					}else{
						
						var nroLecturas = String($scope.paramsLecturasA.Registro_Lectura);// + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
						if ($scope.paramsLecturasA.Registro_LecturaD.length == 0) {
							$scope.paramsLecturasA.Registro_LecturaD = 0;
						}					
						var lecturaActual = String($scope.paramsLecturasA.Registro_Lectura) + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
						var lecturaAnterior = $scope.itemSuministro.LecturaAnterior;
						var consumoActual = parseFloat(lecturaActual) - parseFloat(lecturaAnterior);
						var inicial = parseFloat($scope.itemSuministro.Inicial);
						var PorceCalculo = parseFloat($scope.itemSuministro.PorceCalculo)						
						// CONSUMO ACTUAL TIENE UQE SER MAYOR O IGUAL AL INICIAL
						if (flagReLec) {
							$scope.paramsLecturas.Registro_Confirmar_Lectura = lecturaActual;
						}else{
							$scope.paramsLecturas.Registro_Lectura = lecturaActual;
						}
						if (consumoActual >= inicial) {
							var porcentaje =  ((parseFloat(consumoActual) / parseFloat($scope.itemSuministro.ConsumoPromedio))-1) * 100;							
							if (porcentaje > PorceCalculo) {
								q.resolve(false);
							}else{
								q.resolve(true);  
							}							
						}else{
							q.resolve(true);
						}						
						
					}								
					// POR ULTIMO VALIDAMOS SI LA LECTURA INGRESADA ES MAYOR O IGUAL A LA MINIMA Y MENOS O IGUAL AL MAXIMO
					/*var nroLecturas = String($scope.paramsLecturasA.Registro_Lectura);// + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
					if ($scope.paramsLecturasA.Registro_LecturaD.length == 0) {
						$scope.paramsLecturasA.Registro_LecturaD = 0;
					}					
					var nroLecturasReg = String($scope.paramsLecturasA.Registro_Lectura) + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
					if (flagReLec) {
						$scope.paramsLecturas.Registro_Confirmar_Lectura = nroLecturasReg;
					}else{
						$scope.paramsLecturas.Registro_Lectura = nroLecturasReg;
					}					
					nroLecturas = parseFloat(nroLecturas);					
					var lecturasMin = parseFloat($scope.itemSuministro.Suministro_LecturaMinima);
					var lecturasMax = parseFloat($scope.itemSuministro.Suministro_LecturaMaxima);
					if ((nroLecturas >= lecturasMin) && (nroLecturas <= lecturasMax)) {
						q.resolve(true)
					}else{
						q.resolve(false)
					}*/
					//
				});

			})
		})

		return q.promise;
	}
	$scope.validateRange = function(){

		// POR ULTIMO VALIDAMOS SI LA LECTURA INGRESADA ES MAYOR O IGUAL A LA MINIMA Y MENOS O IGUAL AL MAXIMO
		var txtSeg = document.getElementById("regLecturaD");
		var nroLecturas = String($scope.paramsLecturasA.Registro_Lectura)// + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
		if (flagReLec) {
			$scope.paramsLecturas.Registro_Confirmar_Lectura = nroLecturas;
		}else{
			$scope.paramsLecturas.Registro_Lectura = nroLecturas;
		}
		nroLecturas = parseFloat(nroLecturas);
		var lecturasMin = parseFloat($scope.itemSuministro.Suministro_LecturaMinima);
		var lecturasMax = parseFloat($scope.itemSuministro.Suministro_LecturaMaxima);
		validateRango().then(function(res){
			// FUERA DE RANGO
			if (!res) {
				if (!flagReLec) {
							flagReLec = true;
							primerIngreso = $scope.paramsLecturasA.Registro_Lectura;
							$scope.paramsLecturasA.Registro_Lectura = "";
							$scope.paramsLecturasA.Registro_LecturaD = "";
							var txtregLectura = document.getElementById('regLectura');
				
							if (!showFueraRango) {return;}
							showFueraRango = false;							
							var pop = popupServices.alertPop('Alerta !' , "Fuera de rango..");
							pop.then(function(res){
								$timeout(function(){
									showFueraRango = true;	
									txtregLectura.focus();
								},500)						
							})					
						}else{
							if ($scope.paramsLecturasA.Registro_Lectura != primerIngreso) {
								primerIngreso = $scope.paramsLecturasA.Registro_Lectura;
								$scope.paramsLecturasA.Registro_Lectura = "";
								$scope.paramsLecturasA.Registro_LecturaD = "";				
								if (!showFueraRango) {return;}
								showFueraRango = false;
								var txtregLectura = document.getElementById('regLectura');
								var pop = popupServices.alertPop('Alerta !' , "Fuera de rango..");
								pop.then(function(res){
									$timeout(function(){
										showFueraRango = true;	
										txtregLectura.focus();
									},500)						
								})
							}else{
								txtSeg.focus();	
							}
							
							
						}	
			}else{
			// DENTRO DE RANGO
				txtSeg.focus();	
			}
			var lecturaIngresadaEntero = parseInt(String($scope.paramsLecturasA.Registro_Lectura));
			var lecturaAnteriorMenos1 = parseInt($scope.itemSuministro.LecturaAnterior);
			var txtregLecturax = document.getElementById('regLecturaD');
			if(lecturaIngresadaEntero < lecturaAnteriorMenos1){
				if (!showPopInferior) { return;}
				showPopInferior = false;			
				//var pop = popupServices.alertPop('Alerta !' , "Lectura inferior.(" + $scope.itemSuministro.LecturaAnterior + ")");
				var pop = popupServices.alertPop('Alerta !' , "Fuera de rango3.");
				pop.then(function(){
					$timeout(function(){
					showPopInferior = true;
					txtregLecturax.focus();
					},500)							
				})				
			};			
		})
		/*if ((nroLecturas >= lecturasMin) && (nroLecturas <= lecturasMax)) {			
			txtSeg.focus();	
		}else{			
			if (!flagReLec) {
				flagReLec = true;
				primerIngreso = $scope.paramsLecturasA.Registro_Lectura;
				$scope.paramsLecturasA.Registro_Lectura = "";
				$scope.paramsLecturasA.Registro_LecturaD = "";
				var txtregLectura = document.getElementById('regLectura');
	
				
				var pop = popupServices.alertPop('Alerta !' , "Fuera de rango..");
				pop.then(function(res){
					$timeout(function(){
						txtregLectura.focus();
					},500)						
				})				
			}else{
				if ($scope.paramsLecturasA.Registro_Lectura != primerIngreso) {
					primerIngreso = $scope.paramsLecturasA.Registro_Lectura;
					$scope.paramsLecturasA.Registro_Lectura = "";
					$scope.paramsLecturasA.Registro_LecturaD = "";				
					var txtregLectura = document.getElementById('regLectura');
					var pop = popupServices.alertPop('Alerta !' , "Fuera de rango..");
					pop.then(function(res){
						$timeout(function(){
							txtregLectura.focus();
						},500)						
					})
				}else{
					txtSeg.focus();	
				}
				
				
			}	
		}*/
	}	

	var validateRango = function(){
		var q = $q.defer();
		//ALVAREZ
		//getPorceCalculo(1);
		var lecturaD = 0;
		
					if ($scope.itemSuministro.PorceCalculo == 0) {
						q.resolve(true);
					}else if($scope.itemSuministro.PorceCalculo == 25){
					// POR ULTIMO VALIDAMOS SI LA LECTURA INGRESADA ES MAYOR O IGUAL A LA MINIMA Y MENOS O IGUAL AL MAXIMO
						var nroLecturas = String($scope.paramsLecturasA.Registro_Lectura);// + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
						if ($scope.paramsLecturasA.Registro_LecturaD.length == 0) {
							lecturaD = 0;
						}					
						var nroLecturasReg = String($scope.paramsLecturasA.Registro_Lectura) + '.' + String(lecturaD);
						if (flagReLec) {
							$scope.paramsLecturas.Registro_Confirmar_Lectura = nroLecturasReg;
						}else{
							$scope.paramsLecturas.Registro_Lectura = nroLecturasReg;
						}					
						nroLecturas = parseFloat(nroLecturasReg);				
						var lecturasMin = parseFloat($scope.itemSuministro.Suministro_LecturaMinima);
						var lecturasMax = parseFloat($scope.itemSuministro.Suministro_LecturaMaxima);
						if ((nroLecturas >= lecturasMin) && (nroLecturas <= lecturasMax)) {
							q.resolve(true)
						}else{
							q.resolve(false)
						}
					//
					}else{

						var nroLecturas = String($scope.paramsLecturasA.Registro_Lectura);// + '.' + String($scope.paramsLecturasA.Registro_LecturaD);
						if ($scope.paramsLecturasA.Registro_LecturaD.length == 0) {
							lecturaD = 0;
						}					
						var lecturaActual = String($scope.paramsLecturasA.Registro_Lectura) + '.' + String(lecturaD);
						var lecturaAnterior = $scope.itemSuministro.LecturaAnterior;
						var consumoActual = parseFloat(lecturaActual) - parseFloat(lecturaAnterior);
						var inicial = parseFloat($scope.itemSuministro.Inicial);
						var PorceCalculo = parseFloat($scope.itemSuministro.PorceCalculo)						
						// CONSUMO ACTUAL TIENE UQE SER MAYOR O IGUAL AL INICIAL
						if (consumoActual >= inicial) {
							var porcentaje =  ((parseFloat(consumoActual) / parseFloat($scope.itemSuministro.ConsumoPromedio))-1) * 100;							
							if (porcentaje > PorceCalculo) {
								q.resolve(false);
							}else{
								q.resolve(true);
							}							
						}else{
							q.resolve(true);
						}						
						
					}

					return q.promise;	
	}
	var nextSuministro = function(){
		var q = $q.defer();
		var idReg = $scope.itemSuministro.SuministroOrden;		
		sqliteServices.getTbl_SuministrosById(idReg,ordenAuxM,ordenAux,tipoProcesoAux).then(function(res){			
			if (res.length == 0) {
				sqliteServices.getTbl_Suministros(0,'',dataUser.ID_Operario,tipoProcesoAux).then(function(data){
					$scope.showListLecturas = false;
					$scope.itemSuministro = data[0];					
					localStorage.setItem('dataSuministro5',JSON.stringify(data[0]));				
					$scope.showLoaderPlan = false;				
					q.reject('cancel')
					return;					
				});
			}			
			q.resolve('success');
			localStorage.setItem('dataSuministro5',JSON.stringify(res[0]));
		})
		return q.promise;
	};
	var nextSuministroAux = function(){
		var q = $q.defer();
		var idReg = $scope.itemSuministro.SuministroOrden;		
		sqliteServices.getTbl_SuministrosByIdAux(idReg,ordenAuxM,ordenAux,tipoProcesoAux).then(function(res){			
			if (res.length == 0) {
				sqliteServices.getTbl_Suministros(0,'',dataUser.ID_Operario,tipoProcesoAux).then(function(data){
					$scope.showListLecturas = false;
					$scope.itemSuministro = data[0];					
					localStorage.setItem('dataSuministro5',JSON.stringify(data[0]));				
					$scope.showLoaderPlan = false;				
					q.reject('cancel')
					return;					
				});
			}			
			q.resolve('success');
			localStorage.setItem('dataSuministro5',JSON.stringify(res[0]));
		})
		return q.promise;
	};	
	$scope.changePositionSuministro = function(){
		$scope.colorButton = "";
		existeAux = false;
		ordenAux = ordenAux == "asc" ? 'desc' : 'asc';
		ordenAuxM = ordenAuxM == "<" ? '>' : '<';
		sqliteServices.getTbl_SuministrosByIdChange(dataUser.ID_Operario,ordenAux,tipoProcesoAux).then(function(res){
			localStorage.setItem('dataSuministro5',JSON.stringify(res[0]));									
			$scope.initCarga();
		})
	}
	$scope.changePositionReg = function(){
		$scope.iconPosition = $scope.iconPosition == "ion-android-arrow-forward" ? "ion-android-arrow-back" : "ion-android-arrow-forward";
		ordenAux = ordenAux == "asc" ? 'desc' : 'asc';
		ordenAuxM = ordenAuxM == "<" ? '>' : '<';
		$timeout(function(){
			txtregLectura.focus();
		})
	}

   	$ionicModal.fromTemplateUrl('my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	$scope.openModal = function(tip) {
	    $scope.modal.show();
	    $timeout(function(){
	    	$scope.takePhoto(1);
	    })

	};
	$scope.closeModal = function() {
	    $scope.modal.hide();
	    $scope.showListModal = false;
	};

	$scope.listFotos = [];
	$scope.zoomMin = 1;
	$scope.showImages = function(index) {		
	    $scope.activeSlide = index;
	    $scope.showModal('templates/ZoomImage/adm-galleryzoom.html');
	};
  	$scope.showModal = function(templateUrl) {
	    $ionicModal.fromTemplateUrl(templateUrl, {
	      scope: $scope
	    }).then(function(modal) {
	      $scope.modalImage = modal;
	      $scope.modalImage.show();
	    });
	  }	
	$scope.closeModalImage = function() {
	    $scope.modalImage.hide();
	    $scope.modalImage.remove()
	};
	$scope.takePhoto = function(tipo){	
		if ($scope.listFotos.length == 2) {
			popupServices.alertPop('Alerta !' , "Ya ingreso la cantidad maxima de fotos.");
			return;
		}
		ServicesPhoto.callCamera(tipo).then(function(resCam){
			// ALGORITMO PARA GENERAR EL CORRELATIVO DE FOTOS TOMADAS			
			var Suministro = $scope.itemSuministro.Suministro_Numero;
			var nroFoto = 0;
			var cant = $scope.listFotos.length;
			if (cant == 0) {
				nroFoto = 1;
			}else{
				nroFoto = $scope.listFotos[cant - 1].RutaFoto.replace('.jpg','').split('_');
				nroFoto = parseInt(nroFoto[1]) + 1;				
			}
			var uri = "data:image/jpeg;base64," + resCam;
			var nameFoto = String(Suministro) + '_' + plantillaA1Services.getCodUniq() + '_' + nroFoto + '.jpg';
			showCanvas(uri).then(function(resCanvasUri){
				$scope.listFotos.push({
					ID_Registro : '',
		      		RutaFoto : nameFoto,
		      		Fecha_Sincronizacion_Android : plantillaA1Services.getDateHoy(),
		      		ID_General : '',
		      		SrcUri : resCanvasUri
				})
				$scope.saveFotoFolder();
			});

		},function(err){
			returnInsert = true;
			$scope.disabledInput = false;
			//alert(JSON.stringify(err));
		})
	};
	$scope.takePhotoSelfie = function(numberFlag){
		var q = $q.defer();
		$scope.paramsLecturas.ID_General = plantillaA1Services.getCodUniq();
		ServicesPhoto.callCamera(1).then(function(resCam){
			// ALGORITMO PARA GENERAR EL CORRELATIVO DE FOTOS TOMADAS			
			var Suministro = $scope.itemSuministro.Suministro_Numero;
			var nroFoto = 0;
			var cant = $scope.listFotos.length;
			nroFoto = numberFlag;
			var uri = "data:image/jpeg;base64," + resCam;
			var nameFoto = String(Suministro)+ '_self' + '_' + nroFoto + '.jpg';			
			showCanvas(uri).then(function(resCanvasUri){
				ServicesPhoto.savePhotoFolder(resCanvasUri,nameFoto).then(function(resFolder){
					var params = [{
						ID_Registro : 0,
						RutaFoto : nameFoto,
						Fecha_Sincronizacion_Android : plantillaA1Services.getDateHoy(),
						ID_General : $scope.paramsLecturas.ID_General,
						urlFoto : resFolder.nativeURL,
						flag_prioridad : 0
					}];
					var paramsStorage = {
						numberFlag : numberFlag,
						fecha : plantillaA1Services.getDateHoyF()
					};
					localStorage.setItem('flagSelfie',JSON.stringify(paramsStorage));
					sqliteServices.saveTbl_Registros_Foto_Back(params);
					sqliteServices.saveTbl_Registros_Foto(params).then(function(res){						
						// ACTUALIZAMOS PARA QUE NO VUELVA A PEDIR SELFIE
						// sqliteServices.updateTbl_suministro_flagSelfie($scope.itemSuministro.id);
						//$scope.flagSelfie = false;
						q.resolve('success');
						
					});
				})
			});
		},function(err){
			q.reject('error');
			showModal = false;
			//returnInsert = true;
			//$scope.disabledInput = false;
			//alert(JSON.stringify(err));
		})
		return q.promise;
	};	
	$scope.deleteFoto = function(item){
		popupServices.confirmPop("Confirmación","Eliminará esta fotografía , desea continuar ?").then(function(res){
			if (res) {				
				$scope.listFotos.splice($scope.listFotos.indexOf(item), 1);
			}
		})
	}
	/*var showCanvas = function(uri){
		var q = $q.defer();
		var imgAux = new Image();
		imgAux.src = uri;
		imgAux.onload = function(){
		    var height = imgAux.height;
		    var width = imgAux.width;			
		    
			var canvas;
	        canvas = document.createElement('canvas');
	        canvas.width  = height;
			canvas.height = width;
	        var ctx = canvas.getContext("2d");
	        ctx.fillStyle = "#e23325";
			var img = new Image();		
			img.src = uri;		
			ctx.font = "bold 20px sans-serif";				
			img.onload = function(){
				var degrees = 90;
				ctx.save();
			    //ctx.translate(150,300);		    
				ctx.translate(150,canvas.height/2);
			    ctx.rotate(degrees*Math.PI/180);
			    ctx.drawImage(img,-img.width/2,-img.width/2);
			    ctx.restore();
				ctx.fillText(plantillaA1Services.getDateHoy(),20,20);				

				var dataURL = canvas.toDataURL("image/jpeg", 1.0);				
				q.resolve(dataURL);
			}			
		}	
		return q.promise;
	}*/

	var showCanvas = function(uri){
		var q = $q.defer();
		var imgAux = new Image();
		imgAux.src = uri;
		imgAux.onload = function(){
		    var height = imgAux.height;
		    var width = imgAux.width;			
			var canvas;
	        canvas = document.createElement('canvas');
	        canvas.width  = width;
			canvas.height = height;
	        var ctx = canvas.getContext("2d");
	        ctx.fillStyle = "#e23325";
			var img = new Image();		
			img.src = uri;		
			ctx.font = "bold 17px sans-serif";				
			img.onload = function(){
				ctx.drawImage(img, 0, 0);
				ctx.fillText(plantillaA1Services.getDateHoy(),10,20);				
				var dataURL = canvas.toDataURL("image/jpeg", 1.0);				
				q.resolve(dataURL);
			}			
		}	
		return q.promise;
	}
	$scope.goToMap = function(){
		$state.go('menu.home-mapsLecturasUnit2');		
	}
	$scope.changeInput = function(txt,option,val){
		var p = $scope.paramsLecturas;
		if (val == 1) {		// VALIDAMOS OBSERVACIÓN	
			var params = [1,p.Registro_Observacion];			
			sqliteServices.getTbl_Detalle_grupoByGrupo_Codigo(params).then(function(res){
				
				if (res.length == 0) {
					var template = "<div style='text-align:center;'>Codigo de Observación No existe" +
								   "<i style='color:#F44336;font-size: 23px;' class='icon ion-android-alert placeholder-icon'></i></div>";
					var pop = popupServices.alertPop('Alerta !' , template);					
					pop.then(function(res){
						if (res) {
							var txtSeg = document.getElementById('txtObs');
							$timeout(function(){
								txtSeg.value = "";
								txtSeg.focus();		
							},500)
						}
					})
				}else{
					tomaFoto = res[0].PideFoto;					
					if ($scope.itemSuministro.Suministro_dns == "S") {						
						var txtSeg = document.getElementById(txt);
						txtSeg.focus();
					}else{
						var txtSeg = document.getElementById('txtRegUb');
						txtSeg.focus();
					}
				}
			})
			return;
		}else if(val == 2){
			var params = [3,p.Registro_dns];			
			sqliteServices.getTbl_Detalle_grupoByGrupo_Codigo(params).then(function(res){
				if (res.length == 0) {
					var template = "<div style='text-align:center;'>Codigo de Dns no existe !" +
								   "<i style='color:#F44336;font-size: 23px;' class='icon ion-android-alert placeholder-icon'></i></div>";
					var pop = popupServices.alertPop('Alerta !' , template);
					pop.then(function(res){
						if (res) {
							var txtSeg = document.getElementById('txtDns');
							$timeout(function(){
								txtSeg.value = "";
								txtSeg.focus();		
							},500)
						}
					})								
				}else{
					if ($scope.itemSuministro.Suministro_dns == "S") {
						var txtSeg = document.getElementById(txt);
						txtSeg.focus();
					}else{
						var txtSeg = document.getElementById('txtRegUb');
						txtSeg.focus();
					}
				}
			})
			return;
		}else if(val == 3){			
			var params = [4,p.Registro_Ubicacion];			
			sqliteServices.getTbl_Detalle_grupoByGrupo_Codigo(params).then(function(res){
				console.log(res);
				if (res.length == 0) {
					var template = "<div style='text-align:center;'>Codigo de Ubicación no existe !" +
								   "<i style='color:#F44336;font-size: 23px;' class='icon ion-android-alert placeholder-icon'></i></div>";
					var pop = popupServices.alertPop('Alerta !' , template);					
					pop.then(function(res){
						if (res) {
							var txtSeg = document.getElementById('txtRegUb');
							$timeout(function(){
								txtSeg.value = "";
								txtSeg.focus();		
							},500)
							
						}
					})					
				}else{
					$scope.saveSelfie();
				}
			})
			return;			
		}else if(val == 4){
			var txtSumAux = document.getElementById(txt);
			txtSumAux.focus();		
						
		}else{
			var txtSeg = document.getElementById(txt);
			txtSeg.focus();
		}

	}
	var nrosLength = [4,5,6];
	$scope.nroLength = nrosLength[2];
	$scope.changeLength = function(){		
		var index = nrosLength.indexOf(parseFloat($scope.nroLength));		
		if (index == 2) { 
			index = -1
		};
		$scope.nroLength = nrosLength[index + 1];
		txtregLectura.maxLength = $scope.nroLength;
		$timeout(function(){
			txtregLectura.focus();
		},300)		
	}
	$scope.countLength = function(val){
		
		var p = $scope.paramsLecturasA;
		var pp = $scope.paramsLecturas;
		if (val == 1) {
			$timeout(function(){
				var lengthTxt = p.Registro_Lectura.length;	
				if (lengthTxt == $scope.nroLength) {
					$timeout(function(){
						$scope.validateRange();						
					},100)			
				}	
			},100)
		
		}else if(val == 2){
			$timeout(function(){				
				var lengthTxt = p.Registro_LecturaD.length;
				if (lengthTxt  == 1) {					
					$timeout(function(){						
						var lecturaAnterior = parseFloat($scope.itemSuministro.LecturaAnterior);						
						var lecturaIngresada = parseFloat( String(p.Registro_Lectura) + '.' + String(p.Registro_LecturaD));
						// VALIDAMOS SI EL REGISTRO ANTERIOR ES MENOR SOLO EN DECIMALES						
						var lecturaAnteriorEntero = parseInt($scope.itemSuministro.LecturaAnterior);
						var lecturaIngresadaEntero2 = parseInt(String(p.Registro_Lectura) + '.' + String(p.Registro_LecturaD));					
						
						
						if(lecturaAnteriorEntero == lecturaIngresadaEntero2){
							// VALIDAMOS SI LA LECTURA ANTERIOR ES MENOR A LA LECTURA INGRESADA, DE SER ASI
						// ENVIAMOS UN MENSAJE AL OPERARIO PARA QUE LO SEPA.													
							if(lecturaIngresada < lecturaAnterior){
								//var pop = popupServices.alertPop('Alerta !' , "Lectura inferior. (" + lecturaAnterior + ")");
								var pop = popupServices.alertPop('Alerta !' , "Fuera de rango.");
								pop.then(function(){
									$timeout(function(){
										
										$scope.changeInput('regLecturaD');
									},500)							
								})
							}else{
								$scope.changeInput('txtObs');
							}
						}else{
							$scope.changeInput('txtObs');
						}

						
					},100)
				}
			},100)
		}else if(val == 3){
			$timeout(function(){
				var lengthTxt = pp.Registro_Observacion.length;	
				
				if (lengthTxt == 2) {
					$timeout(function(){						
						if (pp.Registro_Observacion == 23) {							
							$scope.showSum = true;
							$timeout(function(){
								$scope.changeInput('txtNroMedidorAux',4,4)	
							})
							
						}else{
							$scope.changeInput('txtDns',1,1);
						}						
						
					},100)
				}
			},100)
		}else if(val == 4){
			$timeout(function(){
				var lengthTxt = pp.Registro_dns.length;
				if (lengthTxt == 1) {
					$timeout(function(){
						$scope.changeInput('txtRegUb',1,2);
					},100)
				}
			},100)

		}else if(val == 5){
			$timeout(function(){
				var lengthTxt = pp.Registro_Ubicacion.length;				
				if (lengthTxt == 1) {
					$timeout(function(){						
						$scope.changeInput('txtRegUb',1,3);
					},100)
				}				
			},100)
		}else if(val == 6){
			$timeout(function(){
				var lengthTxt = pp.Registro_Medidor.length ;			
				if (lengthTxt == 8) {
					$timeout(function(){
						$scope.changeInput('txtDns',1,1);
					},100)
				}
			},100)
		}
	}
	$scope.getSuministros = function(text,tip){
		$timeout(function(){
			var cant = 0;
			var textFilter = document.getElementById(text).value;
			sqliteServices.getTbl_SuministrosAux(cant,textFilter,dataUser.ID_Operario,tipoProcesoAux).then(function(data){				
				if (data.length == 0) {
					$scope.showErr = true;
					$timeout(function(){
						$scope.showErr = false;
					},1500)
					if (tip == 1) {
						txtNroSuministro.focus();
					}else{
						txtNroMedidor.focus();
					}
					/*var pop = popupServices.alertPop('Alerta !' , template);
					pop.then(function(res){
						$timeout(function(){
							if (tip == 1) {
								txtNroSuministro.focus();
							}else{
								txtNroMedidor.focus();
							}							
						})
					})*/
				}else{
					
					if (data[0].estado == "B") {
						
						//localStorage.setItem('dataSumAnterior',JSON.stringify($scope.itemSuministro))						
						$scope.colorButton= "color : #ef473a !important;";
						existeAux = true;	
						existeAux2 = false;					
						sqliteServices.getTbl_RegistrosByIdSum(data[0].ID_Suministro).then(function(res){
							var lecturaD = res[0].Registro_Lectura.split('.');
							$scope.paramsLecturasA.Registro_Lectura = lecturaD[0];
							$scope.paramsLecturasA.Registro_LecturaD = lecturaD[1];
							$scope.paramsLecturas.Registro_Observacion = res[0].Registro_Observacion;
							$scope.paramsLecturas.Registro_dns = res[0].Registro_dns;
							$scope.paramsLecturas.Registro_Ubicacion = res[0].Registro_Ubicacion;							
							if (res[0].Registro_Observacion == 23) {
								$scope.showSum = true;
								$scope.paramsLecturas.Registro_Medidor = res[0].Registro_Medidor;
							}
							
						})						
					}else{
						$scope.colorButton= "";
						existeAux = false;
					}					
					localStorage.setItem('dataSuministro5',JSON.stringify(data[0]));					
					$scope.initCarga();
				}				
			},function(err){
					
			});			
		})		
	}
	$scope.nextBack = function(con){
		existeAux = false;		
		if (con == 1) {
			// BACK
			$scope.iconPosition = "ion-android-arrow-back";
			ordenAux = "desc";
			ordenAuxM = "<";
			$timeout(function(){
				txtregLectura.focus();
			})			
			nextSuministroAux().then(function(res){								
				$scope.showListLecturas = false;
				$scope.showLoaderPlan = true;								
				$scope.initCarga();								
				flagReLec = false;						
			});
		}else{
			// SIGUIENTE
			$scope.iconPosition = "ion-android-arrow-forward";
			ordenAux = "asc";
			ordenAuxM = ">";
			$timeout(function(){
				txtregLectura.focus();
			})			
			nextSuministroAux().then(function(res){								
				$scope.showListLecturas = false;
				$scope.showLoaderPlan = true;								
				$scope.initCarga();								
				flagReLec = false;						
			});			
		}
	}
})

function onFocusS(input){
      input.value = "";
}
function onFocusM(input){
      input.value = "";
}