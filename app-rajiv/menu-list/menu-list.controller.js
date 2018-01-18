'use strict';
 
angular.module('menuList')
.controller('MenuListController', ['$log', '$http', '$scope', '$state','$cookies', '$localStorage', '$sessionStorage', 'menuListFactory',
	function ($log, $http, $scope, $state, $cookies, $localStorage, $sessionStorage, menuListFactory) {		
		
		$scope.emailId = $cookies.get('emailId');			
		$scope.$storage = $localStorage;

		$scope.onEnter = function() {
			//$scope.$storage.currentState = 'menu';
			$scope.$storage.nextState = null;
		}
		
		$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			$scope.$storage.previousState = $scope.$storage.currentState;
		}
		
		var self = this;
		$http.get('menu-list/menu-items.json').then(function(response) {
			self.menu = response.data;			
		});
		
		$scope.getMyCtrlScope = function() {
			$log.debug("MenuListActionController");
			return $scope;   
		}
    
		$scope.hideMenu = function () {
			$scope.$parent.menuShow = false;
			//~ this.onExit('home');
			//~ $state.go('home', {name: "ashish"});
		}
		
		$scope.showSignUp = function () {
			$scope.hideMenu();
			this.onExit('signup');
			$state.go('signup');
		}
		
		$scope.showLogIn = function () {
			$scope.hideMenu();
			this.onExit('login');
			$state.go('login');
		}
		
		$scope.showLearnMore = function () {
			$scope.hideMenu();
			this.onExit('learnmore');
			$state.go('learnmore');
		}
		
		$scope.showTermsConditions = function () {
			/*if($scope.$storage.currentState == 'terms') {
				$scope.hideMenu();
			}
			else {*/
				$scope.hideMenu();
				this.onExit('terms');
				$state.go('terms');
			//}
		}
		
		$scope.showSearch = function (value) {
			$scope.hideMenu();
			if($scope.$storage.currentState == value && $scope.$storage.searchID == undefined) {				
				this.onExit(value);
				$state.go(value, {formType: value});
			}
			else if($scope.$storage.currentState == value && $scope.$storage.searchID != undefined) {				
				$scope.$storage.searchID = undefined;
				this.onExit(value);
				$state.go($state.current, {}, {reload: true, formType: value});
			}
			else { 				
				$scope.$storage.searchID = undefined;
				this.onExit(value);
				$state.go(value, {formType: value});
			}
		}
		
		$scope.showSettings = function () {
			if($scope.$storage.currentState == 'settings') {
				$scope.hideMenu();
			}
			else {
				this.onExit('settings');
				$state.go('settings', {name: "ashish"});
			}
		}
		$scope.showSavedSearch = function () {
			if($scope.$storage.currentState == 'savedsearch') {
				$scope.hideMenu();
			}
			else {
				this.onExit('savedsearch');		
				$state.go('savedsearch');
			}	
		}
		$scope.showGarage = function () {
			if($scope.$storage.currentState == 'garage') {
				$scope.hideMenu();
			}
			else {
				this.onExit('garage');		
				$state.go('garage');
			}	
		}
		
		$scope.showNotifications = function () {
			if($scope.$storage.currentState == 'notification') {
				$scope.hideMenu();
			}
			else {
				this.onExit('notification');			
				$state.go('notification');
			}
		}
		$scope.showLogout = function () {
			menuListFactory.Logout(function(response, status) {
				if(status) {
					$scope.onExit('logout');
					$state.go('logout');
				} else {
					$log.debug("Logout:error");
					$log.debug(response);
				}
			});
		}
		
		$scope.showCompare = function(){
			$scope.hideMenu();			
			this.onExit('compare');		
			$state.go('compare');			
		}
		
		$scope.showWMCW = function(){
			$scope.hideMenu();			
			this.onExit('wmcw');		
			$state.go('wmcw');			
		}
    }]);
