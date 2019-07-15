angular.module('app.envioPendientesServices', [])

.factory('envioPendientesServices',function($http,$q,plantillaA1Services,getDataSincro,sqliteServices,ServicesPhoto,$timeout){

	var Result = {};

	Result.sendAllDataToServidor = function(){
		var q = $q.defer();
		// TRAEMOS DATOS CABECERA MOVIL OT 
		localStorage.removeItem('dataSuministro');
		localStorage.removeItem('dataSumAnterior');
		localStorage.removeItem('dataSuministro2');
		localStorage.removeItem('dataSumAnterior2');
		localStorage.removeItem('dataSuministro3');
		localStorage.removeItem('dataSumAnterior3');	
		localStorage.removeItem('dataSuministro4');
		localStorage.removeItem('dataSumAnterior4');	
		//Result.sendTblSuministroBack();		
		
		Result.sendTBLRegistros().then(function(lstObjMovOtCab){
			if (lstObjMovOtCab == 'nodata') {
				q.resolve('nodata');
				return;
			}
			Result.sendTBL_ReporteDiario().then(function(res){
				Result.sendTBL_ReporteDiario_Fotos().then(function(){
				sqliteServices.deleteTbl_Registros();
					q.resolve('success');
				},function(err){
					q.reject(err);
				})
			},function(err){
				q.reject(err);
			})
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}

	Result.sendAllDataToServidor2 = function(){
		var q = $q.defer();
		// TRAEMOS DATOS CABECERA MOVIL OT 			
		Result.sendTBLRegistros2().then(function(lstObjMovOtCab){
			if (lstObjMovOtCab == 'nodata') {
				q.resolve('nodata');
				return;
			}
			Result.sendTBL_ReporteDiario().then(function(res){
				Result.sendTBL_ReporteDiario_Fotos().then(function(){
				sqliteServices.deleteTbl_Registros();
					q.resolve('success');
				},function(err){
					q.reject(err);
				})
			},function(err){
				q.reject(err);
			})
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}	
	Result.sendAllDataToServidor_Back = function(){
		var q = $q.defer();
		// TRAEMOS DATOS CABECERA MOVIL OT 
		//Result.sendTblSuministroBack();	
		Result.sendTBLRegistros_Back().then(function(lstObjMovOtCab){
			if (lstObjMovOtCab == 'nodata') {
				q.resolve('nodata');
				return;
			}			
			//sqliteServices.deleteTbl_Registros();
			q.resolve('success');			
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}	
	Result.sendAllDataToServidorfotos = function(){
		var q = $q.defer();
		// TRAEMOS DATOS CABECERA MOVIL OT
		Result.sendTBLRegistros_FotosNew().then(function(res){			
			q.resolve(res);
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}

	Result.sendAllDataToServidorfotosInterno = function(){
		var q = $q.defer();
		// TRAEMOS DATOS CABECERA MOVIL OT
		Result.sendTBLRegistros_FotosInterno().then(function(res){			
			q.resolve(res);
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}	
	Result.sendAllDataToServidorfotos_back = function(){		
		var q = $q.defer();
		// TRAEMOS DATOS CABECERA MOVIL OT
		Result.sendTBLRegistros_Fotos_back().then(function(res){			
			q.resolve(res);
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}	

	Result.sendTBLRegistros = function(){
		var q = $q.defer();
		sqliteServices.getTbl_Registros_Total().then(function(res){		
			if (res == 0) {
				q.resolve('nodata')
				return;
			}
			var dataUser = localStorage.getItem('dataUser');
			dataUser = JSON.parse(dataUser);			
			sqliteServices.getTbl_Registros().then(function(result){
				getDataSincro.saveTBLRegistros(result,dataUser.ID_Operario).then(function(ress){					
					sqliteServices.deleteTbl_Registros();
					sqliteServices.deleteTbl_SuministrosByEstado();
					q.resolve(ress);
				},function(err){
					q.reject(err);
				})
			})
		})
		return q.promise;
	}
	Result.sendTblSuministroBack = function(){
		var q = $q.defer();
		sqliteServices.getTbl_Suministros_Back().then(function(res){					
			if (res.length == 0) {
				q.resolve('nodata')
				return;
			}						
			getDataSincro.saveTblSuministroBack(res).then(function(ress){					
				//sqliteServices.deleteTbl_Registros();
				//sqliteServices.deleteTbl_SuministrosByEstado();
				q.resolve(ress);
			},function(err){
				q.reject(err);
			})
			
		})
		return q.promise;
	}	
	Result.sendTBLRegistros2 = function(){
		var q = $q.defer();
		sqliteServices.getTbl_Registros_Total().then(function(res){		
			if (res == 0) {
				q.resolve('nodata')
				return;
			}
			var dataUser = localStorage.getItem('dataUser');
			dataUser = JSON.parse(dataUser);			
			sqliteServices.getTbl_Registros().then(function(result){
				getDataSincro.saveTBLRegistros(result,dataUser.ID_Operario).then(function(ress){					
					sqliteServices.deleteTbl_Registros();
					//sqliteServices.deleteTbl_SuministrosByEstado();
					q.resolve(ress);
				},function(err){
					q.reject(err);
				})
			})
		})
		return q.promise;
	}	
	Result.sendTBLRegistros_Back = function(){
		var q = $q.defer();
		sqliteServices.getTbl_Registros_Total_Back().then(function(res){		
			if (res == 0) {
				q.resolve('nodata')
				return;
			}
			var dataUser = localStorage.getItem('dataUser');
			dataUser = JSON.parse(dataUser);			
			sqliteServices.getTbl_Registros_back().then(function(result){
				getDataSincro.saveTBLRegistros(result,dataUser.ID_Operario).then(function(ress){
					//sqliteServices.deleteTbl_Registros();
					q.resolve(ress);
				},function(err){
					q.reject(err);
				})
			});
		})
		return q.promise;
	}
	var txtFotoLoad,countAux;
	var flag_prioridad  = null;

	function doSomething(total,item){		
		var q = $q.defer();				
		ServicesPhoto.transferPhoto(item.RutaFoto,item.urlFoto,item.ID_General,item.flag_prioridad).then(function(res){
			//ServicesPhoto.deletePhotoFolder(item.RutaFoto).then(function(resDelete){
				q.resolve(res);
				countAux++;
				txtFotoLoad.innerText = 'Enviando ' + countAux + ' de ' + total;				
			/*},function(err){
				q.reject(err);
			})*/
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}
	function doSomethingInterno(total,item){
		var q = $q.defer();				
		ServicesPhoto.transferPhoto(item.RutaFoto,item.urlFoto,item.ID_General,item.flag_prioridad).then(function(res){
			//ServicesPhoto.deletePhotoFolder(item.RutaFoto).then(function(resDelete){
				q.resolve(res);			
			/*},function(err){
				q.reject(err);
			})*/
		},function(err){
			
			
			q.reject(err);
		})
		return q.promise;
	}	
	function doSomethingBack(total,item){
		var q = $q.defer();				
		ServicesPhoto.transferPhoto_Back(item.RutaFoto,item.urlFoto,item.ID_General,item.flag_prioridad).then(function(res){
			//ServicesPhoto.deletePhotoFolder(item.RutaFoto).then(function(resDelete){
				q.resolve(res);
				countAux++;
				txtFotoLoad.innerText = 'Enviando ' + countAux + ' de ' + total;				
			//},function(err){
			//	q.reject(err);
			//})
		},function(err){			
			q.reject(err);
		})
		return q.promise;
	}			
	Result.sendTBLRegistros_FotosNew = function(){		
		var q = $q.defer();
		$timeout(function(){
		txtFotoLoad = document.getElementById('txtFoto');
		countAux = 0;		
		});
		sqliteServices.getTbl_Registros_Fotos().then(function(res){
			if (res.length == 0) {
					q.resolve('nodata')
					return;
			};
			txtFotoLoad.innerText = 'Enviando 0 de ' + res.length;			
			res.reduce(function(p, val) {
				return p.then(function() {
					return doSomething(res.length,val);
				});
			}, $q.when(true)).then(function(finalResult) {
				q.resolve('success');
			}, function(err) {
				q.reject(err);
			});
		},function(err){
			q.reject(err);
		})			
	

		return q.promise;
	}

		Result.sendTBLRegistros_FotosInterno = function(){		
		var q = $q.defer();
		sqliteServices.getTbl_Registros_Fotos().then(function(res){
			if (res.length == 0) {
					q.resolve('nodata')
					return;
			};			
			res.reduce(function(p, val) {
				return p.then(function() {
					return doSomethingInterno(res.length,val);
				});
			}, $q.when(true)).then(function(finalResult) {
				q.resolve('success');
			}, function(err) {
				q.reject(err);
			});
		},function(err){
			q.reject(err);
		})			
	

		return q.promise;
	}

	Result.sendTBLRegistros_Fotos_back = function(){
		var q = $q.defer();
		$timeout(function(){
		txtFotoLoad = document.getElementById('txtFoto');
		countAux = 0;		
		});
		sqliteServices.getTbl_Registros_Fotos_back().then(function(res){
			if (res.length == 0) {
					q.resolve('nodata')
					return;
			};
			txtFotoLoad.innerText = 'Enviando 0 de ' + res.length;			
			res.reduce(function(p, val) {
				return p.then(function() {
					return doSomethingBack(res.length,val);
				});
			}, $q.when(true)).then(function(finalResult) {
				q.resolve('success');
			}, function(err) {
				q.reject(err);
			});
		},function(err){
			q.reject(err);
		});
		return q.promise;		
	}	
	Result.sendTBL_ReporteDiario = function(){
		var q = $q.defer();
		sqliteServices.getTBL_ReporteDiario().then(function(res){
			
			if (res.length == 0) {
				q.resolve('success')
				return;
			}
			getDataSincro.saveTBLReporte_Diario(res).then(function(ress){
				sqliteServices.deleteTBL_ReporteDiario();
				q.resolve(ress);
			},function(err){
				q.reject(err);
			})
		})
		return q.promise;
	}
	Result.sendTBL_ReporteDiario_Fotos = function(){
		var q = $q.defer();
		sqliteServices.getTBL_ReporteDiario_Foto().then(function(res){			
			if (res.length == 0) {
				q.resolve('success')
				return;
			}
			getDataSincro.saveTBLReporte_Diario_Foto(res).then(function(ress){
				var listFotos = res;
				var cant = listFotos.length -1;				
				listFotos.forEach(function(item,index){
					ServicesPhoto.transferPhoto(item.fotourl,item.urlFoto).then(function(res){						
						ServicesPhoto.deletePhotoFolder(item.fotourl).then(function(resDelete){							
							if (cant == index) {
								sqliteServices.deleteTBL_ReporteDiario_Foto();
								q.resolve("success");
							}
							
						});
					},function(err){
						q.reject(err);
					});
				});						
			},function(err){
				q.reject(err);
			})
		})
		return q.promise;		
	}		
	return Result;

})