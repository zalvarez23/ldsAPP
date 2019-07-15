angular.module('app.mapsLecturasUnitController', [])

.controller('mapsLecturasUnitCtrl',function($scope,$timeout,$state,$stateParams,sqliteServices,$ionicActionSheet,plantillaA1Services,popupServices,$q,$ionicModal,ServicesPhoto,gpsServices,envioPendientesServices){
	var flagAll = false;
	
	$scope.itemSuministro = JSON.parse(localStorage.getItem('dataSuministro3'));
	console.log($scope.itemSuministro)
	$scope.initView = function(option){
		flagAll = option;		
		$scope.showLoaderPlan = true;
		$timeout(function(){
			$scope.showLoaderPlan = false;
			sqliteServices.getTbl_SuministrosAll().then(function(res){				
				InicializarMapa(res);				
				
				
			})			
		},1500)		
	}
	$scope.goHome = function(){
		$state.go('menu.home');
	};	
	$scope.showOptions = function(item) {		
	   // Show the action sheet	   
	   var content = '<div class="list listLecturas">' +      
        '<div class="contentList">' +
          '<h1>Cliente : ' + item.Suministro_Cliente + '</h1>' +
          '<p>Dirección : ' + item.Suministro_Direccion + '</p>' +
          '<p>Suministro : ' + item.Suministro_Numero + '</p>  ' +        
          '<p>Medidor : ' + item.Suministro_Medidor + '</p>' +
	      '</div>' +
	     '</a>' +
	    '</div>' +
	    '</div>'
	   var hideSheet = $ionicActionSheet.show({
	     buttons: [
	       { text: content},
	       { text : '<b>Ver Ruta</b>'}
	     ],
	     //destructiveText: '<b>Eliminar</b>',
	     titleText: 'Opciones',
	     cancelText: 'Cancelar',
	     cssClass : 'sheetStyles',
	     cancel: function() {
	          // add cancel code..
	        },
	     buttonClicked: function(index) {
	     	
	     	if (index == 0) {
				   
	     	}else if(index == 1){
	     		var destino = item.Suministro_Latitud + ',' + item.Suministro_Longitud;	     		
	     		calcRoute(destino);
	     	}

	       	return true;
	     },
	     destructiveButtonClicked : function(){	     	
	     	return true;
	     }
	   });

	   // For example's sake, hide the sheet after two seconds
	   $timeout(function() {
	     hideSheet();
	   }, 2000);

	 };		
	var DistanciaKM = 10370;
	var map,myLatLng;
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();	
    function InicializarMapa(listLecturas) {    	
    	gpsServices.getCurrentPosition().then(function(res){
			myLatLng = {lat: res.lat, lng: res.long};
			directionsDisplay = new google.maps.DirectionsRenderer();
			var mapDOM = document.getElementById('mapUnit');
			map = new google.maps.Map(mapDOM, {
			  zoom: 11,
			  center: myLatLng,
			});
			
			directionsDisplay.setMap(map);
			createMypositionMarket(myLatLng);			
			$timeout(function(){
				createMarketAll(listLecturas);
				var destino = $scope.itemSuministro.Suministro_Latitud + ',' + $scope.itemSuministro.Suministro_Longitud;	     		
				$timeout(function(){
					calcRoute(destino);	
				},500)				
			},200)		
    	})
    	var createMypositionMarket = function(objectCoor){
			var contentString = "<p style='font-weight: 500;'>Mi ubicación</p>";
			var infowindow = new google.maps.InfoWindow({
			  content: contentString
			});	    		
    		var image = "img/myPosition.png";	
			var marker = new google.maps.Marker({
				position : objectCoor,
				map : map,			    
			    //animation: google.maps.Animation.DROP,
			    icon : image				
			})
			infowindow.open(map, marker);
			marker.addListener('click', function() {
			  infowindow.open(map, marker);
			});			
			$timeout(function(){
				infowindow.close();
			},2000)
    	}    	
    	var createMarketAll = function(objectCoor){
    		var image = "img/market.png";
    		var latR,lngR = "";
			var positionR = {
				lat : parseFloat($scope.itemSuministro.Suministro_Latitud),
				lng : parseFloat($scope.itemSuministro.Suministro_Longitud)
			}
			$timeout(function(){
				var marker = new google.maps.Marker({
					position : positionR,
					map : map,
				    //animation: google.maps.Animation.DROP,
				    icon : image				
				})
				marker.addListener('click', function() {
				  $scope.showOptions($scope.itemSuministro);
				});
			  })
    	}
    	var createCircle = function(myPosition){
    		var cityCircle = new google.maps.Circle({
		      strokeColor: '#FF0000',
		      strokeOpacity: 0.8,
		      strokeWeight: 2,
		      fillColor: '#FF0000',
		      fillOpacity: 0.35,
		      map: map,
		      center: myPosition,
		      radius: DistanciaKM
		    });
    	}   	
    };
	var calcRoute = function(destino) {

	  var start = "Gallup, NM";
	  var end = "Kingman";
	  var origen = myLatLng.lat + ',' + myLatLng.lng;	  
	  var request = {
	    origin:origen,
	    destination:destino,
	    travelMode: google.maps.TravelMode.WALKING,
	    optimizeWaypoints: true,	    
	  };	  
	  directionsService.route(request, function(result, status) {	  	
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(result);
	    }
	  });
	}

		
})


.controller('mapsLecturasUnit2Ctrl',function($scope,$timeout,$state,$stateParams,sqliteServices,$ionicActionSheet,plantillaA1Services,popupServices,$q,$ionicModal,ServicesPhoto,gpsServices,envioPendientesServices){
	var flagAll = false;
	
	$scope.itemSuministro = JSON.parse(localStorage.getItem('dataSuministro'));
	console.log($scope.itemSuministro)
	$scope.initView = function(option){
		flagAll = option;		
		$scope.showLoaderPlan = true;
		$timeout(function(){
			$scope.showLoaderPlan = false;
			sqliteServices.getTbl_SuministrosAll().then(function(res){				
				InicializarMapa(res);				
				
				
			})			
		},1500)		
	}
	$scope.goHome = function(){
		$state.go('menu.home');
	};	
	$scope.showOptions = function(item) {		
	   // Show the action sheet	   
	   var content = '<div class="list listLecturas">' +      
        '<div class="contentList">' +
          '<h1>Cliente : ' + item.Suministro_Cliente + '</h1>' +
          '<p>Dirección : ' + item.Suministro_Direccion + '</p>' +
          '<p>Suministro : ' + item.Suministro_Numero + '</p>  ' +        
          '<p>Medidor : ' + item.Suministro_Medidor + '</p>' +
	      '</div>' +
	     '</a>' +
	    '</div>' +
	    '</div>'
	   var hideSheet = $ionicActionSheet.show({
	     buttons: [
	       { text: content},
	       { text : '<b>Ver Ruta</b>'}
	     ],
	     //destructiveText: '<b>Eliminar</b>',
	     titleText: 'Opciones',
	     cancelText: 'Cancelar',
	     cssClass : 'sheetStyles',
	     cancel: function() {
	          // add cancel code..
	        },
	     buttonClicked: function(index) {
	     	
	     	if (index == 0) {
				   
	     	}else if(index == 1){
	     		var destino = item.Suministro_Latitud + ',' + item.Suministro_Longitud;	     		
	     		calcRoute(destino);
	     	}

	       	return true;
	     },
	     destructiveButtonClicked : function(){	     	
	     	return true;
	     }
	   });

	   // For example's sake, hide the sheet after two seconds
	   $timeout(function() {
	     hideSheet();
	   }, 2000);

	 };		
	var DistanciaKM = 10370;
	var map,myLatLng;
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();	
    function InicializarMapa(listLecturas) {    	
    	gpsServices.getCurrentPosition().then(function(res){
			myLatLng = {lat: res.lat, lng: res.long};
			directionsDisplay = new google.maps.DirectionsRenderer();
			var mapDOM = document.getElementById('mapUnit');
			map = new google.maps.Map(mapDOM, {
			  zoom: 11,
			  center: myLatLng,
			});
			
			directionsDisplay.setMap(map);
			createMypositionMarket(myLatLng);			
			$timeout(function(){
				createMarketAll(listLecturas);
				var destino = $scope.itemSuministro.Suministro_Latitud + ',' + $scope.itemSuministro.Suministro_Longitud;	     		
				$timeout(function(){
					calcRoute(destino);	
				},500)				
			},200)		
    	})
    	var createMypositionMarket = function(objectCoor){
			var contentString = "<p style='font-weight: 500;'>Mi ubicación</p>";
			var infowindow = new google.maps.InfoWindow({
			  content: contentString
			});	    		
    		var image = "img/myPosition.png";	
			var marker = new google.maps.Marker({
				position : objectCoor,
				map : map,			    
			    //animation: google.maps.Animation.DROP,
			    icon : image				
			})
			infowindow.open(map, marker);
			marker.addListener('click', function() {
			  infowindow.open(map, marker);
			});			
			$timeout(function(){
				infowindow.close();
			},2000)
    	}    	
    	var createMarketAll = function(objectCoor){
    		var image = "img/market.png";
    		var latR,lngR = "";
			var positionR = {
				lat : parseFloat($scope.itemSuministro.Suministro_Latitud),
				lng : parseFloat($scope.itemSuministro.Suministro_Longitud)
			}
			$timeout(function(){
				var marker = new google.maps.Marker({
					position : positionR,
					map : map,
				    //animation: google.maps.Animation.DROP,
				    icon : image				
				})
				marker.addListener('click', function() {
				  $scope.showOptions($scope.itemSuministro);
				});
			  })
    	}
    	var createCircle = function(myPosition){
    		var cityCircle = new google.maps.Circle({
		      strokeColor: '#FF0000',
		      strokeOpacity: 0.8,
		      strokeWeight: 2,
		      fillColor: '#FF0000',
		      fillOpacity: 0.35,
		      map: map,
		      center: myPosition,
		      radius: DistanciaKM
		    });
    	}   	
    };
	var calcRoute = function(destino) {

	  var start = "Gallup, NM";
	  var end = "Kingman";
	  var origen = myLatLng.lat + ',' + myLatLng.lng;	  
	  var request = {
	    origin:origen,
	    destination:destino,
	    travelMode: google.maps.TravelMode.WALKING,
	    optimizeWaypoints: true,	    
	  };	  
	  directionsService.route(request, function(result, status) {	  	
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(result);
	    }
	  });
	}

		
})



.controller('mapsLecturasUnit3Ctrl',function($scope,$timeout,$state,$stateParams,sqliteServices,$ionicActionSheet,plantillaA1Services,popupServices,$q,$ionicModal,ServicesPhoto,gpsServices,envioPendientesServices){
	var flagAll = false;
	
	$scope.itemSuministro = JSON.parse(localStorage.getItem('dataSuministro2'));
	console.log($scope.itemSuministro)
	$scope.initView = function(option){
		flagAll = option;		
		$scope.showLoaderPlan = true;
		$timeout(function(){
			$scope.showLoaderPlan = false;
			sqliteServices.getTbl_SuministrosAll().then(function(res){				
				InicializarMapa(res);				
				
				
			})			
		},1500)		
	}
	$scope.goHome = function(){
		$state.go('menu.home');
	};	
	$scope.showOptions = function(item) {		
	   // Show the action sheet	   
	   var content = '<div class="list listLecturas">' +      
        '<div class="contentList">' +
          '<h1>Cliente : ' + item.Suministro_Cliente + '</h1>' +
          '<p>Dirección : ' + item.Suministro_Direccion + '</p>' +
          '<p>Suministro : ' + item.Suministro_Numero + '</p>  ' +        
          '<p>Medidor : ' + item.Suministro_Medidor + '</p>' +
	      '</div>' +
	     '</a>' +
	    '</div>' +
	    '</div>'
	   var hideSheet = $ionicActionSheet.show({
	     buttons: [
	       { text: content},
	       { text : '<b>Ver Ruta</b>'}
	     ],
	     //destructiveText: '<b>Eliminar</b>',
	     titleText: 'Opciones',
	     cancelText: 'Cancelar',
	     cssClass : 'sheetStyles',
	     cancel: function() {
	          // add cancel code..
	        },
	     buttonClicked: function(index) {
	     	
	     	if (index == 0) {
				   
	     	}else if(index == 1){
	     		var destino = item.Suministro_Latitud + ',' + item.Suministro_Longitud;	     		
	     		calcRoute(destino);
	     	}

	       	return true;
	     },
	     destructiveButtonClicked : function(){	     	
	     	return true;
	     }
	   });

	   // For example's sake, hide the sheet after two seconds
	   $timeout(function() {
	     hideSheet();
	   }, 2000);

	 };		
	var DistanciaKM = 10370;
	var map,myLatLng;
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();	
    function InicializarMapa(listLecturas) {    	
    	gpsServices.getCurrentPosition().then(function(res){
			myLatLng = {lat: res.lat, lng: res.long};
			directionsDisplay = new google.maps.DirectionsRenderer();
			var mapDOM = document.getElementById('mapUnit');
			map = new google.maps.Map(mapDOM, {
			  zoom: 11,
			  center: myLatLng,
			});
			
			directionsDisplay.setMap(map);
			createMypositionMarket(myLatLng);			
			$timeout(function(){
				createMarketAll(listLecturas);
				var destino = $scope.itemSuministro.Suministro_Latitud + ',' + $scope.itemSuministro.Suministro_Longitud;	     		
				$timeout(function(){
					calcRoute(destino);	
				},500)				
			},200)		
    	})
    	var createMypositionMarket = function(objectCoor){
			var contentString = "<p style='font-weight: 500;'>Mi ubicación</p>";
			var infowindow = new google.maps.InfoWindow({
			  content: contentString
			});	    		
    		var image = "img/myPosition.png";	
			var marker = new google.maps.Marker({
				position : objectCoor,
				map : map,			    
			    //animation: google.maps.Animation.DROP,
			    icon : image				
			})
			infowindow.open(map, marker);
			marker.addListener('click', function() {
			  infowindow.open(map, marker);
			});			
			$timeout(function(){
				infowindow.close();
			},2000)
    	}    	
    	var createMarketAll = function(objectCoor){
    		var image = "img/market.png";
    		var latR,lngR = "";
			var positionR = {
				lat : parseFloat($scope.itemSuministro.Suministro_Latitud),
				lng : parseFloat($scope.itemSuministro.Suministro_Longitud)
			}
			$timeout(function(){
				var marker = new google.maps.Marker({
					position : positionR,
					map : map,
				    //animation: google.maps.Animation.DROP,
				    icon : image				
				})
				marker.addListener('click', function() {
				  $scope.showOptions($scope.itemSuministro);
				});
			  })
    	}
    	var createCircle = function(myPosition){
    		var cityCircle = new google.maps.Circle({
		      strokeColor: '#FF0000',
		      strokeOpacity: 0.8,
		      strokeWeight: 2,
		      fillColor: '#FF0000',
		      fillOpacity: 0.35,
		      map: map,
		      center: myPosition,
		      radius: DistanciaKM
		    });
    	}   	
    };
	var calcRoute = function(destino) {

	  var start = "Gallup, NM";
	  var end = "Kingman";
	  var origen = myLatLng.lat + ',' + myLatLng.lng;	  
	  var request = {
	    origin:origen,
	    destination:destino,
	    travelMode: google.maps.TravelMode.WALKING,
	    optimizeWaypoints: true,	    
	  };	  
	  directionsService.route(request, function(result, status) {	  	
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(result);
	    }
	  });
	}

		
})