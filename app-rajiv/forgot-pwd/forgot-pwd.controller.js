'use strict';
 
angular.module('forgotPwd')
.controller('ForgotPwdController', ['$log', '$http', '$scope', '$state', '$localStorage', '$sessionStorage', '$window', 'oktpusServiceFactory',
	function ($log, $http, $scope, $state, $localStorage, $sessionStorage, $window, oktpusServiceFactory) {		
		
		$scope.emailFormat = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		$scope.errorEmailMsg = "This field is required, with correct email id";
		$scope.submitted = false;		
		
		$scope.$storage = $localStorage;
		
		$window.scrollTo(0, 0);
		
		$scope.hideForgotPwd = function () {
			var state = $scope.$storage.previousState;
			if('SEARCH' == state.toUpperCase()) {
				$state.go(state, {searchFormType: 'full'});
			}
			else {
				$state.go(state);
			}
		}
		$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			$scope.$storage.previousState = $scope.$storage.currentState;
		}
		$scope.showForgotPwd = function () {
			$state.go('forgotpwd');
		}
		
		$scope.showSignUp = function () {
			this.onExit('signup');
			$state.go('signup');
		}
		$scope.showLogIn = function () {
			this.onExit('login');
			$state.go('login');
		}

		$scope.forgotPwdSubmit = function () {
			$scope.submitted = true;
			
			if(!$scope.forgotPwdForm.email.$valid){	
				$scope.errorEmailMsg = "This field is required, with correct email id";
			}
			if($scope.forgotPwdForm.$valid){
				var data = {email: $scope.email};
				var url = "http://142.4.215.210:11080/api/user/forgot_password";
				
				oktpusServiceFactory.postWithoutQueryString(data, url, function(response) {
					if(response.status) {
						$scope.status = 1;						
						$scope.message = "The email was sent.";					
						$log.debug("forgotPwdFactory:success");
					} else {					
						$scope.status = 0;
						$scope.message = response.message;
						$log.debug("forgotPwdFactory:error");
					}
					$scope.errorEmailMsg = "";
				});
			}
        }
	}]);
