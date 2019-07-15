angular.module('app.sincroServices', [])

.factory('sincroServices', function($q,$ionicPopup,$http,sqliteServices,getDataSincro,UrlApi,loginServices,VersionAppR,loginServices){

	var Result = {};	
	Result.initSincro = function(ID_Operario,idDevice){
		var q = $q.defer();
		localStorage.removeItem('dataSuministro');
		localStorage.removeItem('dataSumAnterior');
		localStorage.removeItem('dataSuministro2');
		localStorage.removeItem('dataSumAnterior2');
		localStorage.removeItem('dataSuministro3');
		localStorage.removeItem('dataSumAnterior3');	
		localStorage.removeItem('dataSuministro4');
		localStorage.removeItem('dataSumAnterior4');						
		localStorage.removeItem('dataSuministro5');
		localStorage.removeItem('dataSumAnterior5');

		sqliteServices.limpiarTablas().then(function(){
			var dataUser = JSON.parse(localStorage.getItem('dataUser'));
			var params = {
				nomusu : dataUser.ID_Operario,
				passusu : dataUser.Operario_Contrasenia,
				tipo : 1,
				idDevice : idDevice,
				Version : VersionAppR
			};
			loginServices.logIn(params).then(function(result){})
			Result.sincroMovilOt(ID_Operario).then(function(result){
				Result.sincroSuministroRelectura(ID_Operario).then(function(){
					console.log('Sincronizción correcta ! 1');
					Result.sincroSuministroFoto(ID_Operario).then(function(res){
						console.log('Sincronizción correcta ! 2');
						Result.sincroDetalleGrupo().then(function(res){				
							console.log('Sincronizción correcta ! 3');
							Result.sincroTblParametros().then(function(res){
								console.log('Sincronizción correcta ! 4');
								Result.sincroTblTipoReporteDiario().then(function(res){
									console.log('Sincronizción correcta ! 5');
									q.resolve(res);
								},function(err){
									console.log(err);
									q.reject(err);
								})
							},function(err){
								console.log(err);
								q.reject(err);
							})				
						},function(err){
							console.log(err);
							q.reject(err);
						})
					},function(err){
						q.reject(err);
					})	
				},function(err){
					console.log(err);
					q.reject(err);					
				})		
			},function(err){
				console.log(err);
				q.reject(err);
			})
		})

		return q.promise;
	}
	Result.sincroMovilOt = function(ID_Operario){		
		var q = $q.defer();
		var params = { idOperario : ID_Operario , estado : 'A'};	
		console.log(params);
		getDataSincro.getSuministros(params)
		.then(function(result){		
			
			if (result.length == 0) {
				q.resolve('success');
				return;
			}
			
			sqliteServices.getValuesSavetbl_Suministros(result).then(function(res){				
				q.resolve('success');							
			},function(err){
				q.reject(err)
			})
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}
	Result.sincroSuministroRelectura = function(ID_Operario){		
		var q = $q.defer();
		var params = { idOperario : ID_Operario , estado : 'R'};	
		
		getDataSincro.getSuministros(params)
		.then(function(result){		
			
			if (result.length == 0) {
				q.resolve('success');
				return;
			}
			
			sqliteServices.getValuesSavetbl_Suministros_Relectura(ID_Operario,result).then(function(res){				
				q.resolve('success');							
			},function(err){
				q.reject(err)
			})
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}	
	Result.sincroSuministroFoto = function(ID_Operario){		
		var q = $q.defer();
		var params = { idOperario : ID_Operario};			
		getDataSincro.getSuministrosFoto(params)
		.then(function(result){					
			if (result.length == 0) {
				q.resolve('success');
				return;
			}			
			sqliteServices.getValuesSavetbl_Suministros_Foto(result).then(function(res){				
				q.resolve('success');							
			},function(err){
				q.reject(err)
			})
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}
	
	Result.sincroSuministroFotoInterno = function(ID_Operario){		
		var q = $q.defer();
		var params = { idOperario : ID_Operario};			
		getDataSincro.getSuministrosFoto(params)
		.then(function(result){					
			if (result.length == 0) {
				q.resolve('nodata');
				return;
			};			
			sqliteServices.getValuesSavetbl_Suministros_Foto_Interno(ID_Operario,result).then(function(res){				
				q.resolve('success');							
			},function(err){
				q.reject(err)
			})
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}

	Result.sincroDetalleGrupo = function(ID_Operario){		
		var q = $q.defer();		
		var params = {
			ids : '1,3,4'
		}
		getDataSincro.getDetalleGrupo(params)
		.then(function(result){
			console.log(result);
			sqliteServices.getValuesSaveTbl_Detalle_Grupo(result).then(function(res){				
				q.resolve('success');							
			},function(err){
				q.reject(err)
			})
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}

	Result.sincroTblParametros = function(){		
		var q = $q.defer();	
		getDataSincro.getTblParametros()
		.then(function(result){
			sqliteServices.savetbl_parametros(result).then(function(res){				
				q.resolve('success');							
			},function(err){
				q.reject(err)
			})
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}

	Result.sincroTblTipoReporteDiario = function(){		
		var q = $q.defer();	
		getDataSincro.getTblTipoReporteDiario()
		.then(function(result){
			sqliteServices.saveTbl_TipoReporteDiario(result).then(function(res){				
				q.resolve('success');							
			},function(err){
				q.reject(err)
			})
		},function(err){
			q.reject(err);
		})
		return q.promise;
	}			

	return Result;
})