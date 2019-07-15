
angular.module('app.loginServices', [])

.factory('loginServices', function($q,$http,UrlApi,$provide,$timeout){

	var Result = {};	
        var ip;
        var urlAux;
/*	Result.logIn = function(params){
        if (params.conexion == 'P') {
           $provide.constant('UrlApi','http://179.43.80.196/webapi/api/');
           urlAux = "http://179.43.80.196/webapi/api/";
        }else if(params.conexion == 'L'){
           $provide.constant('UrlApi','http://172.8.1.50/webapi/api/');
           urlAux = "http://172.8.1.50/webapi/api/";             
        }
        var url = urlAux + 'tblPersonalApi'
        var q = $q.defer();
        $http.get(url,{ params : params })
        .success(function(result){                
        	q.resolve(result);
        },function(err){
        	console.log(err)
        	a.reject(err);
        })
        return q.promise;
	}
        Result.saveIp = function(ipResult){
                ip = ipResult;
        };
        Result.getIp = function(){
                return ip;
        }
	return Result; */

        Result.logIn = function(params){

                var url = UrlApi + 'TBLOperarios'
                var q = $q.defer();
                $http.get(url,{ params : params })
                .success(function(result){  console.log(result);            
                    q.resolve(result);
                },function(err){            
                    a.reject(err);
                })
                return q.promise;
            }
        
        Result.logInPrueba = function(params){

               var url = UrlApi + 'TBLOperarios'
               var q = $q.defer();
               $http.get(url,{ params : params },{ timeout: q.promise })
               .success(function(result){  
               
                   q.resolve(result);
               },function(err){            
                   q.reject(err);
               })
               $timeout(function() {
                  q.reject('timeout'); // this aborts the request!
                }, 6000);	
               return q.promise;
         }
                        
         Result.updateStatusModel = function(params){
          var q = $q.defer();
          var url = UrlApi + 'TBLOperarios';
          console.log(params);
          $http.get(url,{params : params})
          .success(function(res){
            q.resolve(res);
          },function(err){
            q.reject(err);
          })
          return q.promise;
         }


        Result.saveIp = function(ipResult){
                ip = ipResult;
        };
        Result.getIp = function(){
                return ip;
        } 
    return Result;

})