angular.module('app.reporteResultadoDiaController', [])

.controller('reporteResultadoDiaCtrl' , function($scope,alertaServices,$timeout,sqliteServices,$state,plantillaA1Services,popupServices){

	$scope.paramsSearch = {
		fecha : '',
    sector : '01',
    sucursal : '9',
	}
	var fechaAux,selectSucursal;
	$timeout(function(){
		fechaAux = document.getElementById('txtFecha');		
    selectSucursal = document.getElementById('selectSucursal');
		fechaAux.value = plantillaA1Services.getDateHoyReal();		
	})
    $scope.loaderOk = false;
	$scope.goHome = function(){
		$state.go('menu.home');
	};
  var getReporteDiario = function(tipo,parametros){
    $scope.loaderOk = true;
    var params = {
      tipo : tipo,
      parametros : parametros
    }
    alertaServices.getReporteDiario(params).then(function(res){
      $scope.loaderOk = false;
      if (tipo == 1) {
          $scope.listSucursales = res;          
          
      }else if(tipo == 2){        
          $scope.listSector = res;                    
          $scope.paramsSearch.sector = $scope.listSector[0].sector;
          
          
      }else if(tipo == 3){
          $scope.listData = res;
          console.log(res);
      }
      
    },function(err){
      $scope.loaderOk = false;
      console.log(err);
    })
  }
  getReporteDiario(1,'');
  getReporteDiario(2,'');


    $scope.getReporteDiarioReal = function(){
      $scope.paramsSearch.fecha = fechaAux.value;
      $scope.paramsSearch.sucursal = selectSucursal.value;
      var params = $scope.paramsSearch.sucursal  + '|' + $scope.paramsSearch.sector + '|' + $scope.paramsSearch.fecha
      console.log(params);
        getReporteDiario(3,params);      
    }
})
