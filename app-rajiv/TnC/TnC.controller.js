'use strict';
 
var myForgotPwd = angular.module('termsConditions');
 
myForgotPwd.controller('TnCController', ['$http', '$scope','$state', '$window',
	function ($http, $scope, $state, $window) {
		var self = this;
		
		$window.scrollTo(0, 0);
		
		$scope.hideTnC = function () {
			$state.go('home');
		}
		
		$scope.startSearch = function () {
		//	this.onExit('search');
			$state.go('search', {searchFormType: 'full'});
		}
		
    }]);
