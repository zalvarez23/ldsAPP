angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  .state('menu', {
    url: '/viewComercial',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('menu.home', {
    url: '/home',
    cache : true,
    views: {
      'viewComercial': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })
  .state('menu.sendInfo', {
    url: '/sendInfo',
    cache : false,
    views: {
      'viewComercial': {
        templateUrl: 'templates/enviarDatos.html',
        controller: 'sendInfoCtrl'
      }
    }
  })  
  .state('menu.home-menuActividades',{
    url: '/menuActividades',
    views: {
      'viewComercial' : {
        templateUrl : 'templates/menuActividades.html',
        controller : 'menuActividadesCtrl'
      }
    }
  })
  .state('menu.home-listaLecturas',{
    url: '/listaLecturas',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/listaLecturas.html',
        controller : 'listaLecturasCtrl'
      }
    }
  })
  .state('menu.home-mapsLecturas',{
    url: '/mapsLecturas',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/mapsLecturas.html',
        controller : 'mapsLecturasCtrl'
      }
    }
  })

  .state('menu.home-listaAvance',{
    url: '/listaAvance',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/listaAvance.html',
        controller : 'listaAvanceCtrl'
      }
    }
  })  

  .state('menu.home-mapsLecturasUnit',{
    url: '/mapsLecturasUnit',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/mapsLecturasUnit.html',
        controller : 'mapsLecturasUnitCtrl'
      }
    }
  })    
  .state('menu.home-mapsLecturasUnit2',{
    url: '/mapsLecturasUnit2',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/mapsLecturasUnit2.html',
        controller : 'mapsLecturasUnit2Ctrl'
      }
    }
  })    
  .state('menu.home-mapsLecturasUnit3',{
    url: '/mapsLecturasUnit3',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/mapsLecturasUnit3.html',
        controller : 'mapsLecturasUnit3Ctrl'
      }
    }
  })        
  .state('menu.home-registroLecturas',{
    url: '/registroLecturas',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/registroLecturas.html',
        controller : 'registroLecturasCtrl'
      }
    }
  })
  .state('menu.home-registroReLecturas',{
    url: '/registroReLecturas',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/registroReLecturas.html',
        controller : 'registroReLecturasCtrl'
      }
    }
  })  
  .state('menu.home-registroVerificaciones',{
    url: '/registroVerificaciones',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/registroVerificaciones.html',
        controller : 'registroVerificacionesCtrl'
      }
    }
  })    
  .state('menu.home-registroFotos',{
    url: '/registroFotos',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/registroFotos.html',
        controller : 'registroFotosCtrl'
      }
    }
  }) 

  .state('menu.home-registroFotosIncon',{
    url: '/registroFotosIncon',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Lecturas/registroFotosIncon.html',
        controller : 'registroFotosInconCtrl'
      }
    }
  }) 

  .state('menu.home-cuadrilla',{
    url: '/cuadrilla',
    views: {
      'viewComercial' : {
        templateUrl : 'templates/cuadrilla.html',
        controller : 'cuadrillaCtrl'
      }
    }
  })
  .state('menu.home-actividades',{
    url: '/actividades/:idCuadrilla',
    cache: false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/actividades.html',        
        controller : 'actividadesCtrl'
      }
    }
  })
  .state('menu.home-plantillaA1',{
    url: '/plantillaA1',
    cache : false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/Plantillas/plantillaA1.html',
        controller : 'plantillaA1Ctrl'
      }
    }
  })
  .state('menu.home-reporteDiario',{
    url: '/reporteDiario',
    cache: false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/ReporteDiario/reporteDiario.html',        
        controller : 'reporteDiarioCtrl'
      }
    }
  })
  .state('menu.home-alerta',{
    url: '/alerta',
    cache: false,
    views: {
      'viewComercial' : {
        templateUrl : 'templates/ReporteDiario/alerta.html',        
        controller : 'alertaCtrl'
      }
    }
  })  
  .state('menu.cart', {
    url: '/page2',
    views: {
      'viewComercial': {
        templateUrl: 'templates/cart.html',
        controller: 'cartCtrl'
      }
    }
  })
  .state('login', {
    url: '/login',   
    cache : false,
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl' 
  })
  
  .state('menu.cloud', {
    url: '/page3',
    views: {
      'viewComercial': {
        templateUrl: 'templates/cloud.html',
        controller: 'cloudCtrl'
      }
    }
  })



$urlRouterProvider.otherwise('/login')

  

})
