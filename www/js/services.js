angular.module('app.services', [])

.factory('BlankFactory', [function(){

	var result = {};
	result.ok = function(){
		return "okpues";
	}
	return result;
}])

.service('BlankService', [function(){

}]);