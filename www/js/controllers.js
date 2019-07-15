angular.module('app.controllers', [])
  
.controller('homeCtrl', ['$scope', '$stateParams','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $timeout) {
	// DAMOS VALORES AL NOMBRE DEL USUARIO	
	var dataUser = localStorage.getItem('dataUser');
	dataUser = JSON.parse(dataUser);
	$scope.nameUser = dataUser.nombres_personal + ' ' + dataUser.apellidos_personal;

	// TIMEOUT PARA MOSTRAR CONTENIDO 
	$scope.showLoaderMenu = true;
	$timeout(function(){
		$scope.showContentMenu = true;
		$scope.showLoaderMenu = false;
	},2000)

}])
   
.controller('cartCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('cloudCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])  

   
.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 