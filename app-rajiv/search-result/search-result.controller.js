'use strict';

angular.module('searchForm')
.controller('SearchResultController', ['$rootScope', '$scope', '$state', '$stateParams', '$window', '$localStorage', '$sessionStorage', 'searchResultFactory',
	function ($rootScope, $scope, $state, $stateParams, $window, $localStorage, $sessionStorage, searchResultFactory) {
		$scope.$storage = $localStorage;
		
		var domainID = 1;
		$scope.pageNumber = 1;
		$scope.counter = 0;
		$scope.perPageShow = 6;
		
		/*$scope.requestData = $stateParams.requestData;
		$scope.totalCount = $stateParams.totalCount;
		$scope.attributeLabel = $stateParams.attributeLabel;
		$scope.userDisplayFormat = $stateParams.userDisplayFormat;*/
		
		$scope.tempClassForMenu = "";
		$scope.menuShow = false;
		
		$scope.$watch('menuShow', function() {
			if($scope.menuShow == true) {
				$scope.tempClassForMenu = "showHideMenu";
			}
			else {
				$scope.tempClassForMenu = "";
			}
		});
		
		$scope.requestData = $scope.$storage.search_request;
		$scope.totalCount = $scope.$storage.total_count;
		$scope.attributeLabel = $scope.$storage.attribute_label;
		$scope.userDisplayFormat = $scope.$storage.user_display_format;
		
		$scope.scrollLoadData = new searchResultFactory(domainID, $scope.perPageShow, $scope.requestData);
		
		$scope.busy = $scope.scrollLoadData.busy;
		
		$scope.searchResult = [];
				
		$scope.onEnter = function() {
			$scope.$storage.currentState = 'show';
			$scope.$storage.nextState = null;
		}
		
		$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			$scope.$storage.previousState = $scope.$storage.currentState;
		}
		
		$scope.hideSearchPage = function() {
			this.onExit('search');
			$state.go('search');
		}
				
		$scope.loadMore = function() {
			if($scope.totalCount > 0 && $scope.counter < $scope.totalCount) {
				$scope.scrollLoadData.nextPage($scope.pageNumber, function(response) {
					$scope.searchResult = $scope.searchResult.concat(response.result.search_result);
					$scope.busy = $scope.scrollLoadData.busy;
					$scope.counter = $scope.counter + $scope.perPageShow;
					$scope.pageNumber++;
				});
			}
		}				
	}]);
