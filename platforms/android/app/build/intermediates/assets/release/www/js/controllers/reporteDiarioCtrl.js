angular.module('app.reporteDiarioController', [])

.controller('reporteDiarioCtrl',function($scope,$timeout,$q,$state,envioPendientesServices,ServicesPhoto,popupServices,plantillaA1Services,$ionicModal,sqliteServices,gpsServices){
	var Operario_EnvioEn_Linea;
	$scope.initView = function(){
		$scope.showLoader = true;
		$scope.nomSelect = "";
		$scope.listFotos = [];
		var dataUser = JSON.parse(localStorage.getItem('dataUser'));
		var idOperario = dataUser.ID_Operario;
		Operario_EnvioEn_Linea = dataUser.Operario_EnvioEn_Linea;
		sqliteServices.getTbl_TipoReporteDiario().then(function(res){
			$scope.listModal = res;
		})
		$scope.paramsReporteDiarioCab = {
			id_TipoReporte : 0,
			id_TipoReporteDiario : 0,
			Obs_reporteDiario : '',
			latitud_reporteDiario : '',
			longitud_reporteDiario : '',
			id_Operario : idOperario,
			estado : 1,
			id_general : '',
		}
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
		$scope.paramsReporteDiarioCab.id_TipoReporte = item.id;
		$scope.paramsReporteDiarioCab.id_TipoReporteDiario = item.id;
		alertModal.close();
	}
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
	$scope.saveTblReporteDiario = function(){
		validaciones().then(function(res){
			$scope.showLoader = true;
			gpsServices.getCurrentPosition().then(function(res){
				$scope.paramsReporteDiarioCab.latitud_reporteDiario = res.lat;
				$scope.paramsReporteDiarioCab.longitud_reporteDiario = res.long;
				$scope.paramsReporteDiarioCab.id_general = plantillaA1Services.getCodUniq();
				sqliteServices.saveTBL_ReporteDiario($scope.paramsReporteDiarioCab).then(function(res){
					saveTBL_ReporteDiario_Foto($scope.paramsReporteDiarioCab.id_general).then(function(res){
						if (Operario_EnvioEn_Linea == 1) {
							envioPendientesServices.sendAllDataToServidor().then(function(res){
								$timeout(function(){
									var pop = popupServices.alertPop('Confirmación!' , "Registro realizado correctamente.");
									$scope.showLoader = false;
									pop.then(function(res){
										$scope.initView();
									})
								},1000)									
							})
						}else{
							$timeout(function(){
								var pop = popupServices.alertPop('Confirmación!' , "Registro realizado correctamente.");
								$scope.showLoader = false;
								pop.then(function(res){
									$scope.initView();
								})
							},1000)							
						}

					})

				},function(err){
					var template = "<div style='text-align:center;'>"+ "Ocurrio un problema, volver a intentar." +
				   		"<i style='color:#F44336;font-size: 23px;' class='icon ion-android-alert placeholder-icon'></i></div>";
					popupServices.alertPop('Alerta !' , template);
					$scope.showLoader = false;
					console.log(err);
				})			
			})
		},function(err){
			var template = "<div style='text-align:center;'>"+ err.message +
			   		"<i style='color:#F44336;font-size: 23px;' class='icon ion-android-alert placeholder-icon'></i></div>";
			popupServices.alertPop('Alerta !' , template);			
		})
	}
	var saveTBL_ReporteDiario_Foto = function(idGeneral){
		var q = $q.defer();
		
		var cantFoto = $scope.listFotos.length -1;
		$scope.listFotos.forEach(function(item,index){
			ServicesPhoto.savePhotoFolder(item.SrcUri,item.fotourl).then(function(resFolder){
				var params = [0,item.fotourl,idGeneral,resFolder.nativeURL];				
				sqliteServices.saveTBL_ReporteDiario_Foto(params).then(function(res){
					if (cantFoto == index) {
						q.resolve('success')
					}					
				},function(err){
					alert(JSON.stringify(err));
				})
			})
		})		
		return q.promise;
	}	
	var validaciones = function(){
		var q = $q.defer();		
		if ($scope.paramsReporteDiarioCab.id_TipoReporte == 0){
			q.reject({ res: false, message : 'Ingresar un tipo de Reporte !'});			
		}else if ($scope.listFotos.length == 0){
			q.reject({ res: false, message : 'Es necesario agregar al menos 1 foto !'});			
		}else{
			q.resolve({ res : true});
		}		
		return q.promise;
	}
	$scope.takePhoto = function(tipo){	
		if ($scope.listFotos.length == 2) {
			popupServices.alertPop('Alerta !' , "Ya ingreso la cantidad maxima de fotos.");
			return;
		}
		ServicesPhoto.callCamera(tipo).then(function(resCam){			
			// ALGORITMO PARA GENERAR EL CORRELATIVO DE FOTOS TOMADAS						
			var nroFoto = 0;
			var cant = $scope.listFotos.length;
			if (cant == 0) {
				nroFoto = 1;
			}else{
				nroFoto = $scope.listFotos[cant - 1].fotourl.replace('.jpg','').split('_');
				nroFoto = parseInt(nroFoto[1]) + 1;				
			}
			var uri = "data:image/jpeg;base64," + resCam;
			var nameFoto = String(plantillaA1Services.getDateHoyCod()) + '_' + nroFoto + '.jpg';			
			showCanvas(uri).then(function(resCanvasUri){
				$scope.listFotos.push({
					id_ReporteDiario : 0,
	      			fotourl : nameFoto,
	      			ID_General : '',
	      			SrcUri : resCanvasUri
				})
			});
		},function(err){
			alert(JSON.stringify(err));
		})
	};
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
	$scope.deleteFoto = function(item){
		popupServices.confirmPop("Confirmación","Eliminará esta fotografía , desea continuar ?").then(function(res){
			if (res) {				
				$scope.listFotos.splice($scope.listFotos.indexOf(item), 1);
			}
		})
	}	

})
