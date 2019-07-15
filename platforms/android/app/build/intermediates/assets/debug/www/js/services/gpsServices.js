angular.module('app.gpsServices', [])

.factory('gpsServices', function($q,$cordovaGeolocation,sqliteServices,plantillaA1Services,UrlApi,$http,$timeout){

	var Result = {};
  var battery;
  Result.saveBatteryDevice = function(values){    
    battery = values;
  }
  Result.getBatteryDevice = function(){
    return battery;
  } 
	Result.getCurrentPosition = function(){
		var q = $q.defer();
    //var posOptions = {timeout: 3000, enableHighAccuracy: false};
    $cordovaGeolocation
//      .getCurrentPosition(posOptions)
      .getCurrentPosition()
      .then(function (position) {
        var objPosition = {
          lat : position.coords.latitude,
          long : position.coords.longitude
        }
        q.resolve(objPosition);
      }, function(err) {
        var objPosition = {
          lat :0,
          long : 0
        }
        q.resolve(objPosition);
    });

		return q.promise;

    }
    var MyVarGps = null;
    var MyVarGpsEstado = null;
    var MyVarCound = null;
    var MyGpsTimer = null;
    var countEnviarServidor = 0;
    Result.clearIntervalAll = function(){
        clearInterval(MyVarGps);
        clearInterval(MyVarGpsEstado);
    }
    var latAux = 0;
    var lonAux = 0;    
    Result.saveCurrentPosition = function(){
      
      clearInterval(MyVarGps);
      clearInterval(MyVarGpsEstado);
      var executeEach = function(){
        var idOperario = JSON.parse(localStorage.getItem('dataUser')).ID_Operario;
        var tiempoRepeat = 0;
        var tiempoSend = 0;
        var count = 0;
        var tiempoRepeatEstado = 0;      
        var countEstado = 0;      
        sqliteServices.getTbl_Parametros().then(function(res){
          if (res.length == 0) {
            tiempoRepeat = 5000; // 5 SEGUNDOS POR DEFECTO
            tiempoRepeatEstado = 5000;
            tiempoSend =1 * 60000; // EN MINUTOS          
          }else{          
            res.forEach(function(item,index){            
              if (item.nombre_parametro == "Guardar Ubicacion") {            
                tiempoRepeat = item.valor;              
              }else if(item.nombre_parametro == "Enviar Ubicacion"){
                console.log(item.valor)
                tiempoSend = parseFloat(item.valor) * 60000;
              }else if(item.nombre_parametro == "Guardar Estado Celular"){
                tiempoRepeatEstado = item.valor;
              }
            })
          }
            
          MyVarGps = setInterval(myTimerGps, tiempoRepeat);
          MyVarGpsEstado = setInterval(myTimerGpsEstadoCelular, tiempoRepeatEstado);          
        });
        function myTimerGps() {        
          Result.getCurrentPosition().then(function(res){           
            if (res.lat == 0) {              
              return;
            }
            var params = [idOperario,res.lat,res.long,plantillaA1Services.getDateHoy()]          
            sqliteServices.saveTBL_Operarios_RegistroGPS(params).then(function(res){                             
                  count++;
                  var timeTotal = count * tiempoRepeat;
                  console.log('Tiempo total Operario: ' + timeTotal + ' | tiene q ser mayor : ' + tiempoSend)
                  if (timeTotal >= tiempoSend) {                  
                    // TRAEMOS LOS DATOS DE GPS GUARDADOS SEGUN PARAMETROS                  
                    sqliteServices.getTBL_Operarios_RegistroGPS().then(function(data){                    
                      // REGISTRAMOS AL SERVIOR
                      Result.saveTBLOperarioRegistroGPS(data).then(function(res){
                        // ELIMINAMOS TABLA QUE GUARDA LAS UBICACIONES SQLITE
                        sqliteServices.deleteTBL_Operarios_RegistroGPS();                      
                        console.log(res)
                        count = 0;
                      },function(err){
                        console.log(err)
                      })
                    });                            
                  }
            });          
          },function(err){
            console.log(err)
          })

        }
        function myTimerGpsEstadoCelular() {
          Result.getCurrentPosition().then(function(res){
            if (res.lat == 0) {              
              return;
            }
            var statusBattery = Result.getBatteryDevice();
            //var statusBattery = 40;
            var paramsS = [idOperario,1,statusBattery,plantillaA1Services.getDateHoy(),1,1]
            //var paramsS = [idPersonal,1,40,localStorageServices.getDateTimeNow()]
            sqliteServices.saveTbl_EstadoCelular(paramsS).then(function(res){
              countEstado++;
              var timeTotal = countEstado * tiempoRepeatEstado;
              console.log('Tiempo total Estado Cel: ' + timeTotal + ' | tiene q ser mayor : ' + tiempoSend)
              if (timeTotal >= tiempoSend) {
                // TRAEMOS LOS DATOS DE ESTADO MOVIL GUARDADOS
                sqliteServices.getTbl_EstadoCelular().then(function(data){
                  // REGISTRAMOS DATOS AL SERVIDOR                
                  Result.savetbl_EstadoCelular(data).then(function(res){
                    console.log('success 2')
                    // ELIMINAMOS TABLA Q GUARDA EL ESTADO CELULAR SQLITE
                    sqliteServices.deleteTbl_EstadoCelular();
                    countEstado = 0;
                  })
                })
              }
          })
          },function(err){
            console.log(err)
          })

        }

      }
      $timeout(function(){
        executeEach();
      },1000)
    }
    Result.activateGps = function(){
      console.log('Interval activado...');
      clearInterval(MyGpsTimer)
      MyGpsTimer = setInterval(myTimerGpsAux,2000)      
    }
    Result.getGpsAux = function(){
      return {
        lat : latAux,
        lon : lonAux
      }
    }
    function myTimerGpsAux(){
      Result.getCurrentPosition().then(function(res){
        latAux = res.lat;
        lonAux = res.long;	
        console.log(latAux);
      })
    }    
    Result.saveTBLOperarioRegistroGPS = function(params){
      var q = $q.defer();
      var url = UrlApi + 'TBLOperariosRegistroGPS';
      $http.post(url,params)
      .success(function(res){
        q.resolve(res);
      })
      .error(function(err){
        q.reject(err);
      })
      return q.promise;    
    }
      Result.savetbl_EstadoCelular = function(params){
        var q = $q.defer();
        var url = UrlApi + 'TBLEstadoCelular';
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