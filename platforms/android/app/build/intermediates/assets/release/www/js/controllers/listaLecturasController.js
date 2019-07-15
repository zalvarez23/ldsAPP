angular.module('app.lecturasController', [])

.controller('listaLecturasCtrl',function($scope,$timeout,$state,sqliteServices){
	// INIT CARGA DE LOAD
	$scope.showLoaderPlan = true;
	//
	var dataUser = localStorage.getItem('dataUser');
	dataUser = JSON.parse(dataUser);	
	$scope.goHome = function(){
		$state.go('menu.home');
	};
	var cant = 0;
	$scope.listSuministros = [];
	$scope.hasMoreData = false;
	$scope.filterSearch = {
		txtFilter : '',
	};
	$scope.listRegistros = {
		total : 0,
		registrados : 0,
	}
	$scope.getCantidadSuministros = function(){
		$timeout(function(){

			sqliteServices.getTbl_Suministros_Cant(dataUser.ID_Operario,'1,3').then(function(res){							
				if (res.length == 1) {
					// NO HAY NINGUN REGISTRO EN ESTADO B
					console.log(res);
					$scope.listRegistros.total = res[0].cantidad;
				}else{
					// SE ENCONTRO REGISTRO EN ESTADO B
					console.log(res);
					$scope.listRegistros.total = res[0].cantidad;
					$scope.listRegistros.registrados = res[1].cantidad;
				}
			})			
		},500)
	}
	$scope.getSuministros = function(tip){
		$timeout(function(){
			if (tip == 2) {
				$scope.showLoaderPlan = true;
				$scope.showListLecturas = false;
			}
			cant = 0 ;
			$scope.listSuministros = [];		
			sqliteServices.getTbl_Suministros(cant,$scope.filterSearch.txtFilter,dataUser.ID_Operario,'1,3').then(function(data){
				if (data.length == 0) {$scope.hasMoreData = false; $scope.showLoaderPlan = false; 
				$scope.showListLecturas = true; return;  };				
				data.forEach(function(item,index){
					$scope.listSuministros.push(item);
				});			
				cant = data[data.length - 1].SuministroOrden;				
				$timeout(function(){				
					$scope.showLoaderPlan = false;
					$scope.showListLecturas = true;
					$scope.$broadcast('scroll.refreshComplete');
					$scope.hasMoreData = true;						
				},1300)
			},function(err){
					
			});			
		},500)
		
	}
	$scope.getMoreSuministros = function(){		
		sqliteServices.getTbl_SuministrosMore(cant,$scope.searchGen,dataUser.ID_Operario, '1,3').then(function(data){		
           	if (data.length == 0) {$scope.hasMoreData = false; return;};
           	$timeout(function(){
	   			data.forEach(function(item,index){
					$scope.listSuministros.push(item);
				});				
				cant = data[data.length - 1].SuministroOrden;
				$scope.$broadcast('scroll.infiniteScrollComplete');         		
           	},1000)
 
		},function(err){
			
		})
	};	
	$scope.gotoRegistroLectura = function(item){
		localStorage.setItem('dataSuministro',JSON.stringify(item));
		$state.go('menu.home-registroLecturas');
	}
	$scope.goToMap = function(item){
		localStorage.setItem('dataSuministro',JSON.stringify(item));
		$state.go('menu.home-mapsLecturasUnit2');		
	}	
	$scope.goToMaps = function(){
		localStorage.setItem('idTipoProceso',1);
		$state.go('menu.home-mapsLecturas');
	}

})