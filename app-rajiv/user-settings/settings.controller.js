'use strict';
 
angular.module('userSettings')
.controller('UserSettingsController', ['$log', '$http', '$scope', '$state', '$cookies', '$localStorage', '$sessionStorage', '$window', 'oktpusServiceFactory',
	function ($log, $http, $scope, $state, $cookies, $localStorage, $sessionStorage, $window, oktpusServiceFactory) {
		$scope.emailFormat = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		$scope.errorEmailMsg = "This field is required, with correct email id";
		$scope.errorPassword1Msg = "This field is required";
		$scope.errorPassword2Msg = "This field is required";
		$scope.submitted = false;
		$scope.emailId = $cookies.get('emailId');
		$scope.userId = $cookies.get('userId');			
		$scope.isLogin = $cookies.get('isLogin');
		
		$scope.$storage = $localStorage;
		$scope.popupHeight = ($window.innerHeight - 50) +"px";
		
		$scope.tempClassForMenu = "";
		$scope.menuShow = false;
		
		$window.scrollTo(0, 0);
		
		$scope.$watch('menuShow', function() {
			if($scope.menuShow == true) {
				$scope.tempClassForMenu = "showHideMenu";
			}
			else {
				$scope.tempClassForMenu = "";
			}
		});
		
		$scope.onEnter = function() {
			$scope.$storage.currentState = 'settings';
			$scope.$storage.nextState = null;
		}
		
		$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			$scope.$storage.previousState = $scope.$storage.currentState;
		}
		
		$scope.hideSettings = function () {
			$state.go('home');
		}
		
		$scope.backButtonClicked = function() {
			if(undefined == $cookies.get('isLogin') || false == $cookies.get('isLogin')) {
				$scope.$storage.previousState = 'login';
				$scope.$storage.currentState = 'settings';
			}
			else if((true == $cookies.get('isLogin') && undefined == $scope.$storage.previousState)
			|| (true == $cookies.get('isLogin') && $scope.$storage.currentState == $scope.$storage.previousState)) {
				$scope.$storage.previousState = 'search';
				$scope.$storage.currentState = 'settings';
			}
			else if(undefined == $scope.$storage.currentState || undefined == $scope.$storage.previousState) {
				$scope.$storage.previousState = 'login';
				$scope.$storage.currentState = 'settings';
			}
			else {
				
			}
			
			var state = $scope.$storage.previousState;
			
			$scope.onExit(state);
			$state.go(state);
		}
		
		$scope.userSettingsSubmit = function () {
			$scope.submitted = true;
			var matchpassword = true;
			var password1 = $scope.newpassword;
			var password2 = $scope.newpassword2;		
				
			if(!$scope.userSettingsForm.newpassword.$valid){
				$scope.errorPassword1Msg = "This field is required";
			}			
			if(!$scope.userSettingsForm.newpassword2.$valid){
				$scope.errorPassword2Msg = "This field is required";
			}
			
			if(($scope.userSettingsForm.newpassword.$valid && $scope.userSettingsForm.newpassword2.$valid) && (password1 != password2)){
				matchpassword = false;
				$scope.status = 0;
				$scope.message="Passwords not identical";
			}else{
				$scope.status = 0;
				$scope.message="";
			}
			
			
			if($scope.userSettingsForm.$valid && matchpassword){					
				var data = {'new-email': $scope.emailId, 'new-password': $scope.newpassword, 'new-password2': $scope.newpassword2,'userId': $scope.userId};
			//	var url = "http://142.4.215.210:11080/api/user/" + $scope.userId;	
				var url = "https://oktpus.com/api/user/" + $scope.userId;			

				oktpusServiceFactory.postWithoutQueryString(data, url, function(response) {
					
					if(undefined != response.status && 1 == response.status) {
						$scope.status = 1;						
						$scope.message = "Password Changed Successfully";				
						$log.debug("Password Updation:success");
					} 
					else if(undefined != response.status && 0 == response.status) {					
						$scope.status = 0;
						$scope.message = response.message;
						$log.debug("Password Updation:fail");
					}
					else if(undefined != response.status && 0 == response.status && 401 == response.code) {					
						$scope.status = 0;
						$scope.message = response.message;
						$log.debug("Password Updation:fail");
						$scope.onExit("login");
						$state.go('login');
					}
					$scope.newpassword = '';
					$scope.newpassword2 = '';
					$scope.errorPassword1Msg = '';
					$scope.errorPassword2Msg = '';
				});            
			}   
        }
        
        $scope.menuOutClick = function() {
			$scope.menuShow = false;
		}
		
	}]);
