'use strict'

angular.module( 'disableElement', ['ng'])
.directive('disableElement', function() {
	return {
		restrict: 'A', 
        scope: {
            disabled: '@'
        },
        link: function (scope, element, attrs) {
			scope.$parent.$watch(attrs.disableElement, function (newVal) {
				if (newVal) {
                    $(element).css('pointerEvents', 'none');
                }
                else {
                    $(element).css('pointerEvents', 'all');
                }
            });
        }
    }
});
