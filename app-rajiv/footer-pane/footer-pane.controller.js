'use strict';
 
angular.module('footerPane')
.controller('FooterController', ['$http', '$scope', '$state', '$window','$localStorage', '$sessionStorage',
	function ($http, $scope, $state, $window, $localStorage, $sessionStorage) {
		$scope.popupHeight = ($window.innerHeight - 100) +"px";
		
		$scope.$storage = $localStorage;
		
		$scope.onEnter = function(value) {
			$scope.$storage.currentState = value;
			$scope.$storage.nextState = null;
		}
		
		$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			$scope.$storage.previousState = $scope.$storage.currentState;
		}
		
		$scope.footerItemContentPage = function (value) {
			$scope.onExit(value);
			$scope.$storage.currentState = value;
			$window.scrollTo(0, 0);
			$state.go(value);
		}
		
		$scope.menuOutClick = function() {
			$scope.menuShow = false;
		}
		
    }]);
