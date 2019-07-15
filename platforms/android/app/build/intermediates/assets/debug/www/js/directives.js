angular.module('app.directives', [])

.directive('activePageHighlight', ['$rootScope', '$state', function($rootScope, $state){

   return function ($scope, $element, $attr) {
       
     function checkUISref(){
       if ($state.is($attr['uiSref'])){
             $element.addClass('active-page-highlight');
         } else {
             $element.removeClass('active-page-highlight');
         }
     }
     
     checkUISref();
       
     $rootScope.$on('$stateChangeSuccess', function(){
         checkUISref();
     })
   };

}])
.directive('numericOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});