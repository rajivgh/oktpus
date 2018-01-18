'use strict';
 
angular.module('signUp')
.controller('SignUpController', ['$log', '$http', '$scope', '$state', '$cookies', '$localStorage', '$sessionStorage', '$location', '$anchorScroll', '$window', 'oktpusServiceFactory', '$timeout',
	function ($log, $http, $scope, $state, $cookies, $localStorage, $sessionStorage, $location, $anchorScroll, $window, oktpusServiceFactory,$timeout) {
		
		$scope.$storage = $localStorage;
		
		$scope.emailFormat = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		$scope.errorEmailMsg = "This field is required, with correct email id";
		$scope.errorPassword1Msg = "This field is required";
		$scope.submitted = false;		
		
		$window.scrollTo(0, 0);

		/*********Show hide password***************/

		$scope.inputType = 'password';
		$scope.showtext = false;

		$scope.hideShowPassword = function(){
		    if ($scope.inputType == 'password'){
		      	$scope.inputType = 'text';
		    }
		    else{
		      $scope.inputType = 'password';			
			}  
			$scope.showtext = $scope.showtext ? false : true;
		};

		/**************scroll to top**********************/

		$scope.scrollToTop = function () {
			$location.hash('top');
			$anchorScroll();
		}
		
        /***************************/
		$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			$scope.$storage.previousState = $scope.$storage.currentState;
		}
		

		$scope.hideSignUp = function () {
			var state = $scope.$storage.previousState;
			if('SEARCH' == state.toUpperCase()) {
				$state.go(state, {searchFormType: 'full'});
			}
			else {
				$state.go(state);
			}
		}
		
		$scope.showTnC = function () {
			$state.go('terms');
		}
		
		$scope.showLogIn = function () {
			this.onExit('login');
			$state.go('login');
		}

		$scope.signUpSubmit = function () {
			$scope.submitted = true;
			var password1 = $scope.password1;
			if(!$scope.signUpForm.email.$valid){	
				$scope.errorEmailMsg = "This field is required, with correct email id";
			}			
			if(!$scope.signUpForm.password1.$valid){
				$scope.errorPassword1Msg = "This field is required";
			}			
			$scope.status = 0;
			$scope.message="";
		
			if($scope.signUpForm.$valid){
				var data = {email: $scope.email, password: $scope.password1, password2: $scope.password1, ref:''};
				var url = "http://142.4.215.210:11080/api/user";
				
				oktpusServiceFactory.postWithoutQueryString(data, url, function(response) {
					console.log(response);
					if(response.status) {
						$scope.status = response.status;
						$cookies.put('emailId',$scope.email);
						$cookies.put('userId',response.user_id);
						$cookies.put('isLogin',true);
						$scope.message="Success";						
						$timeout(function () {		  	
							$state.go('search');
						}, 1000);						
						$log.debug("signUpSubmit:success");
					} else {
						$scope.message=response.message;
						$scope.status=response.status;
						$log.debug("signUpSubmit:error");
					}
				});
			}            
        }

        $scope.menuOutClick = function() {
			$scope.menuShow = false;
		}
	}]);
