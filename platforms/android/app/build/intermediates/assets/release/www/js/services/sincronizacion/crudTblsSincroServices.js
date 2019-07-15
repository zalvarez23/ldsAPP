angular.module('app.getDataSincro', [])

.factory('getDataSincro' , function($q,$http,UrlApi,ServicesPhoto){	

	var Result  = {};

	Result.getSuministros = function(params){
		// params recibe el valos del estado		
		var q = $q.defer();
		var url = UrlApi + 'TBLSuministro';				
		console.log(params);
		$http.get(url,{params : params})
		.success(function(res){		
			console.log(res);
			q.resolve(res)
		}).error(function(err){
			q.reject(err);
		})
		return q.promise;
	};

	Result.getSuministrosFoto = function(params){
		// params recibe el valos del estado		
		var q = $q.defer();
		console.log(params);
		var url = UrlApi + 'TBLSuministro';			
		$http.get(url,{params : params})
		.success(function(res){
			console.log(res);
			q.resolve(res)
		}).error(function(err){
			q.reject(err);
		})
		return q.promise;
	};	

	Result.TBLOperariosValidar = function(codOperario){
		var q= $q.defer();
		var url = UrlApi + "TBLOperarios/" + codOperario;
		var config = {
		          method : "GET",
		          url : url,
		          timeout: 8000
		 };		
		$http(config)
		.success(function(res){			
			q.resolve(res);
		}).error(function(err){			
			q.reject(err);
		});
		return q.promise;

	}

	Result.getDetalleGrupo = function(params){
		var q = $q.defer();
		var url = UrlApi + 'TBLDetalleGrupo';
		$http.get(url,{ params : params })		
		.success(function(res){			
			q.resolve(res);
		}).error(function(err){
			q.reject(err);
		})
		return q.promise;
	}

	Result.saveTBLRegistros = function(params,idOperario){
		var q = $q.defer();
		var url = UrlApi + 'TBLRegistros';
		console.log(params,idOperario);
		$http.post(url,params,{params : {
			idOperario : idOperario
		}})
		.success(function(res){
			q.resolve(res);
		})
		.error(function(err){
			q.reject(err);
		})

		return q.promise;
	}

	Result.saveTblSuministroBack = function(params){
		var q = $q.defer();		
		var url = UrlApi + 'tblsuministroback';
		$http.post(url,params)
		.success(function(res){
			q.resolve(res);
		})
		.error(function(err){
			q.reject(err);
		})

		return q.promise;
	}	
	Result.saveTBLRegistros_Fotos = function(params){
		var q = $q.defer();
		var url = UrlApi + 'TBLRegistroFoto';
		$http.post(url,params)
		.success(function(res){
			q.resolve(res);
		})
		.error(function(err){
			q.reject(err);
		})
		return q.promise;
	}
	Result.saveTBLRegistros_Fotos_back = function(params){
		var q = $q.defer();
		var url = UrlApi + 'TBLRegistroFoto';
		$http.post(url,params)
		.success(function(res){
			q.resolve(res);
		})
		.error(function(err){
			q.resolve(err);
		})
		return q.promise;
	}	
	Result.getTblParametros = function(){
		var q = $q.defer();
		var url = UrlApi + 'TBLParametros';
		$http.get(url)
		.success(function(res){
			q.resolve(res);
		})
		.error(function(err){
			q.reject(err);
		})

		return q.promise;
	}
	Result.getTblTipoReporteDiario = function(){
		var q = $q.defer();
		var url = UrlApi + 'TblTipoReporteDiario';
		$http.get(url)
		.success(function(res){
			q.resolve(res);
		})
		.error(function(err){
			q.reject(err);
		})

		return q.promise;
	}	
	Result.saveTBLReporte_Diario = function(params){
		var q = $q.defer();
		var url = UrlApi + 'TBLReporteDiario';
		$http.post(url,params)
		.success(function(res){
			q.resolve(res);
		})
		.error(function(err){
			q.reject(err);
		})

		return q.promise;
	}
	Result.saveTBLReporte_Diario_Foto = function(params){
		var q = $q.defer();
		var url = UrlApi + 'TBLReporteDiarioFoto';
		$http.post(url,params)
		.success(function(res){
			q.resolve(res);
		})
		.error(function(err){
			q.reject(err);
		})

		return q.promise;
	}				
	return Result;
})