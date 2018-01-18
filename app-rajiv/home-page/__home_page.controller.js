'use strict';
 
angular.module('homePage')
.controller('HomePageController', ['$http', '$scope', '$state', '$localStorage', '$sessionStorage', '$window','$cookies','deviceDetector','$timeout', 
	function ($http, $scope, $state, $localStorage, $sessionStorage, $window, $cookies, deviceDetector, $timeout) {
		
		$scope.deviceDetector = deviceDetector;
		$scope.os = $scope.deviceDetector.os;
		$scope.browser = $scope.deviceDetector.browser;
			
		$scope.$storage = $localStorage;		
		$scope.showHomePage = true;
		$scope.anotherModal = true;
		$scope.emptySearchValue = '';
		
		$scope.refinedSearch = false;
		//~ $scope.fullSearch = false;
		
		$window.scrollTo(0, 0);
		
		$scope.tempClassForMenu = "";
		$scope.menuShow = false;
	
		if($cookies.get('modelPopUp')){
			$scope.modelPopUp = false;
		}else{
			$scope.modelPopUp = true;
		}    
		      
        $scope.functionLoad = function () {   
			$scope.modelPopUpLoad = true;
			$timeout(function () {		  	
				$scope.anotherModal = false;
				$scope.popup={	"display":"block"}
				$scope.modelPopUpLoad = false;		     
			}, 3000);
		}
		

		$scope.onClickFunction = function(clicked){
			if(clicked == 'closeButton'){
					$cookies.put('modelPopUp',true);
					$scope.modelPopUp = false;
			}
			$scope.popup={
				"display":"none"
			}						
		}

		function doSomething() {
		    var myCookie = getCookie("MyCookie");

		    if (myCookie == null) {
		        // do cookie doesn't exist stuff;
		    }
		    else {
		        // do cookie exists stuff
		    }
		}


		$scope.onEnter = function() {
			if(undefined == $scope.$storage.previousState) {
				$scope.$storage.previousState = 'home';
			}
			if(undefined == $scope.$storage.currentState) {
				$scope.$storage.currentState = 'home';
			}
			$scope.$storage.currentState = 'home';
			$scope.$storage.nextState = null;
		}
		
		$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			$scope.$storage.previousState = $scope.$storage.currentState;
		}
		
		$scope.$watch('menuShow', function() {
			if($scope.menuShow == true) {
				$scope.tempClassForMenu = "showHideMenu";
			}
			else {
				$scope.tempClassForMenu = "";
			}
		});
		
		$scope.showLearnMore = function () {
			this.onExit('learnmore');
			$state.go('learnmore');
		}
		$scope.showSearch = function (value) {
			this.onExit(value);
			$state.go(value, {formType: value});
		}
		
		$scope.showRefinedSearch = function() {
			$scope.refinedSearch = true;
		}
		
		$scope.searchSubmitKeyword = function(value) {
			if(undefined == $scope.keywordSearchValue || $scope.keywordSearchValue.trim().length == 0) {
				$scope.keywordSearchValue = '';
				$scope.emptySearchValue = 'Please enter some keywords';
			}else{
				this.onExit('search');
				$state.go('search', {searchKeyword: $scope.keywordSearchValue});
			}
		}
		
		$scope.startDictation = function() { 
			if (window.hasOwnProperty('webkitSpeechRecognition')) { 
			  var recognition = new webkitSpeechRecognition(); 
			  recognition.continuous = false;
			  recognition.interimResults = false; 
			  recognition.lang = "en-US";
			  recognition.start();
		 
			  recognition.onresult = function(e) {
				  document.getElementById('transcript').value = e.results[0][0].transcript;
				  recognition.stop();
				  $scope.keywordSearchValue = document.getElementById('transcript').value;
				  $scope.searchSubmitKeyword('searchform');
			  };
		 
			  recognition.onerror = function(e) {
				recognition.stop();
			  } 
			}
		}
		
		$scope.clearSearchText = function() { 			
			$scope.keywordSearchValue = '';
		}

		$scope.menuOutClick = function() {
			$scope.menuShow = false;
		}
		
	}]);
