angular.module('app.alertaServices', [])

.factory('alertaServices' , function($q,$http,UrlApi,ServicesPhoto){
	
	var Result = {};	
	
	Result.sendEmailAlert = function(params){
		var q = $q.defer();
		var url = UrlApi + 'SendEmails';
		$http.get(url,{ params : params })		
		.success(function(res){
			q.resolve(res);
		}).error(function(err){
			q.reject(err);
		})
		return q.promise;
	}

	return Result;
})