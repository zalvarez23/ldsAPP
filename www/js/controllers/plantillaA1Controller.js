angular.module('app.plantillaA1Controller', [])

.controller('plantillaA1Ctrl',function($scope,$timeout,popupServices,ServicesPhoto,$ionicSlideBoxDelegate,$ionicScrollDelegate,$timeout,plantillaA1Services,sqliteServices,$state,$ionicTabsDelegate,$ionicActionSheet,$ionicModal,gpsServices){
	$scope.showLoaderPlanA1 = true;
	$scope.showListMovilOt = false;
	$scope.showPlantilla2 = false;
	$scope.showPlantilla3 = false;
	var parametersSistema = JSON.parse(localStorage.getItem('parameters'));
	var LsDetail = localStorage.getItem('dataActi');		
	$scope.listDetail = JSON.parse(LsDetail)
	var flagRegistrado = $scope.listDetail.registrado
	$scope.nameButton = "ADD";
	$timeout(function() {
		$scope.showListMovilOt = true;
		$scope.showLoaderPlanA1 = false;
		$scope.showTab2 = true;
		$scope.showTab3 = true;
		$scope.showTab4 = true;
		$scope.showTab5 = true;
		$scope.showTab6 = true;
	}, 1100);
  	$scope.getEjecutada = function(){
  		sqliteServices.getTbl_GrupoTablas().then(function(res){  			
  			$scope.listGrupoTabla = res;
  		})
  	}
  	$scope.selectId = function(item,tip){  	
  		// 5 : EJECUTADO
  		if (item.id_Grupo == 5) {
			$scope.nomEjecutada = item.descripcion_GrupoDetalle;
			$scope.idEjecutadaFilter = item.id_GrupoDetalle;
  		}// 6 :  POR MOTIVO
  		else if(item.id_Grupo == 6){  			
			$scope.nomPor = item.descripcion_GrupoDetalle;
			$scope.idPorFilter = item.id_GrupoDetalle;
  		}// 3 MARCA
  		else if (item.id_Grupo == 3){
  			// MEDIDOR RETIRADO
  			if (tip == 1) {
  				$scope.nomMarcaRet = item.descripcion_GrupoDetalle;
  				$scope.idMarcaRet = item.id_GrupoDetalle;
  			}// MEDIDOR INSTALADO
  			else if (tip == 2){
  				$scope.nomMarcaIns = item.descripcion_GrupoDetalle;
  				$scope.idMarcaIns = item.id_GrupoDetalle;
  			}
  		}// 5 MODELO
  		else if (item.id_Grupo == 4){
  			// MEDIDOR RETIRADO
  			if (tip == 1) {
  				$scope.nomModRet = item.descripcion_GrupoDetalle;
  				$scope.idModRet = item.id_GrupoDetalle;
  			}// MEDIDOR INSTALADO
  			else if (tip == 2){
  				$scope.nomModIns = item.descripcion_GrupoDetalle;
  				$scope.idModIns = item.id_GrupoDetalle;
  			}
  		}// 9 EJECUTIVO GRANDES CLIENTES
  		else if(item.id_Grupo == 9){
  			$scope.paramsTab3.ejecutivo = item.id_GrupoDetalle;
  		}// 7 TRABAJO SOLICITADO - CONCENTRADORES
  		else if(item.id_Grupo == 7){
  			$scope.paramsTab3.trabajo_solicitado = item.id_GrupoDetalle;
  		}// 8 TRABAJO REPORTADO - CONCENTRADORES
  		else if(item.id_Grupo == 8){
  			$scope.paramsTab3.trabajo_reportado = item.id_GrupoDetalle;
  		}
		alertPop.close();
  	}

  	$scope.changePor = function(item){
	
		alertPop.close();
  	}
	$scope.modalSelect = function(idGrupo,tipo){
		var cabecera,template;
		console.log(idGrupo)
		if (idGrupo == 6) {
			var idServicio = JSON.parse(localStorage.getItem('idServicios')).id_servicio;
			$scope.listGrupoTablaR = [];
			$scope.listGrupoTabla.forEach(function(item,index){
				
				if (item.id_servicio == idServicio) {
					$scope.listGrupoTablaR.push(item);
				};
			})
			if ($scope.listGrupoTablaR.length == 0) {
				alertPop = popupServices.alertPop('Error.','Datos no existes.');
				return;
			}
			cabecera = "Seleccionar una Ejecutada";
			template = '<div class="modalStyle">' +
					   '<div class="card-panel grey lighten-5 z-depth-1 cardP" ng-repeat="item in listGrupoTablaR | filter : { id_Grupo : '+ idGrupo +'}">' +
	        		   '<div class="row valign-wrapper contentPlantilla" ng-click="selectId(item,'+ tipo +');">' +
	           		   '<div class="col"><span class="black-text">{{item.descripcion_GrupoDetalle}}</span>' +
	           		   '</div></div></div></div>';
			alertPop = popupServices.alertPop(cabecera,template,'',$scope);	           		   
		}else{
			$scope.listGrupoTablaR = [];
			$scope.listGrupoTabla.forEach(function(item,index){			
				if (item.id_Grupo == idGrupo) {
					$scope.listGrupoTablaR.push(item);
				};
			})
			cabecera = "Seleccionar una Ejecutada";
			template = '<div class="modalStyle">' +
					   '<div class="card-panel grey lighten-5 z-depth-1 cardP" ng-repeat="item in listGrupoTablaR">' +
	        		   '<div class="row valign-wrapper contentPlantilla" ng-click="selectId(item,'+ tipo +');">' +
	           		   '<div class="col s8 m10"><span class="black-text">{{item.descripcion_GrupoDetalle}}</span>' +
	           		   '</div></div></div></div>';
	        alertPop = popupServices.alertPop(cabecera,template,'',$scope);
		}
		
	}

	$scope.paramsTab1 = {
		id_ordenTrabajo : '',
		fechaRegistro_OTC : '',
		direccion_OTC : '',
		suministro_OTC : '',
		nomreCliente_OTC : '',
		dniCliente_OTC : '',
		obs_OTC : '',
		id_ejecutado_OTC : '',
		id_motivo_OTC : '',
		hora_OTC : '',
		minuto_OTC : '',
		latitud_OTC : '',
		longitud_OTC : '',
		subEstacion_OTC : '',
		nro_Inspeccion_OTC : '',
		idGeneral : ''
	};
	$scope.changeStatusOrden = function(){
		var params = {
			Estado_OT : 6,
			id_ordenTrabajo : $scope.paramsTab1.id_ordenTrabajo
		}
		plantillaA1Services.updateStatusOtCab(params).then(function(res){
			
		})

	}
	$scope.updatePlantilla1= function(){		
		$scope.paramsTab1.id_ordenTrabajo = $scope.listDetail.id_ordenTrabajo;
		$scope.paramsTab1.fechaRegistro_OTC = plantillaA1Services.getDateHoy();
		$scope.paramsTab1.id_ejecutado_OTC = $scope.idEjecutadaFilter;
		$scope.paramsTab1.id_motivo_OTC = $scope.idPorFilter;
		plantillaA1Services.updateMovilOtCab($scope.paramsTab1,$scope.paramsTab1.id_ordenTrabajo).then(function(result){			
			$scope.showLoaderSave = true;
			$timeout(function(){
				$scope.showLoaderSave = false;
				$scope.showTab2 = false;
				var alertPop = popupServices.alertPop('Confirmación','Registro realizado correctamente!');
				// CAMBIAMOS ESTADO
				$scope.changeStatusOrden();
				alertPop.then(function(ok){
					$ionicTabsDelegate.select(1);
				});
			},1300)			
		},function(err){
			$scope.classDisabledP1 = "";
			$scope.showLoaderSave = false;
			console.log(err)
		})
	}

	$scope.savePlantilla1 = function(){
		// VALIDACIONES
		if ($scope.paramsTab1.obs_OTC == "") {
			var alertPop = popupServices.alertPop('Ocurrio un Error','Ingresar una Obs. de Trabajos.');
			return;
		}
		// FIN DE VALIDACIONES	
		$scope.showLoaderSave = true;
		//gpsServices.getCurrentPosition().then(function(ubic){		
			if (flagRegistrado == "si") {
				$scope.updatePlantilla1();
				return;
			}
			$scope.classDisabledP1 = "disabledContent";		
			$scope.paramsTab1.id_ordenTrabajo = $scope.listDetail.id_ordenTrabajo;
			$scope.paramsTab1.fechaRegistro_OTC = plantillaA1Services.getDateHoy();
			$scope.paramsTab1.id_ejecutado_OTC = $scope.idEjecutadaFilter;
			$scope.paramsTab1.id_motivo_OTC = $scope.idPorFilter;	
			$scope.paramsTab1.latitud_OTC = 0;
			$scope.paramsTab1.longitud_OTC = 0;
			$scope.paramsTab1.idGeneral = plantillaA1Services.getCodUniq();
			var f=new Date();
			$scope.paramsTab1.hora_OTC = f.getHours();
			$scope.paramsTab1.minuto_OTC = f.getMinutes();							
			plantillaA1Services.saveMovilOtCab($scope.paramsTab1).then(function(result){				
				$scope.idTblMovilOT = result.insertId;
				$scope.idGeneralOt = result.data[0].idGeneral;
			
				$timeout(function(){
					$scope.showLoaderSave = false;
					$scope.showTab2 = false;
					$scope.showTab3 = false;
					$scope.showTab4 = false;
					$scope.showTab5 = false;
					$scope.showTab6 = false;
					var alertPop = popupServices.alertPop('Confirmación','Registro realizado correctamente!');
					// CAMBIAMOS ESTADO
					$scope.changeStatusOrden();
					alertPop.then(function(ok){
						$ionicTabsDelegate.select(1);
					});
				},1300)			
			},function(err){
				$scope.classDisabledP1 = "";
				$scope.showLoaderSave = false;
				console.log(err)
			})			
		/*},function(err){
			$scope.showLoaderSave = false;
			popupServices.alertPop('Error','Gps no activado.');
		})*/


	}
	$scope.paramsTab2 = {
		nro_MedidorRet_OTC : '',
		marca_MedidorRet_OTC : '',
		modelo_MedidorRet_OTC : '',
		fase_MedidorRet_OTC : '',
		estado_MedidorRet_OTC : '',
		nro_MedidorIns_OTC : '',
		marca_MedidorIns_OTC : '',
		modelo_MedidorIns_OTC : '',
		fase_MedidorIns_OTC : '',
		estado_MedidorIns_OTC : '',
		id_ordenTrabajo : ''
	}

	$scope.savePlantilla2 = function(){	
		$scope.paramsTab2.id_ordenTrabajo = $scope.paramsTab1.id_ordenTrabajo;	
		$scope.paramsTab2.marca_MedidorRet_OTC = $scope.idMarcaRet;
		$scope.paramsTab2.modelo_MedidorRet_OTC = $scope.idModRet;
		$scope.paramsTab2.marca_MedidorIns_OTC = $scope.idMarcaIns;	
		$scope.paramsTab2.modelo_MedidorIns_OTC = $scope.idModIns;		
		plantillaA1Services.updateMovilOtCabP2($scope.paramsTab2).then(function(result){			
			//$scope.classDisabledP2 = "disabledContent";
			$scope.showLoaderSave2 = true;
			$timeout(function(){
				$scope.showLoaderSave2 = false;
				$scope.showTab3 = false;
				var alertPop = popupServices.alertPop('Confirmación','Registro realizado correctamente!');
				// CAMBIAR ESTADO AL NRO DE MEDIDOR , YA QUE SE UTILIZO				
				sqliteServices.anularTbl_Medidor(idMedidorAux).then(function(res){
					
				},function(err){
					console.log(err);
				})				
				alertPop.then(function(ok){
					$ionicTabsDelegate.select(2);
				});
			},1300)			
		},function(err){
			$scope.classDisabledP2 = "";
			console.log(err)
		})
	}

	$scope.paramsTab3 = {
		selloBor1_OTC : '',
		selloBor2_OTC : '',
		aledanio1_OTC : '',
		aledanio2_OTC : '',
		notificacion_OTC : '',
		trabajo_solicitado : '', 
		trabajo_reportado : '',
		ejecutivo : '',
		chip : '', 
		variomod : '',
		solicitante : '',
		factor : '',
		potencia : '',
		anio : '',
		id_ordenTrabajo : '',		

	}
	$scope.savePlantilla3 = function(){
		//$scope.classDisabledP3 = "disabledContent";
		$scope.paramsTab3.id_ordenTrabajo = $scope.paramsTab1.id_ordenTrabajo;			
		plantillaA1Services.updateMovilOtCabP3($scope.paramsTab3).then(function(result){			
			$scope.showLoaderSave3 = true;
			$timeout(function(){
				$scope.showLoaderSave3 = false;				
				var alertPop = popupServices.alertPop('Confirmación','Registro realizado correctamente!');
				alertPop.then(function(){
					$ionicTabsDelegate.select(3);
				})
			},1300)							
		},function(err){
			$scope.classDisabledP3 = "";
			console.log(err)
		})
	}

	// MDOO EDITAR 
	$scope.idTblMovilOT = 0;
	$scope.newPlantilla = function(){
		// VALIDAMOS QUE TIPO DE PLANTILLA ES 
			// TENEMOS id_plantilla = 3 (CONCENTRADORES) Y id_plantilla = 2 (Grandes Clientes)		
		var idPlantilla = parametersSistema.id_plantilla;
		if (idPlantilla == 2) {
			$scope.showPlantilla2 = true;
			$scope.showPlantilla3 = false;
		}else if(idPlantilla == 3){
			$scope.showPlantilla2 = false;
			$scope.showPlantilla3 = true;
		};
		if (flagRegistrado == "si") {
			// HABILITAMOS LOS TABS
			$timeout(function() {				
				$scope.showTab2 = false;			
				$scope.showTab3 = false;
				$scope.showTab4 = false;
				$scope.showTab5 = false;
				$scope.showTab6 = false;
			}, 1500);			
			// TRAEMOS DATOS REGISTRADOS
			$scope.paramsTab1.suministro_OTC = parseInt($scope.listDetail.suministro_OT);
			$scope.paramsTab1.dniCliente_OTC = parseInt($scope.listDetail.dniCliente_OT);
			$scope.paramsTab1.nomreCliente_OTC = $scope.listDetail.nomreCliente_OT;

			var id_ordenTrabajo = $scope.listDetail.id_ordenTrabajo;			
			plantillaA1Services.gettbl_Movil_OT_Cab(id_ordenTrabajo).then(function(result){
				// LLENAMOS PRIMER TAB				
				$scope.idTblMovilOT = result[0].id;
				$scope.idGeneralOt = result[0].idGeneral;
				// TRAEMOS LOS DATOS DE DETALLE CON EL ID MOVIL OT CAB
				$scope.gettbl_Movil_OT_Det($scope.idTblMovilOT);	
				$scope.gettbl_Movil_OT_Foto($scope.idTblMovilOT);				
				$scope.paramsTab1 = {
					id_ordenTrabajo : result[0].id_ordenTrabajo,
					fechaRegistro_OTC : result[0].fechaRegistro_OTC,
					direccion_OTC : result[0].direccion_OTC,
					suministro_OTC : result[0].suministro_OTC,
					nomreCliente_OTC : result[0].nomreCliente_OTC,
					dniCliente_OTC : result[0].dniCliente_OTC,
					obs_OTC : result[0].obs_OTC,
					id_ejecutado_OTC : result[0].id_ejecutado_OTC,
					id_motivo_OTC : result[0].id_motivo_OTC,
					hora_OTC : result[0].hora_OTC,
					minuto_OTC : result[0].minuto_OTC,
					subEstacion_OTC : result[0].subEstacion_OTC,
					nro_Inspeccion_OTC : result[0].nro_Inspeccion_OTC
				};
				// ID DE SELECT MODAL
				$scope.idEjecutadaFilter = $scope.paramsTab1.id_ejecutado_OTC;
				$scope.idPorFilter = $scope.paramsTab1.id_motivo_OTC;
				//
				// LLENAMOS SEGUNDO TAB
				$scope.paramsTab2 = {
					nro_MedidorRet_OTC : result[0].nro_MedidorRet_OTC,
					marca_MedidorRet_OTC : result[0].marca_MedidorRet_OTC,
					modelo_MedidorRet_OTC : result[0].modelo_MedidorRet_OTC,
					fase_MedidorRet_OTC : result[0].fase_MedidorRet_OTC,
					estado_MedidorRet_OTC : result[0].estado_MedidorRet_OTC,
					nro_MedidorIns_OTC : result[0].nro_MedidorIns_OTC,
					marca_MedidorIns_OTC : result[0].marca_MedidorIns_OTC,
					modelo_MedidorIns_OTC : result[0].modelo_MedidorIns_OTC,
					fase_MedidorIns_OTC : result[0].fase_MedidorIns_OTC,
					estado_MedidorIns_OTC : result[0].estado_MedidorIns_OTC,
					id_ordenTrabajo : result[0].id_ordenTrabajo
				}
				// ID DE SELECT MODAL
				$scope.idMarcaRet = $scope.paramsTab2.marca_MedidorRet_OTC;
				$scope.idModRet = $scope.paramsTab2.modelo_MedidorRet_OTC;
				$scope.idMarcaIns = $scope.paramsTab2.marca_MedidorIns_OTC;
				$scope.nomMarcaIns = $scope.paramsTab2.marca_MedidorIns_OTC;
				$scope.idModIns = $scope.paramsTab2.modelo_MedidorIns_OTC;
				$scope.nomModIns = $scope.paramsTab2.modelo_MedidorIns_OTC;
				//
				
				$scope.paramsTab3.selloBor1_OTC = result[0].selloBor1_OTC;
				$scope.paramsTab3.selloBor2_OTC = result[0].selloBor2_OTC;
				$scope.paramsTab3.aledanio1_OTC = result[0].aledanio1_OTC;
				$scope.paramsTab3.aledanio2_OTC = result[0].aledanio2_OTC;
				$scope.paramsTab3.id_ordenTrabajo = result[0].id_ordenTrabajo;
				$scope.paramsTab3.notificacion_OTC = result[0].notificacion_OTC;
				$scope.paramsTab3.chip = result[0].chip;
				$scope.paramsTab3.variomod = result[0].variomod;
				$scope.paramsTab3.factor = result[0].factor;
				$scope.paramsTab3.potencia = result[0].potencia;
				$scope.paramsTab3.anio = result[0].anio;
				$scope.paramsTab3.ejecutivo = result[0].ejecutivo;
				$scope.paramsTab3.trabajo_solicitado = result[0].trabajo_solicitado;
				$scope.paramsTab3.trabajo_reportado = result[0].trabajo_reportado;

				$scope.listGrupoTabla.forEach(function(item,index){
						//EJECUTADA
					if (item.id_GrupoDetalle == $scope.paramsTab1.id_ejecutado_OTC) {
						$scope.nomEjecutada = item.descripcion_GrupoDetalle;
					}	// MOTIVO POR
					else if (item.id_GrupoDetalle == $scope.paramsTab1.id_motivo_OTC){
						$scope.nomPor = item.descripcion_GrupoDetalle;
					}	// MARCA RETIRADO
					else if (item.id_GrupoDetalle == $scope.paramsTab2.marca_MedidorRet_OTC){
						$scope.nomMarcaRet = item.descripcion_GrupoDetalle;
					}	// MODELO RETIRADO
					else if (item.id_GrupoDetalle == $scope.paramsTab2.modelo_MedidorRet_OTC){
						$scope.nomModRet = item.descripcion_GrupoDetalle;
					}	// MARCA INSTALADO
					else if (item.id_GrupoDetalle == $scope.paramsTab2.marca_MedidorIns_OTC){
					//	$scope.nomMarcaIns = item.descripcion_GrupoDetalle;
					}	// MODELO INSTALADO
					else if (item.id_GrupoDetalle == $scope.paramsTab2.modelo_MedidorIns_OTC) {
						//$scope.nomModIns = item.descripcion_GrupoDetalle;
					}

				})
			});
		}else{
			// NUEVO			
			$scope.paramsTab1.suministro_OTC = parseInt($scope.listDetail.suministro_OT);
			$scope.paramsTab1.dniCliente_OTC = parseInt($scope.listDetail.dniCliente_OT);
			$scope.paramsTab1.nomreCliente_OTC = $scope.listDetail.nomreCliente_OT;			
		};


	}
	// ID PRINCIPAL DE MOVIL OT CAB SE ENCUENTRA EN ESTE SCOPE $scope.idTblMovilOT.
	// TAB BAREMOS	
	$scope.paramsFilter = {		
		cod_baremos : '',
		cod_material : '',
		des_baremos : '',
		des_material : '',
		cant_baremos : '',
		cant_material : '',
		id_baremos : 0,
		id_material : 0
	}	
	$scope.searchBaremos = function(){				
		sqliteServices.getTbl_BaremosById($scope.paramsFilter.cod_baremos).then(function(result){			
			if (result.length == 0) {
				var txtCodBaremos = document.getElementById('txtCodBaremos');				
				var alert = popupServices.alertPop('Error','No se encontro codigo de baremo ingresado.');
				alert.then(function(){
					$timeout(function(){
						txtCodBaremos.focus();
					},500)					
				})
				$scope.paramsFilter.des_baremos = "";		
				$scope.paramsFilter.cant_baremos = "";		
			}else{
				if (result[0].flag_Medidor != null && result[0].flag_Medidor == "MedidorFlagA") {					
					if ($scope.nomMarcaIns == null) {
						popupServices.alertPop('Error ! ' , 'Es necesario ingresar un Medidor para continuar.');
						return;
					}
				}	
				$scope.paramsFilter.id_baremos = result[0].id_baremo;
				$scope.paramsFilter.des_baremos = result[0].abreviatura_baremo;

				var txtCantBaremos = document.getElementById('txtCantBaremos');
				$timeout(function(){
						txtCantBaremos.focus();	
				},500)

			}
		},function(err){
			console.log(err)	
		});
	}

	$scope.listMovilOtDet = [];
	$scope.saveMovilOtDet = function(tipReg,tipMat){
		$scope.showLoadMovilDet = true;	
		if ($scope.nameButton == "UPD") {
			$scope.executeUpdateMovilOt(tipReg);						
			return;
		}
		$scope.paramsBaremo = {
			id_Registro : $scope.idTblMovilOT,
			tipoRegistro : tipReg,
			tipoMaterial : tipMat,
			id_Codigo : tipReg == 1 ? $scope.paramsFilter.id_baremos : $scope.paramsFilter.id_material,
			cantidad : tipReg == 1 ? $scope.paramsFilter.cant_baremos : $scope.paramsFilter.cant_material,
			fechaRegistroMovil : plantillaA1Services.getDateHoy(),
			des_material : tipReg == 1 ? $scope.paramsFilter.des_baremos : $scope.paramsFilter.des_material,
			idGeneral : $scope.idGeneralOt,
			codigo : tipReg == 1 ? $scope.paramsFilter.cod_baremos : $scope.paramsFilter.cod_material
		}

		if ($scope.paramsBaremo.cantidad == "") {
			popupServices.alertPop('Error','No ha ingresado una cantidad.');
			$scope.showLoadMovilDet = false;
			return;
		};
		var functValidarCodigoExist = function(){
			// VALIDACIÓN - NO AGREGAR EL MISMO CODIGO DE BAREMO
			var valid = false;
			$scope.listMovilOtDet.forEach(function(item,index){					
				if (item.id_Codigo == $scope.paramsBaremo.id_Codigo && item.tipoRegistro == $scope.paramsBaremo.tipoRegistro) {
					valid = true;
					return;
				}
			})
			return valid;
		}	
		// SI CODIGO YA SE ENCUENTRA REGISTRADO
		if (functValidarCodigoExist()) {
			$scope.showLoadMovilDet = false;
			var text = tipReg == 1 ? 'baremos' : 'material';
			var alertok = popupServices.alertPop('Error','Codigo de ' + text + ' ingresado ya se encuentra registrado.');
			var txtCantBaremos = document.getElementById('txtCodBaremos');
			alertok.then(function(){
				$timeout(function(){
					$scope.paramsFilter.cant_baremos = "";
					$scope.paramsFilter.cant_material = "";
					txtCantBaremos.focus();	
				},500)	
			})
			return;
		}	

		plantillaA1Services.savetbl_Movil_OT_Det($scope.paramsBaremo).then(function(result){
			$timeout(function(){
				$scope.showLoadMovilDet = false;
				$scope.listMovilOtDet.push({
					cantidad : $scope.paramsBaremo.cantidad,
					des_material : $scope.paramsBaremo.des_material,
					fechaRegistroMovil : $scope.paramsBaremo.fechaRegistroMovil,
					id : result.insertId,
					id_Codigo : $scope.paramsBaremo.id_Codigo,
					id_Registro : $scope.paramsBaremo.id_Registro,
					tipoMaterial : $scope.paramsBaremo.tipoMaterial,
					tipoRegistro : $scope.paramsBaremo.tipoRegistro,
					codigo : $scope.paramsBaremo.codigo
				});				
				$scope.paramsFilter.cod_baremos = "";				
				$scope.paramsFilter.des_baremos = "";		
				$scope.paramsFilter.cant_baremos = "";	
				$scope.paramsFilter.cod_material = ""
				$scope.paramsFilter.des_material = "";		
				$scope.paramsFilter.cant_material = "";					
			},1300)
		},function(err){
			console.log(err)
		})
	}
	$scope.gettbl_Movil_OT_Det = function(id){
		plantillaA1Services.gettbl_Movil_OT_Det(id).then(function(result){			
			$scope.listMovilOtDet = result;			
		},function(err){
			console.log(err);
		})
	}

	// TAB MATERIALES

	$scope.searchMateriales = function(){
		sqliteServices.getTbl_MaterialesById($scope.paramsFilter.cod_material).then(function(result){			
			if (result.length == 0) {
				var txtCodMaterial = document.getElementById('txtCodMaterial');
				var alert = popupServices.alertPop('Error','No se encontro codigo del material ingresado.');
				alert.then(function(){
					$timeout(function(){
						txtCodMaterial.focus();
					},500)					
				})
				$scope.paramsFilter.des_material = "";	
				$scope.paramsFilter.cant_material = "";
			}else{								
				$scope.paramsFilter.id_material = result[0].id_material;
				$scope.paramsFilter.des_material = result[0].abreviatura_material;
				var txtCantMaterial = document.getElementById('txtCantMaterial');
				$timeout(function(){
						txtCantMaterial.focus();	
				},500)

			}
		},function(err){
			console.log(err)	
		});
	}	

	// ACTION SHIELD
	$scope.showOptions = function(item) {		
	   // Show the action sheet

	   var hideSheet = $ionicActionSheet.show({
	     buttons: [
	       { text: '<b>Editar</b>' },	       
	     ],
	     destructiveText: '<b>Eliminar</b>',
	     titleText: 'Opciones',
	     cancelText: 'Cancel',
	     cancel: function() {
	          // add cancel code..
	        },
	     buttonClicked: function(index) {
	     	$scope.editarMovilOtDet(item);
	     	$scope.nameButton = "UPD";
	       	return true;
	     },
	     destructiveButtonClicked : function(){
	     	$scope.deleteMovilOtDet(item);
	     	return true;
	     }
	   });

	   // For example's sake, hide the sheet after two seconds
	   $timeout(function() {
	     hideSheet();
	   }, 2000);

	 };	

	 $scope.paramsUpdateMovOt = {
	 	cantidad : '',
	 	id : ''
	 }
	 $scope.executeUpdateMovilOt = function(tip){
	 	if (tip == 1) {
	 		$scope.paramsUpdateMovOt.cantidad = $scope.paramsFilter.cant_baremos;
	 	}else{
	 		$scope.paramsUpdateMovOt.cantidad = $scope.paramsFilter.cant_material;
	 	}
	 	plantillaA1Services.updatetbl_Movil_OT_Det($scope.paramsUpdateMovOt).then(function(res){
	 		$timeout(function(){
	 			$scope.listMovilOtDet.forEach(function(item,index){	 				
	 				if (item.id == $scope.paramsUpdateMovOt.id) {
	 					item.cantidad = $scope.paramsUpdateMovOt.cantidad;
	 					$scope.paramsFilter.cod_baremos = "";				
						$scope.paramsFilter.des_baremos = "";		
						$scope.paramsFilter.cant_baremos = "";	
						$scope.paramsFilter.cod_material = ""
						$scope.paramsFilter.des_material = "";		
						$scope.paramsFilter.cant_material = "";		
	 				}
	 			})	 			
	 			$scope.nameButton = "ADD";
	 			$scope.showLoadMovilDet = false;
	 		},1200)
	 		
	 	},function(err){
	 		console.log(err);
	 	})
	 }
	 $scope.editarMovilOtDet = function(item){	 	
	 	if (item.tipoRegistro == 1) {
	 		//BAREMO	 		
	 		$scope.paramsUpdateMovOt.id = item.id;	 	
	 		$scope.paramsFilter.cod_baremos = item.codigo;	 		
	 		$scope.paramsFilter.cant_baremos = item.cantidad;
	 		$scope.paramsFilter.des_baremos = item.des_material;
	 	}else{
	 		//MATERIALES
			$scope.paramsUpdateMovOt.id = item.id;	 		
	 		$scope.paramsFilter.cod_material = item.codigo;	 		
	 		$scope.paramsFilter.cant_material = item.cantidad;
	 		$scope.paramsFilter.des_material = item.des_material;
	 	}
	 }
	 $scope.deleteMovilOtDet = function(item){
	 	$scope.showLoadMovilDet = true;
	 	plantillaA1Services.deleteTbl_Movil_Ot_DetById(item.id).then(function(result){
	 		$timeout(function(){
	 			var index = $scope.listMovilOtDet.indexOf(item);
	 			$scope.listMovilOtDet.splice(index,1)	 			
	 			$scope.showLoadMovilDet = false;
	 		},1300)
	 	},function(err){
	 		$scope.showLoadMovilDet = false;
	 		console.log(err);
	 	})
	 }

	 // MODAL BUSQUEDA DE BAREMOS Y MATERIALES
   	$ionicModal.fromTemplateUrl('my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	$scope.openModal = function(tip) {		
		$scope.titleModal = tip == 1 ? "Baremos" : "Materiales";
		$scope.parametersSearch.des = "";
		$scope.listDetalleOt(tip,1)
	    $scope.modal.show();

	};
	$scope.closeModal = function() {
	    $scope.modal.hide();
	    $scope.showListModal = false;
	};
	$scope.parametersSearch = {
		des : ''
	}
	$scope.listDetalleModal = [];
	$scope.hasMoreData = false;
	var cant = 0;	
	$scope.listDetalleOt = function(tip,con){
		$scope.showListModal = false;
		if (con == 2) {
			tip = $scope.titleModal == "Baremos" ? 1 : 0;
		}
		console.log(tip)	
		$scope.showLoaderModal = true;
		if (tip == 1) {			
			sqliteServices.getTbl_BaremosModal($scope.parametersSearch.des).then(function(res){
				if (res.length == 0) {$scope.hasMoreData = false;$scope.showLoaderModal = false; return;};	
				$scope.listDetalleModal = res;				
				cant = res[res.length - 1].id;				
				$timeout(function(){
					$scope.showListModal = true;				
					$scope.showLoaderModal = false;
					$scope.hasMoreData = true;
				},1200)				
			},function(err){
				console.log(err);
			});
		}else{
			sqliteServices.getTbl_MaterialesModal($scope.parametersSearch.des).then(function(res){			
				if (res.length == 0) {$scope.hasMoreData = false;$scope.showLoaderModal = false; return;};
				$scope.listDetalleModal = res;
				cant = res[res.length - 1].id;
				$timeout(function(){
					$scope.showListModal = true;				
					$scope.showLoaderModal = false;
					$scope.hasMoreData = true;
				},1200)
				
			})				
		}
		
	}

	$scope.moreListDetalleOt = function(){		
		if ($scope.titleModal == "Baremos") {
			sqliteServices.getTbl_BaremosModalCount(cant).then(function(res){			
	            if (res.length == 0) {$scope.hasMoreData = false; return;};	            
				res.forEach(function(item,index){
					$scope.listDetalleModal.push(item);
				});
				cant = res[res.length - 1].id;				
				$scope.$broadcast('scroll.infiniteScrollComplete'); 
			},function(err){
				console.log(err);
			})
		}else{
			sqliteServices.getTbl_MaterialesModalCount(cant).then(function(res){			
	            if (res.length == 0) {$scope.hasMoreData = false; return;};
	            
				res.forEach(function(item,index){
					$scope.listDetalleModal.push(item);
				});
				cant = res[res.length - 1].id;				
				$scope.$broadcast('scroll.infiniteScrollComplete'); 
			},function(err){
				console.log(err);
			})			
		}

	}
	$scope.getDataBarMat = function(item){
		console.log($scope.paramsTab2.nomMarcaIns)
		if (item.flagM != null && item.flagM == "MedidorFlagA") {			
			if ($scope.nomMarcaIns == null) {
				popupServices.alertPop('Error ! ' , 'Es necesario ingresar un Medidor para continuar.');
				return;
			}			
		}		
		if ($scope.titleModal == "Baremos") {
			$scope.paramsFilter.cod_baremos = item.cod;
			$scope.paramsFilter.id_baremos = item.id;
			$scope.paramsFilter.des_baremos = item.des;
		}else if ($scope.titleModal == "Materiales"){
			$scope.paramsFilter.cod_material = item.cod;
			$scope.paramsFilter.id_material = item.id;
			$scope.paramsFilter.des_material = item.des;
		}
		$scope.closeModal();
	}

	// TAB FOTOS

	$scope.listFotos = [];
	$scope.gettbl_Movil_OT_Foto = function(idReg){
		plantillaA1Services.gettbl_Movil_OT_Foto(idReg).then(function(res){
			$scope.listFotos = res;			
		})		
	}
	$scope.paramsFoto = {coment : ''};
	$scope.takePhoto = function(tipo){
		console.log(tipo)
		ServicesPhoto.callCamera(tipo).then(function(resCam){
			// ALGORITMO PARA GENERAR EL CORRELATIVO DE FOTOS TOMADAS
			var nroFoto = 0;
			var cant = $scope.listFotos.length;
			if (cant == 0) {
				nroFoto = 1;
			}else{
				nroFoto = $scope.listFotos[cant - 1].nombre_FotoDet.replace('.jpg','').split('_');
				nroFoto = parseInt(nroFoto[2]) + 1;
			}
			//
			var coment = $scope.paramsFoto.coment;
			$scope.showLoaderFoto = true;
			var uri = "data:image/jpeg;base64," + resCam;
			var nameFoto = String($scope.listDetail.id_ordenTrabajo) + '_' + plantillaA1Services.getDateHoyCod() + '_' + nroFoto + '.jpg';
			ServicesPhoto.savePhotoFolder(uri,nameFoto).then(function(resFolder){			
				var paramsSaveFoto = {
					id_Registro : $scope.idTblMovilOT,
					nombre_FotoDet : nameFoto,
					obs_FotoDet : coment,
					url_FotoDet : resFolder.nativeURL,
					fechaRegistroMovil_FotoDet : plantillaA1Services.getDateHoy(),
					idGeneral : $scope.idGeneralOt
				}
				plantillaA1Services.savetbl_Movil_OT_Foto(paramsSaveFoto).then(function(res){
					$timeout(function(){
						$scope.showLoaderFoto = false;
						$scope.listFotos.push({
							id_Registro : paramsSaveFoto.id_Registro,
							nombre_FotoDet : paramsSaveFoto.nombre_FotoDet,
							obs_FotoDet : coment,
							url_FotoDet : paramsSaveFoto.url_FotoDet,
							fechaRegistroMovil_FotoDet : paramsSaveFoto.fechaRegistroMovil,
							idGeneral : paramsSaveFoto.idGeneral
						});
						$scope.paramsFoto = {coment : ''};
					},1200)

				},function(err){
					console.log(err)
				})				
			},function(err){
				alert(JSON.stringify(err));
			})
		},function(err){
			alert(JSON.stringify(err));
		})
	};
	$scope.deletePhoto = function(item){
		var title = "Mensaje de Confirmación";
		var template = "Esta apunto de eliminar una foto , desea continuar ?";
		popupServices.confirmPop(title,template).then(function(res){
			if (res) {
				$scope.showLoaderFoto = true;				
				ServicesPhoto.deletePhotoFolder(item.nombre_FotoDet).then(function(resDel){
					plantillaA1Services.deleteTbl_Movil_Ot_FotoByName(item.nombre_FotoDet).then(function(resSql){						
						$timeout(function(){
							$scope.showLoaderFoto = false;							
							$scope.gettbl_Movil_OT_Foto($scope.idTblMovilOT);
						},1200)				

					},function(err){
						alert(err.message)
					})

				},function(err){
					alert(JSON.stringify(err));
				})				
			}
		})
	};
	$scope.zoomMin = 1;
	$scope.showImages = function(index) {		
	    $scope.activeSlide = index;
	    $scope.showModal('templates/ZoomImage/adm-galleryzoom.html');
	};
	$scope.showImagesVisto = function(index) {
	    $scope.activeSlide = index;
	    $scope.showModal('templates/ZoomImage/adm-galleryzoomFirma.html');
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
	   
	$scope.updateSlideStatus = function(slide) {
	    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
	    if (zoomFactor == $scope.zoomMin) {
	      $ionicSlideBoxDelegate.enableSlide(true);
	    } else {
	      $ionicSlideBoxDelegate.enableSlide(false);
	    }
	};
	var alertMedidor;
	$scope.modalSelectMedidor = function(){
		var cabecera = "Seleccionar Nro de Medidor";
		var template = '<div class="bar bar-header item-input-inset" style="position: absolute;top: 10px;    padding-top: 20px;">' +
            		   '<label class="item-input-wrapper" style="background-color: white;">' +
              		   '<i class="icon ion-ios-search placeholder-icon"></i>' +
              		   '<input type="search" ng-model="searchMedidor" placeholder="Busqueda . ."></label>' +
            		   '</div>' +
					   '<div class="modalStyle" style="max-height: 400px;    padding-top: 10px;">' +
					   '<div ng-repeat="item in listMedidor | filter : searchMedidor" class="card-panel grey lighten-5 z-depth-1 cardP  {{item.claseA}}" >' +
          			   '<div class="row valign-wrapper contentPlantilla" ng-click="selectMedidor(item);">' +
            		   '<div class="col s4 m2 colP">' +
                       '<a href=""><i class="small material-icons" style="font-size:20px !important"></i></a>' +
            		   '</div><div class="col s8 m10"><span class="black-text">{{item.numero_Medidor}}</span>' +
            		   '</div></div></div></div>';

		alertMedidor = popupServices.alertPop(cabecera,template,'',$scope);
	}
	var idMedidorAux;

	$scope.selectMedidor = function(item){
		idMedidorAux = item.id;
		alertMedidor.close();		
		$scope.nomMarcaIns = item.marca_Medidor
		$scope.idMarcaIns = item.marca_Medidor
  		$scope.nomModIns = item.modelo_Medidor;
  		$scope.idModIns = item.modelo_Medidor;
		$scope.paramsTab2.nro_MedidorIns_OTC = parseInt(item.numero_Medidor);
	}
	$scope.searchMedidorPop = function(){
		var parameters = JSON.parse(localStorage.getItem('parameters'));
		sqliteServices.getTbl_Medidor(parameters.id_cliente,parameters.id_cuadrilla)
		.then(function(result){			
			result.forEach(function(item,index){
				if (item.estado == 13) {
					item['claseA'] = "disabledMedidor";
				}else{
					item['claseA'] = "";
				}
			})
			$scope.listMedidor = result;			
			$scope.modalSelectMedidor();
		},function(err){
			console.log(err);
		})
	};
	$scope.searchMedidorByNumber = function(){
		var parameters = JSON.parse(localStorage.getItem('parameters'));
		var nroMedidor = String($scope.paramsTab2.nro_MedidorIns_OTC);
		sqliteServices.getTbl_MedidorByNumber(parameters.id_cliente,parameters.id_cuadrilla,nroMedidor)
		.then(function(result){
			if (result.length == 0) {
				var alertPop = popupServices.alertPop('Alerta','Nro ingresado no es existe.');
				$scope.nomMarcaIns = "";
				$scope.idMarcaIns = "";
				$scope.nomModIns = "";
				$scope.idModIns = "";				
				return;				
			}
			if (result[0].estado == 13) {
				var alertPop = popupServices.alertPop('Alerta','Este nro de Medidor ya se encuentra Liquidado');
				$scope.nomMarcaIns = "";
				$scope.idMarcaIns = "";
				$scope.nomModIns = "";
				$scope.idModIns = "";				
				return;
			}			
			$scope.nomMarcaIns = result[0].marca_Medidor
			$scope.idMarcaIns = result[0].marca_Medidor
  			$scope.nomModIns = result[0].modelo_Medidor;
  			$scope.idModIns = result[0].modelo_Medidor;  			
  			idMedidorAux = result[0].id;
		/*	return;
			$scope.listGrupoTabla.forEach(function(item,index){				
				if (item.descripcion_GrupoDetalle == result[0].marca_Medidor) {
					$scope.nomMarcaIns = item.descripcion_GrupoDetalle;
  					$scope.idMarcaIns = item.id_GrupoDetalle;
				};
				if (item.descripcion_GrupoDetalle == result[0].modelo_Medidor) {
  					$scope.nomModIns = item.descripcion_GrupoDetalle;
  					$scope.idModIns = item.id_GrupoDetalle;
				};
			})*/
		//	console.log($scope.listGrupoTabla);
		//	console.log(result);
		},function(err){
			console.log(err);
		});		
	}
	$scope.goHome = function(){
		$state.go('menu.home');
	};

})