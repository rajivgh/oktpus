'use strict';
 
angular.module('savedSearch')
.controller('SavedSearchController', ['$log', '$scope', '$state', '$cookies', '$localStorage', '$window', '$sessionStorage', 'savedSearchFactory', 
	function ($log, $scope, $state, $cookies, $localStorage, $window, $sessionStorage, savedSearchFactory) {

		$scope.popupHeight = ($window.innerHeight - 50) +"px";
		$scope.$storage = $localStorage;		
		$scope.busy = true;	
		$scope.isLogin = $cookies.get('isLogin');
		
		//$scope.isResult = true;
		
		//$scope.result = [];

		$scope.showDetails = false;
		$scope.id;
		
		$scope.domain_id = 1;
		
		$scope.IsVisible = false;
		
        $scope.$storage = $localStorage;
		
		$scope.message = null;
		$scope.popupType = null;
		
		$scope.tempClassForMenu = "";
		$scope.menuShow = false;
		
		$scope.onEnter = function() {
			$scope.$storage.searchID = undefined;
			$scope.$storage.currentState = 'savedsearch';
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
		
		$scope.getParsedLabel = function(search_id, value) {
            var label = '', tempLabel = '';
            var flag1 = false, flag2 = false;
            
            angular.forEach(value, function(value1, key1) {                
                if(key1 == 'make') {					
                    label = value1.values[0].value;
                    flag1 = true;
                    return;
                }
                else {
                    if(flag2 == false) {
                        if(key1 == 'price' || key1 == 'year' || key1 == 'kilometers' || key1 == 'below_market_average_percent' || key1 == 'image0') {
							if(key1 == 'price'){
								var min = value1.min;
								if(min === ""){
									min = 0;
								}
								
								tempLabel = value1.display_format+"$ "+min+" to "+value1.display_format+"$ "+value1.max;
							}else if(key1 == 'year'){
								var min = value1.min;
								if((min === "") || (min === "0")){
									min = 1980;
								}
								  tempLabel = min+" and lower to "+value1.max;
							}else if(key1 == 'kilometers'){
								var min = value1.min;
								var display_format = value1.display_format;
								if(min === ""){
									min = 0;
								}
								if(display_format != undefined){
								if(display_format.match("kilometers")) {
									display_format = display_format.replace("kilometers", "km");			 
								} else if(display_format.match("miles")){
									display_format = display_format.replace("miles", "mi");
								}
								}else{
									display_format = "km/mi";
								}								
								tempLabel = min+" "+ display_format+" to "+value1.max+" "+ display_format;
								
							}else if(key1 == 'below_market_average_percent') {
								tempLabel = 'Below market by '+value1.min+'% to '+value1.max+'%';								
							}else if(key1 == 'image0') {
								tempLabel = 'Include cars without images';								
							}
                        }
                        else {
                            tempLabel = value1.values[0].value;
                            flag2 = true;
                        }
                    }
                }
            });
            
            if(flag1 == false) {
                label = tempLabel;
            }
            else if(flag1 == true) {
                label = label;
            }
            else if(tempLabel == ''){
                label = search_id;
            }
            
            return label;
        }
		
		$scope.backButtonClicked = function() {
			if(undefined == $cookies.get('isLogin') || false == $cookies.get('isLogin')) {
				$scope.$storage.previousState = 'login';
				$scope.$storage.currentState = 'savedsearch';
			}
			else if((true == $cookies.get('isLogin') && undefined == $scope.$storage.previousState)
			|| (true == $cookies.get('isLogin') && $scope.$storage.currentState == $scope.$storage.previousState)) {
				$scope.$storage.previousState = 'search';
				$scope.$storage.currentState = 'savedsearch';
			}
			else if(undefined == $scope.$storage.currentState || undefined == $scope.$storage.previousState) {
				$scope.$storage.previousState = 'login';
				$scope.$storage.currentState = 'savedsearch';
			}
			else {
				
			}
			
			var state = $scope.$storage.previousState;
			
			$scope.onExit(state);
			$state.go(state);
		}
		
		$scope.loadSavedSearchList = function() {	
			$scope.result = [];
			$scope.busy = true;			
			savedSearchFactory.GetSearchList(function(response) {
                if(undefined != response.status && 1 == response.status) {
                	//~ if(response.result.length > 0){
						//~ $scope.isResult = true;
					//~ }
					//~ else {
						//~ $scope.isResult = false;
					//~ }
									
					$scope.result = response.result;	
					$scope.busy = false;
                  } else if(0 == response.status && 401 == response.code) {
                    $log.debug("GetSearchList:error");
                    $scope.onExit("login");
                    $state.go('login');
                }
			});
		}
		
		$scope.showSearchDetails = function(value){		
			if($scope.showDetails) {
				if($scope.id == value) {
					$scope.showDetails = false;
					$scope.IsVisible = false;
					$scope.transparent = {
				                      "opacity" : "1"
			        }
				}
				else {
					$scope.id = value;
					$scope.IsVisible = false;
				}		
			}
			else {
				$scope.id = value;
				$scope.showDetails = true;
				$scope.transparent = {
				                  "opacity" : "0.4"
			    }
			}
			
		}		
		
		$scope.showPopup = function(value, status_id) {
			if(1 == value) {
				$scope.popupType = 1;
				if(status_id == '1') {
					$scope.message = '<p class="start-stop-notification">Stop receiving email notifications ? </p>';
				}
				else if(status_id == '2') {
					$scope.message = '<p class="start-stop-notification">Start receiving email notifications ? </p>';
				}
			}
			else if(2 == value) {
				$scope.popupType = 2;
				$scope.message = '<p class="delete-message">Are you sure you want to remove this search? </p><p  class="stop-message"> You will stop receiving email alerts for this search.</p>';
			}
			$scope.ShowHide();
		}
		
		$scope.hidePopup = function(value, search_id, status_id) {
			if(1 == value) {
				angular.forEach($scope.result, function(value1, key1) {
					if(value1.id == search_id) {
						if(status_id == '1') {
							value1.status_id = '2';
						}
						else if(status_id == '2') {
							value1.status_id = '1';
						}
					}
				});
			}
			else if(2 == value) {
				
			}
			$scope.Hide();
		}
		
		$scope.okClickedPopup = function(value1, value2, value3, value4) {
			$scope.Hide();
			if(1 == value1) {
				$scope.receiveNotificationChanges(value2, value3, value4);
			}
			else if(2 == value1) {
				$scope.deleteSavedSearch(value2, value3);				
			}
		}
		
		$scope.receiveNotificationChanges = function(search_id, value, status_id) {
			var savedSearchData = value.serialized_values.attribute;
			
			var data = $scope.prepareSavedSearchData(savedSearchData);
			
			if(status_id == '1') {
				$.extend(true, data, {'enable_notification':0});
			}
			else if(status_id == '2') {
				$.extend(true, data, {'enable_notification':1});
			}
			
			savedSearchFactory.UpdateSavedSearch($scope.domain_id, search_id, data, function(response) {
                if(undefined != response.status && 1 == response.status) {
					savedSearchFactory.GetSearchList(function(response) {
						if(response.status) {
							$scope.result = response.result;
						} else {
							$log.debug("UpdateSavedSearch:notification update error");
						}
					});
				} else if(0 == response.status && 401 == response.code) {
                    $log.debug("notification update:error");
                    $scope.onExit("login");
                    $state.go('login');
                }
			});
		}
		
		$scope.deleteSavedSearch = function(search_id, value) {
			var savedSearchData = value.serialized_values.attribute;
			
			var data = $scope.prepareSavedSearchData(savedSearchData);
			
			$.extend(true, data, {'disable_search':1});
			
			savedSearchFactory.UpdateSavedSearch($scope.domain_id, search_id, data, function(response) {
                if(undefined != response.status && 1 == response.status) {
					savedSearchFactory.GetSearchList(function(response) {
						if(response.status) {
							$scope.showSearchDetails(search_id);
							$scope.result = response.result;							
						} else {
							$log.debug("UpdateSavedSearch:disable search error");
							$log.debug(response);
						}
					});
				} else if(0 == response.status && 401 == response.code) {
                    $log.debug("disable search:error");
                    $scope.onExit("login");
                    $state.go('login');
                }
			});
		}
		
		$scope.prepareSavedSearchData = function(savedSearchData) {
			var data = {'attribute[city][must_have]':1, 'attribute[country][must_have]':1, 'attribute[make][must_have]':1, 
			'attribute[model][must_have]':1, 'attribute[price][must_have]':1, 'attribute[year][must_have]':1, 
			'attribute[kilometers][must_have]':1, 'attribute[body][must_have]':1,'attribute[transmission][must_have]':1, 
			'attribute[colour][must_have]':1, 'attribute[doors][must_have]':1, 'attribute[image0][must_have]':1,
			'attribute[below_market_average_percent][must_have]':1, 'attribute[user_type][must_have]':1, 'attribute[drivetrain][must_have]':1};
			
			var tempCity = [];
			var tempCountry = [];
			var tempMakeValue = [];
			var tempMakeGroup = [];
			var tempModel = [];
			var tempBody = [];
			var tempTransmission = [];
			var tempColour = [];
			var tempUserType = [];
			var tempDoors = [];
			var tempDrivetrain = [];
			
			var tempPriceMin = null;
			var tempPriceMax = null;
			var tempKilometersMin = null;
			var tempKilometersMax = null;
			var tempYearMin = null;
			var tempYearMax = null;
			var tempBelowMarketMin = null;
			var tempBelowMarketMax = null;
			
			var tempCheckCarsWOImage = null;
			
			angular.forEach(savedSearchData, function(value, key) {
				switch(key.toUpperCase()) {
					case 'CITY':
						angular.forEach(value.values, function(value1, key1) {
							tempCity.push(value1.id);
						}); 
						break;
					case 'COUNTRY':
						angular.forEach(value.values, function(value1, key1) {
							tempCountry.push(value1.id);
						}); 
						break;
					case 'MAKE':
						angular.forEach(value.values, function(value1, key1) {
							if(value1.is_group == 0) {
								tempMakeValue.push(value1.id);
							}
							else if(value1.is_group == 1) {
								tempMakeGroup.push(value1.id);
							}
						}); 
						break;
					case 'MODEL':
						angular.forEach(value.values, function(value1, key1) {
							tempModel.push(value1.id);
						});                                          
						break;
					case 'PRICE':
						tempPriceMin = value.min;
						tempPriceMax = value.max;
						break;
					case 'YEAR':
						tempYearMin = value.min;
						tempYearMax = value.max;                                           
						break;
					case 'KILOMETERS':
						tempKilometersMin = value.min;
						tempKilometersMax = value.max;
						break;
					case 'BODY':
						angular.forEach(value.values, function(value1, key1) {
							tempBody.push(value1.id);
						});                                         
						break;
					case 'TRANSMISSION':
						angular.forEach(value.values, function(value1, key1) {
							tempTransmission.push(value1.id);
						});                                      
						break;
					case 'COLOUR':
						angular.forEach(value.values, function(value1, key1) {
							tempColour.push(value1.id);
						});                                            
						break;
					case 'USER_TYPE':
						angular.forEach(value.values, function(value1, key1) {
							tempUserType.push(value1.id);
						});                                            
						break;
					case 'DOORS':
						angular.forEach(value.values, function(value1, key1) {
							tempDoors.push(value1.id);
						});                                            
						break;
					case 'DRIVETRAIN':
						angular.forEach(value.values, function(value1, key1) {
							tempDrivetrain.push(value1.id);
						});                                            
						break;
					case 'BELOW_MARKET_AVERAGE_PERCENT':
						tempBelowMarketMin = value.min;
						tempBelowMarketMax = value.max;                                           
						break;
					case 'IMAGE0':
						tempCheckCarsWOImage = 1;
					default:
				}
			});
			
			if(tempCity.length) {
				$.extend(true, data, {'attribute[city][values][value][]':tempCity});
			}
			if(tempCountry.length) {
				$.extend(true, data, {'attribute[country][values][value][]':tempCountry});
			}
			if(tempMakeValue.length) {
				$.extend(true, data, {'attribute[make][values][value][]':tempMakeValue});
			}
			if(tempMakeGroup.length) {
				$.extend(true, data, {'attribute[make][values][group][]':tempMakeGroup});
			}
			if(tempModel.length) {
				$.extend(true, data, {'attribute[model][values][value][]':tempModel});
			}
			if(tempBody.length) {
				$.extend(true, data, {'attribute[body][values][group][]':tempBody});
			}
			if(tempTransmission.length) {
				$.extend(true, data, {'attribute[transmission][values][group][]':tempTransmission});
			}
			if(tempColour.length) {
				$.extend(true, data, {'attribute[colour][values][group][]':tempColour});
			}
			if(tempDoors.length) {
				$.extend(true, data, {'attribute[doors][values][group][]':tempDoors});
			}
			if(tempDrivetrain.length) {
				$.extend(true, data, {'attribute[drivetrain][values][group][]':tempDrivetrain});
			}
			if(tempPriceMin != null) {
				$.extend(true, data, {'attribute[price][value][min]':tempPriceMin});
			}
			if(tempPriceMax != null) {
				$.extend(true, data, {'attribute[price][value][max]':tempPriceMax});
			}
			if(tempYearMin != null) {
				$.extend(true, data, {'attribute[year][value][min]':tempYearMin});
			}
			if(tempYearMax != null) {
				$.extend(true, data, {'attribute[year][value][max]':tempYearMax});
			}
			if(tempKilometersMin != null) {
				$.extend(true, data, {'attribute[kilometers][value][min]':tempKilometersMin});
			}
			if(tempKilometersMax != null) {
				$.extend(true, data, {'attribute[kilometers][value][max]':tempKilometersMax});
			}
			if(tempUserType.length) {
				$.extend(true, data, {'attribute[user_type][values][value][]':tempUserType});
			}
			if(tempBelowMarketMin != null) {
				$.extend(true, data, {'attribute[below_market_average_percent][value][min]':tempKilometersMin});
			}
			if(tempBelowMarketMax != null) {
				$.extend(true, data, {'attribute[below_market_average_percent][value][max]':tempKilometersMax});
			}
			if(tempCheckCarsWOImage != null) {
				$.extend(true, data, {'attribute[image0][values][value][]':tempCheckCarsWOImage});
			}
			return data;
		}
		
		$scope.openSavedSearch = function(searchId) {
			savedSearchFactory.OpenSavedSearch(searchId, function(response) {				
                if(undefined != response.status && 1 == response.status) {
					$scope.onExit("search", {searchFormType: 'full'});
					$scope.$storage.searchID = response.result.id;
					$state.go('search', {searchID:response.result.id, savedSearchData: response.result.serialized_values.attribute, savedSearchValuesCount: response.result.search_values, notificationStatus: response.result.status_id});		
				} else if(0 == response.status && 401 == response.code) {
                    $log.debug("openSavedSearch:error");
                    $scope.onExit("login");
                    $state.go('login');
                }
			});
		}

		$scope.ShowHide = function () {
             $scope.IsVisible = $scope.IsVisible ? false : true;
        }

        $scope.Hide = function () {
             $scope.IsVisible = !$scope.IsVisible;
             $scope.popupType = null;
        }
        
        $scope.menuOutClick = function() {
			$scope.menuShow = false;
		}
			
	}]);
