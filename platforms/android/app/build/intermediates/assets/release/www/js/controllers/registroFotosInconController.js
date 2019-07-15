
angular.module('app.registroFotosInconController', [])

.controller('registroFotosInconCtrl',function($scope,$timeout,$state,sqliteServices,plantillaA1Services,popupServices,$ionicActionSheet,$q,$ionicModal,ServicesPhoto,gpsServices,envioPendientesServices){
	// INIT CARGA DE LOAD	
	var estado_general = "X";
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
	var tipoProcesoAux = 1;
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
		console.log('TIEMPO DE ENVIO ES DE CADA ' + tiempoEnvio);				
		Operario_EnvioEn_Linea = dataUser.Operario_EnvioEn_Linea;		
		$scope.showListLecturas = false;
		$scope.showLoaderPlan = true;
		$scope.showDns = true;
		$scope.showSum = false;
		var itemFirst = localStorage.getItem('dataSuministro4');				
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
			sqliteServices.getTbl_Suministros_Foto(0,'',dataUser.ID_Operario,estado_general).then(function(data){				
				console.log(data);
				$scope.itemSuministro = data[0];
				txtHeader = $scope.itemSuministro.SuministroOrden;								
				localStorage.setItem('dataSuministro4',JSON.stringify(data[0]));				
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
					localStorage.setItem('dataSumAnterior4',itemFirst)
				}

			}else{				
				$scope.itemSuministro = JSON.parse(localStorage.getItem('dataSumAnterior4'));
				txtHeader = $scope.itemSuministro.SuministroOrden;				
				existeAux2 = false;				
			};
	
			executeInit();			
		}
		console.log($scope.itemSuministro);
			$timeout(function(){				
				$scope.txtHeader = txtHeader;
			},1000)		

	})		


	}
	$scope.classDisabled = "";
	$scope.getCantidadSuministros = function(){		
		$timeout(function(){
			sqliteServices.getTbl_Suministros_Cant_Foto(dataUser.ID_Operario,estado_general).then(function(res){				
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
			if (selfieParams.numberFlag == 1 && selfieParams.fecha == fechahoy) {				
				// SI ES 1 Y FECHA DE HOY , QUIERE SECIR QUE EL PROXIMO SELFIE ES EN LA MITAD DEL TOTAL DE REGISTROS
				// SI NO ES ASI , RETORNAMOS FALSE;
				if (valReg == mitad) {
					q.resolve(true);
				}else{
					q.resolve(false);
				};
			}else if(selfieParams.numberFlag == 2 && selfieParams.fecha == fechahoy){				
				// SI ES 2 Y FECHA DE HOY , QUIERE SECIR QUE EL PROXIMO SELFIE ES EN LA MITAD DEL TOTAL DE REGISTROS
				// SI NO ES ASI , RETORNAMOS FALSE;				
				if (valReg == final) {
					q.resolve(true);
				}else{
					q.resolve(false);
				};
			}else if(selfieParams.numberFlag == 3 && selfieParams.fecha == fechahoy){
				// SI ES 3 Y FECHA DE HOY , ENTONCES YA REALIZO TODOS LOS SELFIES.
				// ASI QUE RETORNAMOS FALSE, PARA QUE GRABE DE FRENTE.
				q.resolve(false);
			}else{
				q.resolve(true);
			};			
		};		
		return q.promise;
	}
	$scope.saveSelfie = function(){
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
		

		if (valReg == inicio || valReg == mitad || valReg == final){
			validarSelfiexDia().then(function(res){				
				if (res){
					var txtReturn = document.getElementById('txtRegUb');
					popupServices.confirmPop("Tomar Selfie","Antes de continuar, es neceasario tomar un selfie, desea continuar?").then(function(res){
						if (res) {
							 //PRUEBAS ALVAREZ
							//$scope.saveLectura();
							//return;
							
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
	$scope.saveLectura = function(){
		if (!returnInsert) {			
			return;
		};
		returnInsert = false;
		$scope.disabledInput = true;
		cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
			var enabledAux = (enabled ? true : false);
			if (enabledAux) {
				// GPS ACTIVO
				$timeout(function(){

					$scope.valicacionLecturas().then(function(res){	
						$timeout(function(){
						   	$scope.takePhoto(1);
						})	

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
		$scope.listFotos.forEach(function(item,index){
			ServicesPhoto.savePhotoFolder(item.SrcUri,item.RutaFoto).then(function(resFolder){
				var params = [{
					ID_Registro : 0,
					RutaFoto : item.RutaFoto,
					Fecha_Sincronizacion_Android : item.Fecha_Sincronizacion_Android,
					ID_General : $scope.itemSuministro.ID_General,
					urlFoto : resFolder.nativeURL,
					flag_prioridad : 2
				}];				
				sqliteServices.saveTbl_Registros_Foto_Back(params);
				sqliteServices.saveTbl_Registros_Foto(params).then(function(res){
				var params = ['B',$scope.itemSuministro.id];
				sqliteServices.updateEstatusTbl_Suministros_Foto(params);									
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
	}
	var loadPop;	
	var insertLectura = function(params){
		var q = $q.defer();
		//loadPop = popupServices.loaderPop("Guardando lectura . . ");
		$scope.showLoaderPlan = true;
		var objRespaldo = $scope.paramsLecturas;
		var params = ['B',$scope.itemSuministro.id];

		sqliteServices.updateEstatusTbl_Suministros(params);
		q.resolve('success');
		
		gpsServices.getCurrentPosition().then(function(res){
			objRespaldo.Registro_Latitud = res.lat;
			objRespaldo.Registro_Longitud = res.long;	
			sqliteServices.saveTbl_Registros_back(objRespaldo);
			
			sqliteServices.saveTbl_Registros(objRespaldo).then(function(res){				
				$timeout(function(){					
					if (existeAux) {// SI ES TRUE SI EXISTE EL REGISTRO Y LO ACTUALIZA
						existeAux2 = false; 
					}
					$scope.flagSelfie = false;
					$scope.colorButton = "";			
//					var params = ['B',$scope.itemSuministro.id];					
//					sqliteServices.updateEstatusTbl_Suministros(params)	
					sqliteServices.getTbl_ParametrosById(7).then(function(res){						
						var totalReg = tiempoEnvio;
						// GUARDAR FINAL
						sqliteServices.getTbl_Suministros_CantTotal(dataUser.ID_Operario,tipoProcesoAux).then(function(ress){
							var totalRestante = ress[0].cantidad;
							console.log(totalRestante);							
							if(totalRestante == 0){
								console.log('ENVIANDO SERVIDOR . . ');								
								envioPendientesServices.sendAllDataToServidor().then(function(res){
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
								console.log($scope.listRegistros.registrados + ' >= ' + totalReg);
								if ($scope.listRegistros.registrados >= totalReg) {
									console.log('ENVIANDO SERVIDOR . . ');
									envioPendientesServices.sendAllDataToServidor().then(function(res){
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
				q.reject(err);
				
			})			
		},function(err){
			popupServices.alertPop('Error !' , "Gps no activado y/o error de conexión");
		})
		return q.promise;
	}
	$scope.valicacionLecturas = function(){
		var q = $q.defer();
		q.resolve('true');
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
		if ((nroLecturas >= lecturasMin) && (nroLecturas <= lecturasMax)) {			
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
		}
	}	
	var nextSuministro = function(){
		var q = $q.defer();
		var idReg = $scope.itemSuministro.SuministroOrden;		
		sqliteServices.getTbl_SuministrosById_Foto(idReg,ordenAuxM,ordenAux,estado_general).then(function(res){			
			if (res.length == 0) {
				sqliteServices.getTbl_Suministros_Foto(0,'',dataUser.ID_Operario,estado_general).then(function(data){
					$scope.showListLecturas = false;
					$scope.itemSuministro = data[0];					
					localStorage.setItem('dataSuministro4',JSON.stringify(data[0]));				
					$scope.showLoaderPlan = false;				
					q.reject('cancel')
					return;					
				});
			}			
			q.resolve('success');
			localStorage.setItem('dataSuministro4',JSON.stringify(res[0]));
		})
		return q.promise;
	};
	var nextSuministroAux = function(){
		var q = $q.defer();
		var idReg = $scope.itemSuministro.SuministroOrden;		
		sqliteServices.getTbl_SuministrosByIdAux_Foto(idReg,ordenAuxM,ordenAux,estado_general).then(function(res){			
			if (res.length == 0) {
				sqliteServices.getTbl_Suministros_Foto(0,'',dataUser.ID_Operario,estado_general).then(function(data){
					$scope.showListLecturas = false;
					$scope.itemSuministro = data[0];					
					localStorage.setItem('dataSuministro4',JSON.stringify(data[0]));				
					$scope.showLoaderPlan = false;				
					q.reject('cancel')
					return;					
				});
			}			
			q.resolve('success');
			localStorage.setItem('dataSuministro4',JSON.stringify(res[0]));
		})
		return q.promise;
	};
	$scope.changePositionSuministro = function(){
		$scope.colorButton = "";
		existeAux = false;
		ordenAux = ordenAux == "asc" ? 'desc' : 'asc';
		ordenAuxM = ordenAuxM == "<" ? '>' : '<';
		sqliteServices.getTbl_SuministrosByIdChange_Foto(dataUser.ID_Operario,ordenAux,estado_general).then(function(res){
			localStorage.setItem('dataSuministro4',JSON.stringify(res[0]));									
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

	var showCanvas = function(uri){
		var q = $q.defer();
		var imgAux = new Image();
		imgAux.src = uri;
		imgAux.onload = function(){
		    var height = imgAux.height;
		    var width = imgAux.width;			
		    console.log(width);
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
			var lengthTxt = p.Registro_LecturaD.length +1;			
			if (lengthTxt  == 1) {
				$timeout(function(){
					$scope.changeInput('txtObs');
				},100)
			}
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
			sqliteServices.getTbl_SuministrosAux_Foto(cant,textFilter,dataUser.ID_Operario,estado_general).then(function(data){				
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
					localStorage.setItem('dataSuministro4',JSON.stringify(data[0]));					
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
	$scope.gotoMap = function(){
		$state.go('menu.home-mapsLecturasUnit');
	}
})

function onFocusS(input){
      input.value = "";
}
function onFocusM(input){
      input.value = "";
}