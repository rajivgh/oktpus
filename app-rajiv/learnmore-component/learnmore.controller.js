'use strict';
 
angular.module('learnMore')
.controller('LearnMoreController', ['$http', '$scope','$state', '$window','$localStorage',
	function ($http, $scope, $state, $window,$localStorage) {
		var self = this;
		$scope.$storage = $localStorage;
		$scope.menuShow = false;
		$window.scrollTo(0, 0);
		$scope.onEnter = function() {
			$scope.$storage.currentState = 'learnmore';
			$scope.$storage.nextState = null;
		}
		
		$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			$scope.$storage.previousState = $scope.$storage.currentState;
		}
		
		$scope.hideLearnMore = function () {
			$state.go('home');
		}
		
		$scope.startSearch = function (value) {
		    this.onExit(value);
			$state.go(value, {formType: value});
		}
		
		$scope.showLogIn = function () {
		    this.onExit('login');
			$state.go('login');
		}	
		$scope.showSignUp = function () {
			this.onExit('signup');
			$state.go('signup');
		}
		$scope.menuOutClick = function() {
			$scope.menuShow = false;
		}
		
    }]);
