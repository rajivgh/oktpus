'use strict';
 
angular.module('logIn')
.controller('LogInController', ['$log', '$http', '$scope', '$state', '$stateParams', '$cookies', '$localStorage', '$sessionStorage', '$window', 'oktpusServiceFactory','$timeout',
	function ($log, $http, $scope, $state, $stateParams, $cookies, $localStorage, $sessionStorage, $window, oktpusServiceFactory,$timeout) {
		
		$scope.emailFormat = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		$scope.errorEmailMsg = "This field is required, with correct email id";
		$scope.errorPasswordMsg = "This field is required";
		$scope.submitted = false;		
		
		$scope.$storage = $localStorage;
		
		$window.scrollTo(0, 0);
		 
		$scope.hideLogin = function () {
			var state = $scope.$storage.previousState;
			if('SEARCH' == state.toUpperCase()) {
				$state.go(state, {searchFormType: 'full'});
			}
			else {
				$state.go(state);
			}
		}
				
		$scope.showForgotPwd = function () {
			$state.go('forgotpwd');
		}
		
		$scope.showSignUp = function () {
			$state.go('signup');
		}
		
		$scope.loginSubmit = function () {
			var rememberMe = 1;
			$scope.submitted = true;
			
			if(!$scope.loginForm.email.$valid){	
				$scope.errorEmailMsg = "This field is required, with correct email id";
			}
			if(!$scope.loginForm.password.$valid){
				$scope.errorPasswordMsg = "This field is required";
			}
			$scope.status = 0;
			$scope.message="";
			
			if($scope.loginForm.$valid){		
				var data = {email: $scope.email, password: $scope.password, rememberme: rememberMe};
				//var url = "http://142.4.215.210:11080/api/user/login";
				var url = "https://oktpus.com/api/user/login";
				
				oktpusServiceFactory.postWithoutQueryString(data, url, function(response) {					
					if(response.status) {		
						$scope.status = response.status;				
						$cookies.put('emailId',$scope.email);
						$cookies.put('userId',response.user_id);
						$cookies.put('isLogin',true);		
						$scope.message="Success";		
						if($stateParams.action == 'UpdateFlag'){
							$scope.updateFlagAction(response.user_id);		
						}													
						if($state.previous != undefined){	
							$timeout(function () {	$state.go($state.previous.url); }, 1000);	
						}else{
							$timeout(function () {	$state.go('search'); }, 1000);	
						}                    
					} else {
						 $scope.message=response.message;
						 $scope.status=status;					
						 $log.debug("loginSubmit:error");
					}
				});
			}
        }

        $scope.menuOutClick = function() {
			$scope.menuShow = false;
		}
		
		$scope.updateFlagAction = function (user_id) {
			var data = {'product_id': $stateParams.product_id, 'flag_name':$stateParams.flag_name, 'flag_action':$stateParams.flag_action};		
			var url = "https://oktpus.com/api/user/"+user_id+"/product/flag";
			oktpusServiceFactory.postWithoutQueryString(data, url, function(response) {	
				if(response.status == 1){
					console.log("Success");
				}else{
					console.log("Failure");
				}				
			});	
		}
	}]);
