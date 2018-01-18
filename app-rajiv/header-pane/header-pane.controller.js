'use strict';
 
angular.module('headerPane')
.controller('HeaderController', ['$http', '$scope', '$state','$cookies', '$location', '$localStorage', '$sessionStorage', 'deviceDetector', 'menuListFactory',
	function ($http, $scope, $state, $cookies, $location, $localStorage, $sessionStorage, deviceDetector,menuListFactory) {		
		$scope.$storage = $localStorage;
		$scope.$parent.isLogin = $cookies.get('isLogin');	
		$scope.emailId = $cookies.get('emailId');
		

		/*****************Add aactive class on current url*************************/	
		if($location.path().substring(1) == "settings"){
			$scope.activeSettings = 'active-setting';	
		}else{
			$scope.activeSettings = '';	
		}
		
		$scope.IsVisible = false;
        $scope.ShowHide = function () {
            $scope.IsVisible = $scope.IsVisible ? false : true;
        }

		$scope.navClass = function (page) {
	        $scope.currentRoute = $location.path().substring(1) || '';
	        return page === $scope.currentRoute ? 'active' : '';
	    };

		$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			
			if(undefined == $scope.$storage.currentState) {
				$scope.$storage.currentState = 'home';
			}
			$scope.$storage.previousState = $scope.$storage.currentState;
		}
		var self = this;
		$http.get('menu-list/menu-items.json').then(function(response) {
			self.menu = response.data;			
		});
		
		$scope.showMenu = function () {
			$scope.$parent.isLogin = $cookies.get('isLogin');
			$scope.$parent.menuShow = true;
		}
		
		$scope.showLogIn = function () {
			this.onExit('login');
			$state.go('login');
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
				
		$scope.redirectToUrl = function(path) {			
			this.onExit(path);
			if(path == "search" || path == "wall-of-deals"){
				$state.go(path, {formType: path});
			}else{				
				$state.go(path);	
			}
		} 	
		
		$scope.hideAboutTerms = function(value){
			if(!$scope.$parent.isLogin){
				return (value == "learnmore" || value == "terms" || value == "compare") ? false : true;
			}else{
				return (value == "learnmore" || value == "terms" || value == "logout" || value == "settings" || value == "compare")  ? false : true;
			}
		}	

		$scope.showHome = function () {
			$scope.$parent.isLogin = $cookies.get('isLogin');
			if('true' == $scope.$parent.isLogin || true == $scope.$parent.isLogin) {
				if(undefined != $scope.$storage.currentState && 'search' == $scope.$storage.currentState) {
					$scope.$storage.searchID = undefined;
					this.onExit('search');
					$state.go($scope.$storage.currentState, {}, {reload: true});
				}
				else if(undefined == $scope.$storage.currentState) {
					$scope.$storage.searchID = undefined;
					this.onExit('home');
					$state.go('home');
				}
				else {
					this.onExit('search');
					$state.go('search');
				}
			}
			else {
				this.onExit('home');
				$state.go('home');
			}
		}
    }]);
