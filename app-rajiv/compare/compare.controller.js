'use strict';
 
angular.module('compare')
.controller('CompareController', ['$log', '$scope', '$state','$cookies', '$localStorage', '$window', '$filter', 'oktpusServiceFactory', 
	function ($log, $scope, $state, $cookies, $localStorage, $window, $filter, oktpusServiceFactory) {
		$scope.compareCars = [];		 
		$scope.result = [];	
		$scope.makeList = [];
		$scope.modelList = [];
		$scope.productResult = [];
		$scope.hideFeatureLables = false;
		$scope.showFeatureLables = false;
		$scope.$storage = $localStorage;
		$scope.totalPortion = 4; 
		$scope.selectedCarCount = 0;
		$scope.domainID = 1;
		$scope.isModelDisable = true;
		$scope.chooseMake = "Choose Make";
		$scope.chooseModel = "Choose Model";
		$scope.isMessage = false;
		$scope.message = '';	
		$scope.isLoading = false ;
		
		$window.scrollTo(0, 0);
		
		$scope.prepareRequestAndSendData = function(makeGroups, makeIntegerRepresentationValue, modelIntegerRepresentationValue) {
			var requestBodyData = {'attribute[city][must_have]':1,'attribute[country][must_have]':1,
				'attribute[make][must_have]':1,'attribute[model][must_have]':1,'attribute[price][must_have]':1, 
				'attribute[year][must_have]':1, 'attribute[kilometers][must_have]':1,'attribute[body][must_have]':1,
				'attribute[transmission][must_have]':1,'attribute[colour][must_have]':1,'attribute[doors][must_have]':1,
				'attribute[image0][must_have]':1,'attribute[below_market_average_percent][must_have]':1,'attribute[user_type][must_have]':1,
				'attribute[drivetrain][must_have]':1,'attribute[price][display_format]':'CAD','attribute[price][value][min]':'',
				'attribute[price][value][max]':'','attribute[kilometers][display_format]':'kilometers','attribute[kilometers][value][min]':'',
				'attribute[kilometers][value][max]':'','attribute[year][value][min]':'','attribute[year][value][max]':'',
				'attribute[below_market_average_percent][value][min]':'','attribute[below_market_average_percent][value][max]':'',
				'enable_notification':0,'save_submit':'true','sort[post_date]':'post_date desc'};	
				
				if(makeGroups == 0){
					$.extend(true, requestBodyData, {'attribute[make][values][value][]':makeIntegerRepresentationValue});
				}
				if(makeGroups == 1){
					$.extend(true, requestBodyData, {'attribute[make][values][group][]':makeIntegerRepresentationValue});					
				}
				
				if(modelIntegerRepresentationValue != ''){
					$.extend(true, requestBodyData, {'attribute[model][values][value][]':modelIntegerRepresentationValue});
				}
				
				var url ="https://oktpus.com/api/item?domain_id="+$scope.domainID;
				
				oktpusServiceFactory.postWithoutQueryString(requestBodyData, url, function(response) {
					if(response.status == 1){
						$scope.productResult = response.result.search_result;
						var totalCount = response.result.total_count; 						
						if(totalCount > 0){
							for (var i = 0; i < totalCount; i++) {
								var index = $scope.compareCars.indexOf($filter('filter')($scope.compareCars, { product_id : $scope.productResult[i]['product_id'] }, true)[0] );
								if(index == -1){
									$scope.chooseModel = "Choose Model";
									$scope.chooseMake = "Choose Make"; 
									$scope.compareCars.push({'product_id' : $scope.productResult[i]['product_id'] , 'url': $scope.productResult[i]['href_url'], 'image': $scope.productResult[i]['image0'], 'title': $scope.productResult[i]['item_title'], 'price': $scope.productResult[i]['price_list']['CAD']});
									$scope.selectedCarCount = $scope.selectedCarCount + 1;	
									$cookies.putObject('compareCars',$scope.compareCars);
									$cookies.put('selectedCarCount',$scope.selectedCarCount);
									$scope.result.push($scope.productResult[i]); 
									$scope.modelList = [];
									$scope.isModelDisable = true;
									$scope.isLoading = false ;
									break;								
								}
							}
						}else{
							$scope.message = "No cars found, try with different Combination."
							$scope.isMessage = true;
							$scope.isLoading = false ;
							$scope.isModelDisable = true;
						}
					}			
				});					
			}
		
		$scope.getMakeList = function(){
			$scope.isMessage = false;
			var url = " https://oktpus.com/api/attribute?domain_id="+$scope.domainID;
			oktpusServiceFactory.getWithoutQueryString(url, function(response) {
				if(undefined != response.status && 1 == response.status) {
					$log.debug("GetCompare:success");
					$scope.makeList = response.attribute_value.make;					
				}else{
					$log.debug("GetCompare:error");
				}
			});
		}
		$scope.getModelList = function(selectedMake){
			$scope.isMessage = false;
			var temp = [];
			temp = selectedMake.split(',');			
			var url = 'https://oktpus.com/get/' + $scope.domainID + '/attribute/4/by/attribute_values/';	
			url += (temp[1] == 0) ?  temp[0] : '0/groups/'+ temp[2];
			$scope.makeIntegerRepresentation = temp[2];
			$scope.groups = temp[1];
			oktpusServiceFactory.getWithoutQueryString(url, function(response) {
				if(undefined != response.status && 1 == response.status) {
					$log.debug("GetCompare:success");
					$scope.chooseModel = "Choose Model";
					$scope.modelList = response.result;						
					$scope.isModelDisable = ($scope.modelList.length > 0) ? false : true;					
					$scope.chooseModel = $scope.isModelDisable ?  "No model found for make" : "Choose Model" ;	
					if($scope.isModelDisable){
						$scope.message = '';
						$scope.isMessage = false;
						$scope.prepareRequestAndSendData($scope.groups,$scope.makeIntegerRepresentation,'');
					}else{
						$scope.isLoading = false ;
					}
					
				}else{
					$log.debug("GetCompare:error");
					$scope.isLoading = false ;
				}
			});
		}
		
		$scope.onChangeMake = function(value,index){
		  $scope.isLoading = true ;
		  $scope.selectedColumn = index;
		  $scope.getModelList(value);			
		}
		
		$scope.onChangeModel = function(modelIntegerRepresentation){
			$scope.isLoading = true ;
			$scope.message = '';
			$scope.prepareRequestAndSendData($scope.groups,$scope.makeIntegerRepresentation,modelIntegerRepresentation);				
		}
		
		$scope.settingCompareCarsCookieValuesToVariables = function(){
			if(($cookies.get('selectedCarCount') !== undefined && $cookies.get('selectedCarCount') !== null) 
			&& ($cookies.getObject('compareCars') !== undefined && $cookies.getObject('compareCars') !== null) )
			{
				$scope.selectedCarCount = parseInt($cookies.get('selectedCarCount'));
				$scope.compareCars = $cookies.getObject('compareCars'); 				
			}
			if($scope.selectedCarCount < 4){
				$scope.getMakeList();
			}
		}
		
		//This below function is called for the first time of page loading
		$scope.settingCompareCarsCookieValuesToVariables();	
		
		$scope.onEnter = function() {
			$scope.$storage.currentState = 'compare';
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
		
		$scope.backButtonClicked = function() {		
			var state = $scope.$storage.previousState;
			$scope.onExit(state);
			$state.go(state);
		}
		
		$scope.menuOutClick = function() {
			$scope.menuShow = false;
		}
		
		$scope.loadCompareData = function(){
			var product_ids = [];
			angular.forEach($scope.compareCars, function(value, key) {
				product_ids.push(value.product_id);
			});				
			if(product_ids.length >0){
				var url = "https://www.oktpus.com/api/item/"+product_ids.toString();
				oktpusServiceFactory.getWithoutQueryString(url, function(response) {
					if(undefined != response.status && 1 == response.status) {
						$log.debug("GetCompare:success");
						$scope.result = response.result;	
					}else{
						$log.debug("GetCompare:error");
					}
				});
			}			
		}

		$scope.hideFeatureLableBlock = function(){
			$scope.hideFeatureLables = true;
			$scope.showFeatureLables = true;
		}
		$scope.showFeatureLableBlock = function(){
			$scope.hideFeatureLables = false;
			$scope.showFeatureLables = false;
		}
		
		$scope.getRemainingPortion = function() {
			var selectedCars = $scope.compareCars.length ;			
			return new Array($scope.totalPortion-selectedCars);
		}
		$scope.removeProductIdFromCompareList = function(product_id){
			var index = $scope.compareCars.indexOf($filter('filter')($scope.compareCars, { product_id : product_id }, true)[0]);
			$scope.compareCars.splice(index,1);  		
			$cookies.putObject('compareCars',$scope.compareCars);	
			$scope.selectedCarCount = $scope.selectedCarCount - 1; 
			$cookies.put('selectedCarCount',$scope.selectedCarCount);
			var index = $scope.result.indexOf($filter('filter')($scope.result, { product_id : product_id }, true)[0] );
			$scope.result.splice(index,1);  
			$scope.getMakeList();
		}
		
		$scope.removeAllCompareCars = function(){
			$scope.selectedCarCount = 0;
			$scope.compareCars = [];
			$scope.result = [];
			$cookies.remove("selectedCarCount");
			$cookies.remove("compareCars");		
			$scope.getMakeList();
		}		
		/*
		$scope.$watch('selectedMake', function() {
			console.log("In watch");
		});		
		*/
}]);
