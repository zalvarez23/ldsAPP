// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('app', ['ionic','firebase',
 'ngCordova',
 'app.routes',
 'app.directives',
 'app.services',
 'app.loginServices',
 'app.loginController',
 'app.homeController',
 'app.menuActividadesController',
 'app.actiController',
 'app.plantillaA1Controller',
 'app.gpsServices',
 'app.popupServices',
 'app.sincroServices',
 'app.sqliteServices',
 'app.getDataSincro',
 'app.plantillaA1Services',
 'app.ServicesPhoto',
 'app.envioPendientesServices',
 'app.lecturasController',
 'app.registroLecturasController',
 'app.mapsLecturasController',
 'app.mapsLecturasUnitController',
 'app.reporteDiarioController',
 'app.alertaServices',
 'app.alertaController','app.registroVerificacionesController','app.registroFotosController','app.registroFotosInconController','app.registroReLecturasController'])

.config(function($ionicConfigProvider,$provide,$injector){
    $provide.value('$providerInjector', $injector);
    $provide.value('$provide', $provide);
})

//.constant("UrlApi", "http://192.168.0.9/webApi_Lecturas/api/")
.constant("UrlApi", "http://www.cobraperu.com/webApiLecturasLDS3/api/")



.constant("VersionApp", "82")
.constant("VersionAppR", "82")
//.constant("UrlApi", "http://192.168.0.13:8087/api/")
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {          
            if(event.which === 9 || event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
})

.run(function($ionicPlatform,sqliteServices,loginServices,$cordovaFile,$providerInjector){
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);      
      $cordovaFile.createDir(cordova.file.externalRootDirectory, "LECTURASLDS", false)
      .then(function (success) {
      //alert(JSON.stringify(success));
      }, function (error) {
        
      }); 
      $cordovaFile.createDir(cordova.file.externalRootDirectory, "LECTURASLDS_VERSION", false)
      .then(function (success) {
      //alert(JSON.stringify(success));
      }, function (error) {
        
      });            
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
       StatusBar.show();
       StatusBar.overlaysWebView(false);
       StatusBar.styleLightContent();
       StatusBar.backgroundColorByHexString("#387ef5");
    } 
    db= window.openDatabase("dbLecturasLDS.db", '1', 'my', 1024 * 1024 * 100);
    sqliteServices.createTables(db);    
  });
})