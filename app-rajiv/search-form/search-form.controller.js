'use strict';
 
var searchApp = angular.module('searchForm');
searchApp.controller('SearchFormController', ['orderByFilter', '$log', '$window', '$http', '$scope', '$state', '$stateParams', '$filter', '$timeout', '$localStorage', '$sessionStorage', '$cookies', '$location', 'searchFormFactory', 'searchResultFactory', 'deviceDetector', 'oktpusServiceFactory',
	function (orderBy, $log, $window, $http, $scope, $state, $stateParams, $filter, $timeout, $localStorage, $sessionStorage, $cookies, $location, searchFormFactory, searchResultFactory, deviceDetector, oktpusServiceFactory) {
		
		$scope.CAR_REVIEWS_EXTERNAL_SITE_API_URL = 'https://oktpus.com/api/external_link?type_id=2&product_id=';
		$scope.CAR_RECALLS_EXTERNAL_SITE_API_URL = 'https://oktpus.com/api/external_link?type_id=3&product_id=';
		$scope.isMoreButtonClicked = false;

		$scope.$parent.isLogin = $cookies.get('isLogin');
		$scope.$storage = $localStorage;	
		//$scope.desktop = false; 
		$scope.showSharePopUp = false;
		$scope.url = '';
		$scope.media = '';
		$scope.title = '';
		$scope.city = '';
		$scope.make = '';
		$scope.model = '';		
		$scope.domainID = 1;
		$scope.isDesktop = false;
		$scope.showSearchForm = false;
		$scope.showSearchResult = true;
		$scope.rightArrowImage = true;
		$scope.wallOfDeals = false;
		$scope.sortDropDownDisable = true;
		if($window.innerWidth > 1024){
		//	$scope.desktop = true;
			$scope.isDesktop = true;
		}	
		if($scope.isDesktop){
			$scope.showSearchResult = true;
			$scope.showSearchForm = true;
			$scope.rightArrowImage = false;
		}		

		$scope.isPopUpOpen = false;
		$scope.tempClassForPopUpOpen = "";
		$scope.searchScroller = "";
		$scope.isGeoLocation = false;
		$scope.defaultCity = "";
		$scope.emptySearchValue = "";
		$scope.fromSavedSearch = false;
		$scope.isSeeCarPartsClicked = false;
		$scope.carPartsResult = [];		
		$scope.isSeeCarPartsPopupOpen = false;	
		$scope.isCompareClicked = false;		
		$scope.compareCars = [];  
		$scope.selectedCarCount = 0;
		$scope.isCompareCarsMessage = false ;
		$scope.compareCarsMessage = '';
		$scope.isAlreadyAdded = false;
		$scope.issearchByKeyword = false;
		$scope.keyValues = '';
		$scope.subArray = [];
		$scope.backUpArray = [];
		$scope.carPartsPopups = ''; 
		$scope.forward = false;
		$scope.reverse = false;
		$scope.lastProductId = '';
		$scope.seeCarPartsLoading  = false;
		$scope.seeCarPartsLinkClick = 0;
				
		if($stateParams.formType == 'wall-of-deals' || $location.path().substring(1) == 'wall-of-deals'){
			$scope.wallOfDeals = true;
		}
		
		$scope.isPriceChanged = false;
		$scope.isYearChanged = false;
		$scope.isKmChanged = false;
		$scope.isBmaChanged = false;

		$scope.px = 'px';

		if($scope.isDesktop) {
			$scope.newSearchResultMargin = '365px';
			$scope.newSearchResultBoxWidth = '33.33%';
		}
		else {
			$scope.newSearchResultMargin = '0px';
			$scope.newSearchResultBoxWidth = '100%';
		}

		$scope.deviceDetector = deviceDetector;
		$scope.os = $scope.deviceDetector.os;
		$scope.browser = $scope.deviceDetector.browser;
		$scope.device = $scope.deviceDetector.device;
		
		$scope.user_id = 'null';
				
		$scope.cityList = [];
		$scope.countryList = [];
		$scope.makeList = [];
		$scope.modelList = [];
		$scope.bodyList = [];
		$scope.transmissionList = [];
		$scope.colourList = [];
		$scope.userTypeList = [];
		$scope.doorsList = [];
		$scope.drivetrainList = [];
		
		$scope.sortList = [{id: 0, value: 'post_date desc', label: 'Newest Arrivals', key: 'post_date', ticked: true},
						   {id: 1, value: 'heuristic desc', label: 'Most Relevant', key: 'heuristic', ticked: false},
						   {id: 2, value: 'price asc', label: 'Price: Low to High', key: 'price', ticked: false},
						   {id: 3, value: 'price desc', label: 'Price: High to Low', key: 'price', ticked: false},
						   {id: 4, value: 'year asc', label: 'Year: Old to New', key: 'year', ticked: false},
						   {id: 5, value: 'year desc', label: 'Year: New to Old', key: 'year', ticked: false}];
		
		$scope.sortSelected = $scope.sortList[0];
		
		$scope.selectedCountry = [];
		$scope.selectedCity = [];
		$scope.selectedMake = [];
		$scope.selectedModel = [];
		$scope.selectedBody = [];
		$scope.selectedTransmission = [];
		$scope.selectedColour = [];
		$scope.selectedUserType = [];
		$scope.selectedDoors = [];
		$scope.selectedDrivetrain = [];
		
		$scope.isModelDisabled = true;
		$scope.isCityDisabled = false;
		
		$scope.price = false;
		$scope.year = false;
		$scope.kilometers = false;
		$scope.belowmarket = false;		
		$scope.flag = false;
		$scope.rangeSliderShow = {
						"visibility":"visible",
						"height" : "auto",
						"overflow" : "visible"
					};
		$scope.rangeSliderHide = {
						"visibility":"hidden",
						"height" : 0,
						"overflow" : "hidden"
					};
		
		$scope.localLangCountry = { search: "Type to filter", nothingSelected: "Country", defaultDisplay: "Select" }
		$scope.localLangCity = { search: "Type to filter", nothingSelected: "City", defaultDisplay: "Select" }
		$scope.localLangMake = { search: "Type to filter", nothingSelected: "Make", defaultDisplay: "Select" }
		$scope.localLangModel = { search: "Type to filter", nothingSelected: "Model", defaultDisplay: "Choose a make first" }
		$scope.localLangBody = { search: "Type to filter", nothingSelected: "Body", defaultDisplay: "" }
		$scope.localLangTransmission = { search: "Type to filter", nothingSelected: "Transmission", defaultDisplay: "" }
		$scope.localLangColour = { search: "Type to filter", nothingSelected: "Colour", defaultDisplay: "" }
		$scope.localLangUserType = { search: "Type to filter", nothingSelected: "User Type", defaultDisplay: "" }
		$scope.localLangDoors = { search: "Type to filter", nothingSelected: "Doors", defaultDisplay: "" }
		$scope.localLangDrivetrain = { search: "Type to filter", nothingSelected: "Drivetrain", defaultDisplay: "" }
		
		$scope.clearCountryList = {};
		$scope.clearCityList = {};
		$scope.clearMakeList = {};
		$scope.clearModelList = {};
		$scope.clearBodyList = {};
		$scope.clearTransmissionList = {};
		$scope.clearColourList = {};
		$scope.clearUserTypeList = {};
		$scope.clearDoorsList = {};
		$scope.clearDrivetrainList = {};
		
		$scope.closeCountryList = {};
		$scope.closeCityList = {};
		$scope.closeMakeList = {};
		$scope.closeModelList = {};
		$scope.closeBodyList = {};
		$scope.closeTransmissionList = {};
		$scope.closeColourList = {};
		$scope.closeUserTypeList = {};
		$scope.closeDoorsList = {};
		$scope.closeDrivetrainList = {};
		
		$scope.openCountryList = {};
		$scope.openCityList = {};
		$scope.openMakeList = {};
		$scope.openModelList = {};
		$scope.openBodyList = {};
		$scope.openTransmissionList = {};
		$scope.openColourList = {};
		$scope.openUserTypeList = {};
		$scope.openDoorsList = {};
		$scope.openDrivetrainList = {};
		
		$scope.changeCityLabel = {};
		$scope.changeModelLabel = {};
		
		$scope.refreshButtonTextCountry = {};
		$scope.refreshButtonTextCity = {};
		$scope.refreshButtonTextMake = {};
		$scope.refreshButtonTextModel = {};
		$scope.refreshButtonTextUserType = {};
		$scope.refreshButtonTextBody = {};
		$scope.refreshButtonTextTransmission = {};
		$scope.refreshButtonTextColour = {};
		$scope.refreshButtonTextDoors = {};
		$scope.refreshButtonTextDrivetrain = {};
		
		$scope.minPrice;
		$scope.maxPrice;
		$scope.minKilometers;
		$scope.maxkilometers;
		$scope.minYear;
		$scope.maxYear;
		$scope.minBelowMarket;
		$scope.maxBelowMarket;
		
		$scope.checkStatus = false;
		$scope.searching = false;
		
		$scope.checkCarsWOImage = false;
		
		$scope.checkNotificationStatus = false;
		$scope.isSaveSearchEnable = true;
		$scope.searchID = null;
		$scope.savedSearchData = null;
		$scope.savedSearchValuesCount = null;
		
		$scope.isDataAvailToSave = false;
		
		$scope.isPopupVisible = false;

		$scope.isUserLoggedIn = $cookies.get('isLogin');

		$scope.checkedMakeSize = null;
		$scope.isModelCheckEnable = false;

		$scope.tempClassForMenu = "";
		$scope.menuShow = false;
		
		$scope.showClearButton = true;
		$scope.showNewSearchButton = false;
		
		$scope.pageNumber = 1;
		$scope.counter = 0;
		$scope.perPageShow = 6;
		
		$scope.requestData = null;
		$scope.totalCount = null;
		$scope.attributeLabel = null;
		$scope.userDisplayFormat = null;
		
		$scope.searchResult = [];
		$scope.userHasProductFlag = {};
		
		$scope.lat = 0;
		$scope.lng = 0;
		$scope.accessDenied = false;
		
		$scope.closePopup = true;

		$scope.modelPopUp = false;
		$scope.anotherModal = true;
		
		$scope.receiveNotification =true;
		
		$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			$scope.$storage.previousState = $scope.$storage.currentState;
		}
		$scope.showSignUp = function () {
			this.onExit('signup');
			$state.go('signup');
		}
		$scope.pricePopup = false;
		$scope.belowMarketAvg = false;
		/*******************Pop ups********************************/
		/*if($cookies.get('pricePopup') == undefined){
			$scope.pricePopup = true;
		}else{
			$scope.pricePopup = false;
		}	
		
		if($cookies.get('belowMarketAvg') == undefined){
			$scope.belowMarketAvg = true;
		}else{
			$scope.belowMarketAvg = false;
		}	*/
		
		if($cookies.get('receiveNotification') == undefined){
			$scope.receiveNotification = true;
		}else{
			$scope.receiveNotification = false;
		}	
		
		if($cookies.get('refineSearch') == undefined){
			$scope.refineSearch = true;
		}else{
			$scope.refineSearch = false;
		}	
		
		var w = angular.element($window);
    
	    $scope.getWindowDimensions = function () {
	        return {
	            'h': w.height(),
	            'w': w.width()
	        };
	    };

	    $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
	        $scope.windowHeight = newValue.h;
	        $scope.windowWidth = newValue.w;

	        if($scope.isDesktop) {
	        	if(true == $scope.showSearchForm) {
	        		$scope.newSearchResultSection = w.width()-365;
	        	}
	        	else {
	        		$scope.newSearchResultSection = w.width()
	        	}
			}

	        $scope.style = function () {
	            return {
	                'height': (newValue.h - 100) + 'px',
	                'width': (newValue.w - 100) + 'px'
	            };
	        };
	    }, true);

	    w.bind('resize', function () {
	        $scope.$apply();
	    });

		$scope.pricePopupFunction = function(pricePopup){
			if(pricePopup){	
				$scope.pricePopup = false;	
				/*if($cookies.get('pricePopup') == undefined){
					$cookies.put('pricePopup',true);
				}*/
			} 
			else{			
				$scope.pricePopup = true;					
			}			
		}
		

		/**********wall modal sart*****************************/
		$scope.modelPopupFunction = function(){		
				$scope.modelPopUp = true;	
				$scope.popup={	"display":"block"}				
		}
		$scope.closeModelPopup = function(){		
				$scope.modelPopUp = false;	
				$scope.popup={	"display":"none"}				
		}

	    $scope.oktfunctionLoad = function () {   
			$scope.modelPopUpLoad = true;
			$timeout(function () {		  	
				$scope.anotherModal = false;
			
				$scope.modelPopUpLoad = false;		     
			}, 3000);
		}
		
		$scope.showSearch = function (value) {
			//this.onExit(value);
			$state.go(value, {formType: value});
		}

		/**********wall modal ends*****************************/
		
		$scope.belowMarketAvarageFunction = function(belowMarketAvg){
			if(belowMarketAvg){	
				$scope.belowMarketAvg = false;	
				/*if($cookies.get('belowMarketAvg') == undefined){
					$cookies.put('belowMarketAvg',true);
				}*/
			} 
			else{			
				$scope.belowMarketAvg = true;					
			}			
		}	
		
		$scope.receiveNotificationFunction = function(receiveNotification){
			if(receiveNotification){	
				$scope.receiveNotification = false;	
				if($cookies.get('receiveNotification') == undefined){
					$cookies.put('receiveNotification',true);
				}
			} 
			else{			
				$scope.receiveNotification = true;					
			}			
		}	
		
		$scope.refineSearchFunction = function(refineSearch){
			if(refineSearch){	
				$scope.refineSearch = false;	
				if($cookies.get('refineSearch') == undefined){
					$cookies.put('refineSearch',true);
				}
			} 
			else{			
				$scope.refineSearch = true;					
			}			
		}	
		/****************************************************/
				
		/*******************Arrow up button********************************/
		$scope.$watch(function () {
			$scope.scrollheight = $window.scrollY;
		    return $scope.scrollheight;
			}, function (scrollY) {
			if($scope.scrollheight >= 400) {
				$scope.position = 'fixed';	
			}
			else{
				$scope.position = 'relative';	
			}
		});

		/****************************************************/
		
		$scope.showGeoLocationErrorAlert = function(){
			$scope.closePopup = false;
				$scope.geoLocationErrorPopup={
					"display":"inline-block"
				}			
		}
		
		$scope.onClickFunction = function(){
			if($scope.closePopup){	
			/*	$scope.popup={
					"display":"none"
				}*/
				$scope.geoLocationErrorPopup={
					"display":"none"
				}			
			} 
			else{			
				$scope.closePopup = true;					
			}	
			//The below condition is for sort drop down issue
			if(!$scope.dropdownbg && $scope.isDesktop){
				$scope.dropdownbg = true;
			} 
			if($scope.isPopupVisible){
				$scope.isPopupVisible = false;	
			}		
			if(!$scope.isSeeCarPartsPopupOpen){
				$scope.isSeeCarPartsClicked = false;
			}
			$scope.isSeeCarPartsPopupOpen = false;
		}	

		/*******************Calling GetGeoLocation function start********************************/
		$scope.getCityNameByLatLng = function() {
			var param = {'domain_id': $scope.domainID,'filters[latitude]':$scope.lat,'filters[longitude]':$scope.lng};
			searchFormFactory.GetSearchAttributeProd(param, function(response) {
				if(response.status) {
					var city = (response.attribute_value[0].value).split(",");	
					$scope.clearCityList.invoke();
					$scope.clearCountryList.invoke();
					$scope.isCityDisabled = false;
					var index = $scope.cityList.indexOf($filter('filter')($scope.cityList, { integer_representation: response.attribute_value[0].integer_representation }, true)[0] );
					if(undefined != $scope.cityList[index]) {
						$scope.cityList[index].ticked = true;
						$scope.refreshButtonTextCity.invoke();	
						
						$scope.searchSubmit('FULL');
						//Need to uncomment below function afterwards
					//	$scope.getSearchAttributeCount('city', 'make', 'model', 'body', 'transmission', 'colour');
					}
				}
				else {
					$log.error("Error occured while getting City Name");				
				}
			});
		}
		
		$scope.getGeoLocation = function(value) {
			if(false == $scope.isGeoLocation && false == value) {
				var geoLocationUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBowoY76D1fWr6DZ7ack38Z1pDYFro9FF8";
				searchFormFactory.GetGeoLocation(geoLocationUrl,function(response) {				
					if(response) {
						$scope.lat = response.location.lat;
						$scope.lng = response.location.lng;
						$scope.getCityNameByLatLng();
					} else {
						$scope.geoLocationError = true;  
						$scope.geoErrorMessage = "Error while getting GetGeoLocation. Try again";
					}
				}); 
				$scope.isGeoLocation = true;
			}
			else {
				if(navigator.geolocation){
					// timeout at 60000 milliseconds (60 seconds)			
					var options = {timeout:60000};
					navigator.geolocation.getCurrentPosition(function(position) { 
																$scope.lat = position.coords.latitude;
																$scope.lng = position.coords.longitude;
																$scope.getCityNameByLatLng();
																$scope.geoLocationError = false;  
															}, function(err) { 
																$scope.isGeoLocation = false;
																$scope.getGeoLocation(false); 
																$scope.geoLocationError = true;  
																if(err.code == 1){
																	$scope.geoErrorMessage = "Denied accidentally? You need to check your browser location settings for Oktpus.com.";
																	$scope.accessDenied = true;
																}else {
																	$scope.geoErrorMessage = "Location information is unavailable. Please try again later or select your city manually.";
																}
															/*	$scope.popup={
																	"display":"none"
																}*/
																$scope.geoLocationErrorPopup={
																	"display":"inline-block"
																}		
																}, 
															 $scope.options);
				}            
				else{
					$scope.geoLocationError = true;  
					$scope.geoErrorMessage = "Sorry, browser does not support geolocation!";						
				}
			}	
		}		
		/*******************Calling GetGeoLocation function end********************************/		


		$scope.scrollLoadData = new searchResultFactory();
		
		$scope.multiUnitData = {
			price: {
				units: {
					one: 'CAD',
					two: 'USD'
				},
				options: {
					floor: 0,
					ceil: 100000,
					step: 500,
					hidePointerLabels: true,
					hideLimitLabels: true,
					onChange: function() { $scope.rangeSliderChange('price'); },
					onEnd: function(id) { $scope.rangeSliderEnd(); },
					enforceStep: false,
					enforceRange: true,
					showSelectionBar: true,
					showSelectionBarEnd: true
				},
				newValue: {
					min: 0,
					max: 100000
				},
				displayFormat: {
					price: {
						label: 'Price (CAD)',
						keyName: 'CAD',
						step:500
					}
				},
				defaultValue: {
					min: 0,
					max: 100000
				},
				valueFormatType:'#,###',
				mask: {
					regular: "CAD$ {val}",
					verbose: "CAD$ {val}",
					min: "CAD$ {val}",
					max: "above CAD$ {val}",
					minVerbose: "CAD$ {val}",
					maxVerbose: "CAD$ {val}"
				}
			}, 
			kilometers: {
				units: {
					one: 'Kilometers',
					two: 'Miles'
				},
				options: {
					floor:0,
					ceil: 300000,
					step: 5000,
					hidePointerLabels: true,
					hideLimitLabels: true,
					onChange: function() { $scope.rangeSliderChange('kilometers'); },
					onEnd: function(id) { $scope.rangeSliderEnd(); },
					enforceStep: false,
					enforceRange: true
				},
				newValue: {
					min: 0,
					max: 300000
				},
				displayFormat: {
					kilometers: {
						label: 'Kilometers',
						keyName: 'kilometers',
						step:5000
					}
				},
				defaultValue: {
					min: 0,
					max: 300000
				},
				valueFormatType:'#,###',
				mask: {
					regular: "{val} km",
					verbose: "{val} kilometers",
					min: "{val} km",
					max: "above {val} km",
					minVerbose: "{val} kilometers",
					maxVerbose: "{val} kilometers"
				}
			},
			year: {
				units: {
					one: 'Year'
				},
				options: {
					floor: 1980,
					ceil: 2018,
					step: 1,
					hidePointerLabels: true,
					hideLimitLabels: true,
					onChange: function() { $scope.rangeSliderChange('year'); },
					onEnd: function(id) { $scope.rangeSliderEnd(); },
					enforceStep: false,
					enforceRange: true
				},
				newValue: {
					min: 1980,
					max: 2018
				},
				displayFormat: {
					year: {
						label: 'Year',
						keyName: 'year',
						step:1
					}
				},
				defaultValue: {
					min: 1980,
					max: 2018
				},
				valueFormatType:'####',
				mask: {
					regular: "{val}",
					verbose: "{val}",
					min: "{val} and lower",
					max: "{val}",
					minVerbose: "{val} and lower",
					maxVerbose: "{val}"
				}
			},
			belowmarket: {
				units: {
					one: 'Below Market Average'
				},
				options: {
					floor: 0,
					ceil: 100,
					step: 5,
					hidePointerLabels: true,
					hideLimitLabels: true,
					onChange: function() { $scope.rangeSliderChange('belowmarket'); },
					onEnd: function(id) { $scope.rangeSliderEnd(); },
					enforceStep: false,
					enforceRange: true
				},
				newValue: {
					min: 0,
					max: 100
				},
				displayFormat: {
					belowmarket: {
						label: 'Below Market Average',
						keyName: 'below_market_average_percent',
						step:5
					}
				},
				defaultValue: {
					min: 0,
					max: 100
				},
				valueFormatType:'####',
				mask: {
					regular: "{val}%",
					verbose: "{val}%",
					min: "{val}%",
					max: "{val}%",
					minVerbose: "{val}%",
					maxVerbose: "{val}%"
				}
			}
		};
		
		$scope.$watch('menuShow', function() {
			if($scope.menuShow == true) {
				$scope.tempClassForMenu = "showHideMenu";
			}
			else {
				$scope.tempClassForMenu = "";
			}
		});
		
		$scope.onEnter = function() {
			if(null != $stateParams.searchKeyword && undefined != $scope.$storage.previousState && 'HOME' == $scope.$storage.previousState.toUpperCase()) {
				$scope.busy = true;
				$scope.scrollLoadData.busy = true
				if($scope.isDesktop){
					$scope.showSearchForm = true;
				}else{
					$scope.showSearchForm = false;
				}				
				$scope.showSearchResult = true;
				//$scope.searchSubmitKeyword($stateParams.searchKeyword);
			}
			else if(null != $stateParams.selectedSearchFields && undefined != $scope.$storage.previousState && 'HOME' == $scope.$storage.previousState.toUpperCase()) {
				if('SHOWMORE' == $stateParams.selectedSearchFields.previousOperation.toUpperCase()) {
					$scope.busy = false;
					$scope.showSearchForm = true;					
					if($scope.isDesktop){
						$scope.showSearchResult = true;
					}else{
						$scope.showSearchResult = false;
					}
				}
				else if('SEARCH' == $stateParams.selectedSearchFields.previousOperation.toUpperCase()) {
					$scope.busy = true;
					$scope.scrollLoadData.busy = true;					
					$scope.showSearchResult = true;
					if($scope.isDesktop){
						$scope.showSearchForm = true;
					}else{
						$scope.showSearchForm = false;
					}		
				}
			}
			$scope.$storage.currentState = 'search';
			$scope.$storage.nextState = null;
			
			$window.scrollTo(0, 0);
		}
		
	/*	$scope.onExit = function(value) {
			$scope.$storage.nextState = value;
			$scope.$storage.previousState = $scope.$storage.currentState;
		} */
	
		$scope.scrollToTop = function() {
			$window.scrollTo(0, 0);
		}
	/*	
		$scope.partialFormAction = function(value) {
			var selectedData = {};
			var tempCityList=[], tempMakeList=[], tempModelList=[]
			
			selectedData.previousOperation = value;
			
			if($scope.cityList.length > 0) {
				angular.forEach($scope.cityList, function(value, key) {
					if(true == value.ticked) {
						tempCityList.push(value);
						selectedData.cityList = tempCityList;
						selectedData.isCity = true;
					}
				});
			}
			if($scope.makeList.length > 0) {
				angular.forEach($scope.makeList, function(value, key) {
					if(true == value.ticked) {
						tempMakeList.push(value);
						selectedData.makeList = tempMakeList;
						selectedData.isMake = true;
					}
				});
			}
			if($scope.modelList.length > 0) {
				angular.forEach($scope.modelList, function(value, key) {
					if(true == value.ticked) {
						tempModelList.push(value);
						selectedData.modelList = tempModelList;
						selectedData.isModel = true;
					}
				});
			}
			this.onExit('search');
			$state.go('search', {selectedSearchFields: selectedData});
		}   */
		
		if($scope.$storage.searchID != undefined && $scope.$storage.previousState != null && 'SAVEDSEARCH' == $scope.$storage.previousState.toUpperCase()) {
			$scope.isSaveSearchEnable = false;
			$scope.showClearButton = false;
			$scope.showNewSearchButton = true;
			if(typeof $stateParams.searchID === 'undefined' || $stateParams.searchID == null) {
				if($scope.$storage.notificationStatus != null && '2' == $scope.$storage.notificationStatus.toUpperCase()) {
					$scope.checkStatus = true;
					$scope.checkNotificationStatus = true;
				}
				else {
					$scope.checkStatus = true;
				}
				
				$scope.isSaveSearchEnable = $scope.$storage.isSaveSearchEnable;
				$scope.notificationStatus = $scope.$storage.notificationStatus;
				$scope.searchID = $scope.$storage.searchID;
				$scope.savedSearchData = $scope.$storage.savedSearchData;
				$scope.savedSearchValuesCount = $scope.$storage.savedSearchValuesCount;
			}
			else {
				if($stateParams.notificationStatus != null && '2' == $stateParams.notificationStatus.toUpperCase()) {
					$scope.checkStatus = true;
					$scope.checkNotificationStatus = true;
				}
				else {
					$scope.checkStatus = true;
				}
				
				$scope.$storage.isSaveSearchEnable = $scope.isSaveSearchEnable;
				$scope.$storage.notificationStatus = $stateParams.notificationStatus;
				$scope.$storage.searchID = $stateParams.searchID;
				$scope.$storage.savedSearchData = $stateParams.savedSearchData;
				$scope.$storage.savedSearchValuesCount = $stateParams.savedSearchValuesCount;
				
				$scope.isSaveSearchEnable = $scope.$storage.isSaveSearchEnable;
				$scope.notificationStatus = $scope.$storage.notificationStatus;
				$scope.searchID = $scope.$storage.searchID;
				$scope.savedSearchData = $scope.$storage.savedSearchData;
				$scope.savedSearchValuesCount = $scope.$storage.savedSearchValuesCount;
			}
		}

		$scope.newSearchForm = function() {
			$scope.$storage.searchID = undefined;
			this.onExit('search');
			$state.go($state.current, {}, {reload: true});
		}

		$scope.$watch('checkNotificationStatus', function() {
			if($scope.checkNotificationStatus == true && $scope.isSaveSearchEnable == true) {
				$scope.checkStatus = true;
			}
		});
		
		$scope.$watch('checkStatus', function() {
			if($scope.checkStatus == false && $scope.checkNotificationStatus == true) {
				if('SAVEDSEARCH' == $scope.$storage.previousState.toUpperCase()) {

				}
				else {
					$scope.checkNotificationStatus = false;
				}
			}
		});

		$scope.rangeSliderChange = function(value) {
			if(value.toUpperCase() == 'PRICE') {
				$scope.isPriceChanged = true;
				$scope.minPrice = $scope.formNumberFormat($scope.multiUnitData.price.newValue.min, 'price', 'min');
				$scope.maxPrice = $scope.formNumberFormat($scope.multiUnitData.price.newValue.max, 'price', 'max');
			}
			else if(value.toUpperCase() == 'KILOMETERS') {
				$scope.isKmChanged = true;
				$scope.minKilometers = $scope.formNumberFormat($scope.multiUnitData.kilometers.newValue.min, 'kilometers', 'min');
				$scope.maxKilometers = $scope.formNumberFormat($scope.multiUnitData.kilometers.newValue.max, 'kilometers', 'max');
			}
			else if(value.toUpperCase() == 'YEAR') {
				$scope.isYearChanged = true;
				$scope.minYear = $scope.formNumberFormat($scope.multiUnitData.year.newValue.min, 'year', 'min');
				$scope.maxYear = $scope.formNumberFormat($scope.multiUnitData.year.newValue.max, 'year', 'max');
			}
			else if(value.toUpperCase() == 'BELOWMARKET') {
				$scope.isBmaChanged = true;
				$scope.minBelowMarket = $scope.formNumberFormat($scope.multiUnitData.belowmarket.newValue.min, 'belowmarket', 'min');
				$scope.maxBelowMarket = $scope.formNumberFormat($scope.multiUnitData.belowmarket.newValue.max, 'belowmarket', 'max');
			}
		}
				
		$scope.onFocusInputBox = function(value) {
			if(value.toUpperCase() == 'MINPRICE') {
				$scope.minPrice = $scope.multiUnitData.price.newValue.min;
			}
			else if(value.toUpperCase() == 'MAXPRICE') {
				$scope.maxPrice = $scope.multiUnitData.price.newValue.max;
			}
			else if(value.toUpperCase() == 'MINKILOMETERS') {
				$scope.minKilometers = $scope.multiUnitData.kilometers.newValue.min;
			}
			else if(value.toUpperCase() == 'MAXKILOMETERS') {
				$scope.maxKilometers = $scope.multiUnitData.kilometers.newValue.max;
			}
			else if(value.toUpperCase() == 'MINYEAR') {
				$scope.minYear = $scope.multiUnitData.year.newValue.min;
			}
			else if(value.toUpperCase() == 'MAXYEAR') {
				$scope.maxYear = $scope.multiUnitData.year.newValue.max;
			}
			else if(value.toUpperCase() == 'MINBELOWMARKET') {
				$scope.minBelowMarket = $scope.multiUnitData.belowmarket.newValue.min;
			}
			else if(value.toUpperCase() == 'MAXBELOWMARKET') {
				$scope.maxBelowMarket = $scope.multiUnitData.belowmarket.newValue.max;
			}
		}
		
		$scope.onBlurInputBox = function(value) {
			value = value.toUpperCase();
			if(value.indexOf("PRICE") !== -1) {	
				if($scope.multiUnitData.price.newValue.min > $scope.multiUnitData.price.newValue.max){
					var tempValue = $scope.multiUnitData.price.newValue.min ;
					$scope.multiUnitData.price.newValue.min = $scope.multiUnitData.price.newValue.max; 
					$scope.multiUnitData.price.newValue.max = tempValue; 
				}
				$scope.rangeSliderChange("price");		
			}

			else if(value.indexOf("KILOMETERS") !== -1) {
				if($scope.multiUnitData.kilometers.newValue.min > $scope.multiUnitData.kilometers.newValue.max){
					var tempValue = $scope.multiUnitData.kilometers.newValue.min ;
					$scope.multiUnitData.kilometers.newValue.min = $scope.multiUnitData.kilometers.newValue.max; 
					$scope.multiUnitData.kilometers.newValue.max = tempValue; 
				}
				$scope.rangeSliderChange("kilometers");	
			}
			else if(value.indexOf("YEAR") !== -1) {
					if($scope.isSearchedYearByKeyword){
					if(value.toUpperCase() == 'MINYEAR'){						
						$scope.multiUnitData.year.newValue.min = ($scope.multiUnitData.year.newValue.min < $scope.multiUnitData.year.defaultValue.min) ? $scope.multiUnitData.year.defaultValue.min : $scope.multiUnitData.year.newValue.min;
						$scope.multiUnitData.year.newValue.max = $scope.multiUnitData.year.defaultValue.max;					
					}
					else{						
						$scope.multiUnitData.year.newValue.min = $scope.multiUnitData.year.defaultValue.min;
						$scope.multiUnitData.year.newValue.max = ($scope.multiUnitData.year.newValue.max > $scope.multiUnitData.year.defaultValue.max)? $scope.multiUnitData.year.defaultValue.max : $scope.multiUnitData.year.newValue.max;					
					}					
				}else{
					if($scope.multiUnitData.year.newValue.min > $scope.multiUnitData.year.newValue.max){
						var tempValue = $scope.multiUnitData.year.newValue.min ;
						$scope.multiUnitData.year.newValue.min = $scope.multiUnitData.year.newValue.max; 
						$scope.multiUnitData.year.newValue.max = tempValue; 
					}
				}
				$scope.rangeSliderChange("year");	
				$scope.isSearchedYearByKeyword = false;
			}
			else if(value.indexOf("BELOWMARKET") !== -1) {
				if($scope.multiUnitData.belowmarket.newValue.min > $scope.multiUnitData.belowmarket.newValue.max){
					var tempValue = $scope.multiUnitData.belowmarket.newValue.min ;
					$scope.multiUnitData.belowmarket.newValue.min = $scope.multiUnitData.belowmarket.newValue.max; 
					$scope.multiUnitData.belowmarket.newValue.max = tempValue; 
				}
				$scope.rangeSliderChange("belowmarket");
			}	

		/*	if(value.toUpperCase() == 'MINPRICE') {
				$scope.minPrice = $scope.formNumberFormat($scope.multiUnitData.price.newValue.min, 'price', 'min');
			}
			else if(value.toUpperCase() == 'MAXPRICE') {
				$scope.maxPrice = $scope.formNumberFormat($scope.multiUnitData.price.newValue.max, 'price', 'max');
			}
			else if(value.toUpperCase() == 'MINKILOMETERS') {
				$scope.minKilometers = $scope.formNumberFormat($scope.multiUnitData.kilometers.newValue.min, 'kilometers', 'min');
			}
			else if(value.toUpperCase() == 'MAXKILOMETERS') {
				$scope.maxKilometers = $scope.formNumberFormat($scope.multiUnitData.kilometers.newValue.max, 'kilometers', 'max');
			}
			else if(value.toUpperCase() == 'MINYEAR') {
				$scope.minYear = $scope.formNumberFormat($scope.multiUnitData.year.newValue.min, 'year', 'min');
			}
			else if(value.toUpperCase() == 'MAXYEAR') {
				$scope.maxYear = $scope.formNumberFormat($scope.multiUnitData.year.newValue.max, 'year', 'max');
			}
			else if(value.toUpperCase() == 'MINBELOWMARKET') {
				$scope.minBelowMarket = $scope.formNumberFormat($scope.multiUnitData.belowmarket.newValue.min, 'belowmarket', 'min');
			}
			else if(value.toUpperCase() == 'MAXBELOWMARKET') {
				$scope.maxBelowMarket = $scope.formNumberFormat($scope.multiUnitData.belowmarket.newValue.max, 'belowmarket', 'max');
			}   */
		}
		
		$scope.onChangeInputBox = function(value) {
			if(value.toUpperCase() == 'MINPRICE') {
				$scope.isPriceChanged = true;
				$scope.minPrice = $scope.validateNumber($scope.minPrice);
				$scope.multiUnitData.price.newValue.min = $scope.minPrice;
			}
			else if(value.toUpperCase() == 'MAXPRICE') {
				$scope.isPriceChanged = true;
				$scope.maxPrice = $scope.validateNumber($scope.maxPrice);
				$scope.multiUnitData.price.newValue.max = $scope.maxPrice;
			}
			else if(value.toUpperCase() == 'MINKILOMETERS') {
				$scope.isKmChanged = true;
				$scope.minKilometers = $scope.validateNumber($scope.minKilometers);
				$scope.multiUnitData.kilometers.newValue.min = $scope.minKilometers;
			}
			else if(value.toUpperCase() == 'MAXKILOMETERS') {
				$scope.isKmChanged = true;
				$scope.maxKilometers = $scope.validateNumber($scope.maxKilometers);
				$scope.multiUnitData.kilometers.newValue.max = $scope.maxKilometers;
			}
			else if(value.toUpperCase() == 'MINYEAR') {
				$scope.isYearChanged = true;
				$scope.minYear = $scope.validateNumber($scope.minYear);
				$scope.multiUnitData.year.newValue.min = $scope.minYear;
			}
			else if(value.toUpperCase() == 'MAXYEAR') {
				$scope.isYearChanged = true;
				$scope.maxYear = $scope.validateNumber($scope.maxYear);
				$scope.multiUnitData.year.newValue.max = $scope.maxYear;
				if($scope.multiUnitData.year.newValue.max == ''){
					$scope.multiUnitData.year.newValue.max = 2018;					
				}
			}
			else if(value.toUpperCase() == 'MINBELOWMARKET') {
				$scope.isBmaChanged = true;
				$scope.minBelowMarket = $scope.validateNumber($scope.minBelowMarket);
				$scope.multiUnitData.belowmarket.newValue.min = $scope.minBelowMarket;
			}
			else if(value.toUpperCase() == 'MAXBELOWMARKET') {
				$scope.isBmaChanged = true;
				$scope.maxBelowMarket = $scope.validateNumber($scope.maxBelowMarket);
				$scope.multiUnitData.belowmarket.newValue.max = $scope.maxBelowMarket;
			}
		}
		
		$scope.validateNumber = function(value) {
			return value.replace(/[^0-9]/g, '');
		} 

		$scope.rangeSliderEnd = function() {
			//Need to uncomment below function afterwards
		//	this.getSearchAttributeCount('city', 'make', 'model', 'body', 'transmission', 'colour');
		}
		
		$scope.clearForm = function(value) {
			$scope.scrollLoadData.busy = true;
			//~ $scope.clearCityList.invoke();
			//~ $scope.clearMakeList.invoke();
			//~ $scope.clearBodyList.invoke();
			//~ $scope.clearTransmissionList.invoke();
			//~ $scope.clearColourList.invoke();
			if(!$scope.isDesktop){				
				$scope.showSearchForm = false;
				$scope.showSearchResult = true;
			}
			
			if(value != "searchByKeyword"){
				$scope.closeCityList.invoke();
		//		$scope.isGeoLocation = false;
		//		$scope.getGeoLocation(false); 
		//		$scope.isGeoLocation = true;
			}	
			$scope.closeCountryList.invoke();
			$scope.closeMakeList.invoke();
			$scope.closeModelList.invoke();
			$scope.closeBodyList.invoke();
			$scope.closeTransmissionList.invoke();
			$scope.closeColourList.invoke();
			$scope.closeUserTypeList.invoke();
			$scope.closeDoorsList.invoke();
			$scope.closeDrivetrainList.invoke();
			
			$scope.price = false;
			$scope.year = false;
			$scope.kilometers = false;
			$scope.belowmarket = false;
			
			$scope.multiUnitData.price.newValue.min = $scope.multiUnitData.price.defaultValue.min
			$scope.multiUnitData.price.newValue.max = $scope.multiUnitData.price.defaultValue.max
			$scope.multiUnitData.year.newValue.min = $scope.multiUnitData.year.defaultValue.min
			$scope.multiUnitData.year.newValue.max = $scope.multiUnitData.year.defaultValue.max
			$scope.multiUnitData.kilometers.newValue.min = $scope.multiUnitData.kilometers.defaultValue.min
			$scope.multiUnitData.kilometers.newValue.max = $scope.multiUnitData.kilometers.defaultValue.max
			$scope.multiUnitData.belowmarket.newValue.min = $scope.multiUnitData.belowmarket.defaultValue.min
			$scope.multiUnitData.belowmarket.newValue.max = $scope.multiUnitData.belowmarket.defaultValue.max
			
			$scope.rangeSliderChange("price");
			$scope.rangeSliderChange("year");
			$scope.rangeSliderChange("kilometers");
			$scope.rangeSliderChange("belowmarket");
			
			$scope.isPriceChanged = false;
			$scope.isYearChanged = false;
			$scope.isKmChanged = false;
			$scope.isBmaChanged = false;
			
			if(value != "searchByKeyword"){
				angular.forEach($scope.cityList, function(value, key) {
					value.ticked = false;
				});
			}
			
			$scope.isCityDisabled = false;
			angular.forEach($scope.countryList, function(value, key) {
				value.ticked = false;
			});
			
			angular.forEach($scope.makeList, function(value, key) {
				value.ticked = false;
			});
			//~ angular.forEach($scope.modelList, function(value, key) {
				//~ value.ticked = false;
			//~ });
			
			$scope.modelList = [];
			
			$scope.isModelDisabled = true;
			$scope.changeModelLabel.invoke("Choose a make first");
			
			angular.forEach($scope.bodyList, function(value, key) {
				value.ticked = false;
			});
			angular.forEach($scope.transmissionList, function(value, key) {
				value.ticked = false;
			});
			angular.forEach($scope.colourList, function(value, key) {
				value.ticked = false;
			});
			
			angular.forEach($scope.userTypeList, function(value, key) {
				value.ticked = false;
			});
			
			angular.forEach($scope.doorsList, function(value, key) {
				value.ticked = false;
			});
			angular.forEach($scope.drivetrainList, function(value, key) {
				value.ticked = false;
			});
			
			$scope.checkStatus = false;
			$scope.checkNotificationStatus = false;
			$scope.checkCarsWOImage = false;
						
			if(value != "searchByKeyword"){
				if($scope.wallOfDeals){
					$scope.setLabelWallOfDeal();				
				}
				$scope.isGeoLocation = false;
				$scope.getGeoLocation(false); 
				$scope.isGeoLocation = true;
				//Need to uncomment below function afterwards
				//$scope.getSearchAttributeCount('city', 'make', 'body', 'transmission', 'colour');			
			}		
			$scope.scrollLoadData.busy = false;
		}
		
		$scope.hideSearchForm = function(value) {

			$scope.fullSearchResultPage = {
				'left' : '38%'
			}
			if(value.toUpperCase() == 'PARTIAL') {
				$timeout( function() {
					$scope.$parent.refinedSearch = false;
				}, 250, true);

				
            }
			else if(value.toUpperCase() == 'FULL') {				
				$scope.showSearchForm = false;
				$scope.rightArrowImage = true;					
				$scope.showSearchResult = true;
				$scope.scrollToTop();
				//$state.go('home', {refinedSearch:true});
				/*if($window.innerWidth > 1024){
					$scope.fullWidth = {"width" : "100%",
										"margin-left" : "0"
				}
				    $scope.fullWidthImg = {"width" : "20%"}
				}*/

				if($scope.isDesktop) {
					$scope.newSearchResultMargin = '0px';
					$scope.newSearchResultBoxWidth = '25%';
					$scope.newSearchResultSection = w.width();
				}
			}
		}

		$scope.hideSearchResult = function() {
			$scope.price = false;
			$scope.year = false;
			$scope.kilometers = false;
			$scope.belowmarket = false;	
			$scope.fullSearchResultPage = {
				'left' : '50%'
			}
			$scope.showSearchForm = true;			
			if($scope.isDesktop){
				$scope.rightArrowImage = false;
				$scope.showSearchResult = true;
				$scope.newSearchResultMargin = '365px';
				$scope.newSearchResultBoxWidth = '33.33%';
				$scope.newSearchResultSection = w.width() - 365;				
			}else{
				$scope.showSearchResult = false;
			}
			$scope.scrollToTop();
		}
		
		$scope.dropDownClick = function (value) {
			switch( value.toUpperCase() ) {
                case 'CITY':
                	break;
                case 'COUNTRY':
                	break;
                case 'MAKE':
					break;
                case 'MODEL':
					break;
                case 'BODY':
                    break;
                case 'TRANSMISSION':
                    break;
                case 'COLOUR':
                    break;
                case 'PRICE':
					$scope.price = !$scope.price;
                    break;
                case 'YEAR':
					$scope.year = !$scope.year;
                    break;
                case 'KILOMETERS':
					$scope.kilometers = !$scope.kilometers;
                    break;
                case 'BELOWMARKET':
					$scope.belowmarket = !$scope.belowmarket;
                    break;
                case 'USERTYPE':
                    break;
                case 'DOORS':
                    break;   
                case 'DRIVETRAIN':
                    break;    
                default:
			}
		}

		$scope.getCityData = function(callback){
			var flag = false; 		
			var cityLableDisplay = '';
			var i = 0; 
			$scope.closeCityList.invoke();
			angular.forEach($scope.cityList, function(value, key) {
				if(value.ticked == true) {
					value.ticked = false;
				}
			});
				
			angular.forEach($scope.countryList, function(value, key) {							
				if(value.ticked == true) {
					flag = true;
					if(i==1){
						cityLableDisplay += ", ";
					}
					cityLableDisplay += value.value;
					i++;	
				}													
			});		
			
			
			if(flag == true) {
				$scope.isCityDisabled = true;
				cityLableDisplay += " selected";
				$scope.changeCityLabel.invoke(cityLableDisplay);
				
			}else{
				$scope.isCityDisabled = false;
				$scope.changeCityLabel.invoke("Select");				
			}
		}
		$scope.getModelData = function(callback) {
			var flag = false; 
			var urlPartAtrbValueID = '';
			var urlPartGrpAtrbValueID = '';
			
			//~ if($scope.selectedMake.length > 0) {
				//~ angular.forEach($scope.selectedMake, function(value, key) {
					//~ if(value.group == 0) {
						//~ urlPartAtrbValueID = urlPartAtrbValueID + value.id + ',';
					//~ }
					//~ else if(value.group == 1) {
						//~ urlPartGrpAtrbValueID = urlPartGrpAtrbValueID + value.integer_representation + ',';
					//~ }
				//~ });
			//~ }
			//~ else {
				//~ angular.forEach($scope.makeList, function(value, key) {
					//~ if(true == value.ticked) {
						//~ if(value.group == 0) {
							//~ urlPartAtrbValueID = urlPartAtrbValueID + value.id + ',';
						//~ }
						//~ else if(value.group == 1) {
							//~ urlPartGrpAtrbValueID = urlPartGrpAtrbValueID + value.integer_representation + ',';
						//~ }
					//~ }
				//~ });
			//~ }
			
			angular.forEach($scope.makeList, function(value, key) {
				if(true == value.ticked) {
					flag = true;
					if(value.group == 0) {
						urlPartAtrbValueID = urlPartAtrbValueID + value.id + ',';
					}
					else if(value.group == 1) {
						urlPartGrpAtrbValueID = urlPartGrpAtrbValueID + value.integer_representation + ',';
					}
				}
			});
			if(false == flag) {
				$scope.changeModelLabel.invoke("Choose a make first");
				$scope.isModelDisabled = true;
				
				$scope.closeModelList.invoke();
				angular.forEach($scope.modelList, function(value, key) {
					if(value.ticked == true) {
						value.ticked = false;
					}
				});
			//	$scope.getSearchAttributeCount('city', 'make', 'model', 'body', 'transmission', 'colour');
				
				return;
			}
			
			if(urlPartAtrbValueID.length == 0 && urlPartGrpAtrbValueID.length > 0) {
				urlPartAtrbValueID = urlPartAtrbValueID + 0;
			}
				
			if(urlPartGrpAtrbValueID.length > 0) {
				urlPartGrpAtrbValueID = '/groups/' + urlPartGrpAtrbValueID;
			}
			
			urlPartAtrbValueID = urlPartAtrbValueID.replace(/,\s*$/, "");
			urlPartGrpAtrbValueID = urlPartGrpAtrbValueID.replace(/,\s*$/, "");
				
		//	var url = 'http://142.4.215.210:11080/get/' + $scope.domainID + '/attribute/4/by/attribute_values/' + urlPartAtrbValueID + urlPartGrpAtrbValueID;
			var url = 'https://oktpus.com/get/' + $scope.domainID + '/attribute/4/by/attribute_values/' + urlPartAtrbValueID + urlPartGrpAtrbValueID;
			searchFormFactory.GetModelData(url, function(response) {
				if(undefined != response.status && 1 == response.status) {
					angular.forEach(response.result, function(value, key) {
						var index = $scope.modelList.indexOf($filter('filter')($scope.modelList, { integer_representation: value.integer_representation }, true)[0] );
						if(undefined != $scope.modelList[index] && $scope.modelList[index].ticked == true) {
							value.ticked = true;
						}
						else {
							value.ticked = false;
						}
						value.count = 0;
					});
					
					$scope.modelList = [];
					$scope.modelList = response.result;
					//$.extend(true, $scope.modelList, response.result);
					
					callback();
				} else {
					$log.error("GetModelData:error");
				}
			});
		}

		$scope.RemoveRougeChar = function(convertString) {
			if(convertString.substring(0,1) == ",") {
				return convertString.substring(1, convertString.length)
			}
			return convertString;
		}

		$scope.formatNumber = function(raw_value) {
			var num = raw_value.toString().replace(/[^0-9]/gi, "").split("").reverse().join("");
			var formatted_value = $scope.RemoveRougeChar(num.replace(/(\d{3})/g,"$1,").split("").reverse().join(""));
			
			return formatted_value;
		}

		$scope.formatNumber_byType = function(raw_value, type) {
			var formatted_value = raw_value;
			switch($scope.multiUnitData[type]['valueFormatType']) {
				case '#,###':
					formatted_value = this.formatNumber(raw_value);
					break;
				case '####':
				default:
			}
			
			return formatted_value;
		}
		
		$scope.formNumberFormat = function(raw_value, type, direction) {
			var num_default = $scope.multiUnitData[type]['defaultValue'][direction];    
			var formatted_value = raw_value;
		   
			if (raw_value == '') {
				formatted_value = $scope.multiUnitData[type]['mask'][direction].replace("{val}", this.formatNumber_byType(num_default, type));
				if(type == 'price'){
					if(direction == 'min'){
						$scope.multiUnitData.price.newValue.min = num_default;
					}else{
						$scope.multiUnitData.price.newValue.max = num_default;
					}
				}
				else if(type == 'year'){
					if(direction == 'min'){
						$scope.multiUnitData.year.newValue.min = num_default;
					}else{						
						$scope.multiUnitData.year.newValue.max = num_default;
					}
				}
				else if(type == 'kilometers'){
					if(direction == 'min'){
						$scope.multiUnitData.kilometers.newValue.min = num_default;
					}else{
						$scope.multiUnitData.kilometers.newValue.max = num_default;
					}
				}
				else if(type == 'belowmarket'){
					if(direction == 'min'){
						$scope.multiUnitData.belowmarket.newValue.min = num_default;
					}else{
						$scope.multiUnitData.belowmarket.newValue.max = num_default;
					}
				}
			} else {
				formatted_value = parseFloat(Math.floor(raw_value).toString().replace(/[^0-9]/gi, ""));;
				if (
					direction == 'max'
					&& formatted_value >= num_default 
				) {
					formatted_value = $scope.multiUnitData[type]['mask']['max'].replace("{val}", this.formatNumber_byType(num_default, type));
				} else if (
					direction == 'min'
					&& formatted_value <= num_default 
				) {
					formatted_value = $scope.multiUnitData[type]['mask']['min'].replace("{val}", this.formatNumber_byType(num_default, type));
				} else {
					formatted_value = $scope.multiUnitData[type]['mask']['regular'].replace("{val}", this.formatNumber_byType(formatted_value, type));
				}
			}
			
			return formatted_value;
		}
		
		$scope.populateSearchData = function(/*callback*/) {
			if($scope.$storage.searchID != undefined && $scope.$storage.previousState != null && 'SAVEDSEARCH' == $scope.$storage.previousState.toUpperCase()) {
				if($scope.savedSearchValuesCount != null && $scope.savedSearchValuesCount.length > 0) {
					var getModelProcess = false;
					var dataExist = false;
					angular.forEach($scope.savedSearchData, function(value, key) {
						switch(key.toUpperCase()) {
							case 'CITY':
								angular.forEach(value.values, function(value1, key1) {
									var index = $scope.cityList.indexOf($filter('filter')($scope.cityList, { integer_representation: value1.id }, true)[0] );
									if(undefined != $scope.cityList[index]) {
										$scope.cityList[index].ticked = true;
										dataExist = true;
									}
								}); 
								break;
							case 'COUNTRY':
								$scope.clearCityList.invoke();
								var checkCountry = false;
								angular.forEach(value.values, function(value1, key1) {
									var index = $scope.countryList.indexOf($filter('filter')($scope.countryList, { integer_representation: parseInt(value1.id) }, true)[0] );
									if(undefined != $scope.countryList[index]) {
										$scope.countryList[index].ticked = true;
										checkCountry = true;
										dataExist = true;
									}
								}); 
								if(checkCountry){
										$scope.closeCityList.invoke();
										angular.forEach($scope.cityList, function(value, key) {
											value.ticked = false;
										});
									
									if($scope.selectedCountry.length != 0) {				
										$scope.getCityData();
									}else{				
										$scope.changeCityLabel.invoke("Select");
										$scope.isCityDisabled = false;														
									}		
									$scope.getCityData();	
									$scope.getCityData();	
								}									
								break;
								
							case 'MAKE':
								angular.forEach(value.values, function(value1, key1) {
									var index = $scope.makeList.indexOf($filter('filter')($scope.makeList, { integer_representation: value1.id }, true)[0] );
									if(undefined != $scope.makeList[index]) {
										$scope.makeList[index].ticked = true;
										dataExist = true;
									}
								});
								$scope.getModelData(function() {
									if($scope.modelList.length == 0) {
										$scope.isModelDisabled = true;
										$scope.changeModelLabel.invoke("No model found for make");
									}
									else if($scope.modelList.length > 0) {
										$scope.isModelDisabled = false;
										$scope.changeModelLabel.invoke("Select");
									}
								});
								break;
							case 'MODEL':	
								getModelProcess = true;
								//~ $scope.isModelDisabled = false;
								//~ $scope.getModelData(function() {
									//~ if($scope.modelList.length == 0) {
										//~ $scope.isModelDisabled = true;
										//~ $scope.changeModelLabel.invoke("No model found for make");
									//~ }
									//~ else if($scope.modelList.length > 0) {
										//~ $scope.isModelDisabled = false;
										//~ $scope.changeModelLabel.invoke("Select");
									//~ }
									//~ angular.forEach(value.values, function(value1, key) {
										//~ var index = $scope.modelList.indexOf($filter('filter')($scope.modelList, { integer_representation: value1.id }, true)[0] );
										//~ if(undefined != $scope.modelList[index]) {
											//~ $scope.modelList[index].ticked = true;
										//~ }
									//~ });
								//~ });
								break;
							case 'PRICE':
								if(value.display_format.toUpperCase() != $scope.multiUnitData.price.units.one.toUpperCase()) {
									$scope.changeMultiUnit('price');
								}
								if("" == value.min) {
									$scope.multiUnitData.price.newValue.min = $scope.multiUnitData.price.defaultValue.min;
								}
								else {
									$scope.multiUnitData.price.newValue.min = parseInt(value.min);									
								}
								if("" == value.max) {
									$scope.multiUnitData.price.newValue.max = $scope.multiUnitData.price.defaultValue.max;
								}
								else {
									$scope.multiUnitData.price.newValue.max = parseInt(value.max);								
								}
								$scope.rangeSliderChange('price');
								$scope.price = true;
								dataExist = true;
								break;
							case 'YEAR':
								if("" == value.min) {
									$scope.multiUnitData.year.newValue.min = $scope.multiUnitData.year.defaultValue.min;
								}
								else {
									$scope.multiUnitData.year.newValue.min = parseInt(value.min);
								}
								if("" == value.max) {
									$scope.multiUnitData.year.newValue.max = $scope.multiUnitData.year.defaultValue.max;
								}
								else {
									$scope.multiUnitData.year.newValue.max = parseInt(value.max);
								}
								$scope.rangeSliderChange('year');								
								$scope.year = true;
								dataExist = true;
								break;
							case 'KILOMETERS':
								if(value.display_format.toUpperCase() != $scope.multiUnitData.kilometers.units.one.toUpperCase()) {
									$scope.changeMultiUnit('kilometers');
								}
								if("" == value.min) {
									$scope.multiUnitData.kilometers.newValue.min = $scope.multiUnitData.kilometers.defaultValue.min;
								}
								else {
									$scope.multiUnitData.kilometers.newValue.min = parseInt(value.min);
								}
								if("" == value.max) {
									$scope.multiUnitData.kilometers.newValue.max = $scope.multiUnitData.kilometers.defaultValue.max;
								}
								else {
									$scope.multiUnitData.kilometers.newValue.max = parseInt(value.max);
								}
								$scope.rangeSliderChange('kilometers');
								$scope.kilometers = true;
								dataExist = true;
								break;
							case 'BODY':
								angular.forEach(value.values, function(value1, key1) {
									var index = $scope.bodyList.indexOf($filter('filter')($scope.bodyList, { integer_representation: value1.id }, true)[0] );
									if(undefined != $scope.bodyList[index]) {
										$scope.bodyList[index].ticked = true;
										dataExist = true;
									}
								});  
								break;
							case 'TRANSMISSION':
								angular.forEach(value.values, function(value1, key1) {
									var index = $scope.transmissionList.indexOf($filter('filter')($scope.transmissionList, { integer_representation: value1.id }, true)[0] );
									if(undefined != $scope.transmissionList[index]) {
										$scope.transmissionList[index].ticked = true;
										dataExist = true;
									}
								}); 
								break;
							case 'COLOUR':
								angular.forEach(value.values, function(value1, key1) {
									var index = $scope.colourList.indexOf($filter('filter')($scope.colourList, { integer_representation: value1.id }, true)[0] );
									if(undefined != $scope.colourList[index]) {
										$scope.colourList[index].ticked = true;
										dataExist = true;
									}
								});   
								break;
							case 'USER_TYPE':
								angular.forEach(value.values, function(value1, key1) {
									var index = $scope.userTypeList.indexOf($filter('filter')($scope.userTypeList, { integer_representation: value1.id }, true)[0] );
									if(undefined != $scope.userTypeList[index]) {
										$scope.userTypeList[index].ticked = true;
										dataExist = true;
									}
								});   
								break;
							case 'BELOW_MARKET_AVERAGE_PERCENT':
								if("" == value.min) {
									$scope.multiUnitData.belowmarket.newValue.min = $scope.multiUnitData.belowmarket.defaultValue.min;
								}
								else {
									$scope.multiUnitData.belowmarket.newValue.min = parseInt(value.min);
								}
								if("" == value.max) {
									$scope.multiUnitData.belowmarket.newValue.max = $scope.multiUnitData.belowmarket.defaultValue.max;
								}
								else {
									$scope.multiUnitData.belowmarket.newValue.max = parseInt(value.max);
								}
								$scope.rangeSliderChange('belowmarket');
								$scope.belowmarket = true;
								dataExist = true;
								break;
							case 'DOORS':
								angular.forEach(value.values, function(value1, key1) {
									var index = $scope.doorsList.indexOf($filter('filter')($scope.doorsList, { integer_representation: value1.id }, true)[0] );
									if(undefined != $scope.doorsList[index]) {
										$scope.doorsList[index].ticked = true;
										dataExist = true;
									}
								});   
								break;
							case 'DRIVETRAIN':
								angular.forEach(value.values, function(value1, key1) {
									var index = $scope.drivetrainList.indexOf($filter('filter')($scope.drivetrainList, { integer_representation: value1.id }, true)[0] );
									if(undefined != $scope.drivetrainList[index]) {
										$scope.drivetrainList[index].ticked = true;
										dataExist = true;
									}
								});   
								break;
							case 'IMAGE0':
								$scope.checkCarsWOImage = true;
								dataExist = true;
							default:
						}
					});
					
					if(true == getModelProcess) {
						angular.forEach($scope.savedSearchData, function(value, key) {
							if('MODEL' == key.toUpperCase()) {
								$scope.isModelDisabled = false;
								$scope.getModelData(function() {
									angular.forEach(value.values, function(value1, key) {
										var index = $scope.modelList.indexOf($filter('filter')($scope.modelList, { integer_representation: value1.id }, true)[0] );
										if(undefined != $scope.modelList[index]) {
											$scope.modelList[index].ticked = true;
											dataExist = true;
										}
									});
								//	callback();
								});
							}
						});
					}
				/*	else {
						callback();
					}	*/				
				}
				if(dataExist){
						$scope.fromSavedSearch = true;
						$scope.searchSubmit('FULL');
						$scope.fromSavedSearch = false;
				}			
			}
	/*		else if(null != $stateParams.selectedSearchFields && undefined != $scope.$storage.previousState && 'HOME' == $scope.$storage.previousState.toUpperCase()) {
				if(true == $stateParams.selectedSearchFields.isCity) {
					angular.forEach($stateParams.selectedSearchFields.cityList, function(value, key) {
						var index = $scope.cityList.indexOf($filter('filter')($scope.cityList, { id: value.id }, true)[0] );
						if(undefined != $scope.cityList[index]) {
							$scope.cityList[index].ticked = true;
						}
					});
					//$scope.selectedCity = $stateParams.selectedSearchFields.cityList;
				}
				if(true == $stateParams.selectedSearchFields.isMake) {
					angular.forEach($stateParams.selectedSearchFields.makeList, function(value, key) {
						var index = $scope.makeList.indexOf($filter('filter')($scope.makeList, { id: value.id }, true)[0] );
						if(undefined != $scope.makeList[index]) {
							$scope.makeList[index].ticked = true;
						}
					}); 
					//$scope.selectedMake = $stateParams.selectedSearchFields.makeList;
					
					$scope.isModelDisabled = false;
					$scope.getModelData(function() {
						if($scope.modelList.length == 0) {
							$scope.isModelDisabled = true;
							$scope.changeModelLabel.invoke("No model found for make");
						}
						else if(true == $stateParams.selectedSearchFields.isModel) {
							var flag = false;
							angular.forEach($stateParams.selectedSearchFields.modelList, function(value, key) {
								var index = $scope.modelList.indexOf($filter('filter')($scope.modelList, { integer_representation: value.integer_representation }, true)[0] );
								if(undefined != $scope.modelList[index]) {
									$scope.modelList[index].ticked = true;
									flag = true;
								}
							});
						}
						else {
							$scope.changeModelLabel.invoke("Select");
						}
						callback();
					});
					//$scope.selectedModel = $stateParams.selectedSearchFields.modelList;
				}
				else {
					$scope.isModelDisabled = true;
					$scope.changeModelLabel.invoke("Choose a make first");
					callback();
				}
			} 
			else {
				callback();
			}		*/	
			
			//callback();
		}
		
		$scope.loadAttributeData = function(value) {
			this.getSearchAttribute(value, function(value){
		/*		if('PARTIAL' == value.toUpperCase()) { 
					$scope.getSearchAttributeCount('city', 'make', 'model');
				} 
				else */ if('FULL' == value.toUpperCase()) {
					$scope.initializeMultiUnitData(function() {
						if($scope.$storage.searchID != undefined && $scope.$storage.previousState != null && 'SAVEDSEARCH' == $scope.$storage.previousState.toUpperCase()) {
							$scope.populateSearchData(); 
						}//function() {
							else if(null != $stateParams.searchKeyword && undefined != $scope.$storage.previousState && 'HOME' == $scope.$storage.previousState.toUpperCase()) {
								if($stateParams.searchKeyword.trim().length != 0) {
									$scope.keywordSearchValue = $stateParams.searchKeyword;
								}
								$scope.searchSubmitKeyword('search');
								//Need to uncomment below function afterwards
							//	$scope.getSearchAttributeCount('city', 'make', 'model', 'body', 'transmission', 'colour');
							}						
							else{								
								/*var data = $scope.prepareSearchRequestBodyData();								
								searchFormFactory.GetSearchItemList($scope.domainID, data, function(response) {
									if(response.status) {
										$scope.busy = $scope.scrollLoadData.busy;
										
										$scope.requestData = data;
										$scope.totalCount = response.result.total_count;
										$scope.attributeLabel = response.result.attribute_label;
										$scope.userDisplayFormat = response.result.user_display_format;
										
										$scope.scrollLoadData.setData($scope.domainID, $scope.perPageShow, $scope.requestData, function() {
											$scope.searchResult = [];
											$scope.pageNumber = 1;
											$scope.counter = 0;
										});
										
										$scope.loadMore();
									} else {
										$log.error("GetSearchItemList:error");
										$log.error(response);
									}
								});*/

								// Calling geolocation
								$scope.getGeoLocation(false);
							}
							//$scope.getSearchAttributeCount('city', 'make', 'model', 'body', 'transmission', 'colour');
				//		});
					});
				}
			});
		}
		
		$scope.initializeMultiUnitData = function(callback) {
			if($cookies.get('isLogin')) {
				$scope.user_id = $cookies.get('userId');
			}
			else {
				$scope.user_id = 'null';
			}
			searchFormFactory.GetMultiUnitData($scope.domainID, $scope.user_id, function(response) {	
				if(response!= null){		
					if(response.status) {
						if(response.user_config.price.key_name == 'CAD') {
							$scope.multiUnitData.price.units.one = 'CAD';
							$scope.multiUnitData.price.units.two = 'USD';
						}
						else if(response.user_config.price.key_name == 'USD') {
							$scope.multiUnitData.price.units.one = 'USD';
							$scope.multiUnitData.price.units.two = 'CAD';
						}
							
						if(response.user_config.kilometers.key_name == 'kilometers') {
							$scope.multiUnitData.kilometers.units.one = 'Kilometers';
							$scope.multiUnitData.kilometers.units.two = 'Miles';
						}
						else if(response.user_config.kilometers.key_name == 'miles') {
							$scope.multiUnitData.kilometers.units.one = 'Miles';
							$scope.multiUnitData.kilometers.units.two = 'Kilometers';
						}
							
						$scope.multiUnitData.price.options.floor = parseInt(response.user_config.price.default_value.min);
						$scope.multiUnitData.price.options.ceil = parseInt(response.user_config.price.default_value.max);
					/*	$scope.multiUnitData.price.newValue.min = parseInt(response.user_config.price.default_value.min);
						$scope.multiUnitData.price.newValue.max = parseInt(response.user_config.price.default_value.max); */
						$scope.multiUnitData.price.options.step = parseInt(response.user_config.price.field.step);
						$scope.multiUnitData.price.displayFormat.price.label = response.user_config.price.field.label;
						$scope.multiUnitData.price.displayFormat.price.keyName = response.user_config.price.key_name;
						$scope.multiUnitData.price.displayFormat.price.step = parseInt(response.user_config.price.field.step);
						$scope.multiUnitData.price.defaultValue.min = parseInt(response.user_config.price.default_value.min);
						$scope.multiUnitData.price.defaultValue.max = parseInt(response.user_config.price.default_value.max);
						$scope.multiUnitData.price.valueFormatType = response.user_config.price.value_format_type;
						$scope.multiUnitData.price.mask.regular = response.user_config.price.mask.regular;
						$scope.multiUnitData.price.mask.verbose = response.user_config.price.mask.verbose;
						$scope.multiUnitData.price.mask.min = response.user_config.price.mask.min;
						$scope.multiUnitData.price.mask.max = response.user_config.price.mask.max;
						$scope.multiUnitData.price.mask.minVerbose = response.user_config.price.mask.min_verbose;
						$scope.multiUnitData.price.mask.maxVerbose = response.user_config.price.mask.max_verbose;
						
					/*	$scope.minPrice = $scope.formNumberFormat($scope.multiUnitData.price.newValue.min, 'price', 'min');
						$scope.maxPrice = $scope.formNumberFormat($scope.multiUnitData.price.newValue.max, 'price', 'max');*/
						
							
						$scope.multiUnitData.kilometers.options.floor = parseInt(response.user_config.kilometers.default_value.min);
						$scope.multiUnitData.kilometers.options.ceil = parseInt(response.user_config.kilometers.default_value.max);
						$scope.multiUnitData.kilometers.options.step = parseInt(response.user_config.kilometers.field.step);
						$scope.multiUnitData.kilometers.newValue.min = parseInt(response.user_config.kilometers.default_value.min);
						$scope.multiUnitData.kilometers.newValue.max = parseInt(response.user_config.kilometers.default_value.max);
						$scope.multiUnitData.kilometers.displayFormat.kilometers.label = response.user_config.kilometers.field.label;
						$scope.multiUnitData.kilometers.displayFormat.kilometers.keyName = response.user_config.kilometers.key_name;
						$scope.multiUnitData.kilometers.displayFormat.kilometers.step = parseInt(response.user_config.kilometers.field.step);
						$scope.multiUnitData.kilometers.defaultValue.min = parseInt(response.user_config.kilometers.default_value.min);
						$scope.multiUnitData.kilometers.defaultValue.max = parseInt(response.user_config.kilometers.default_value.max);
						$scope.multiUnitData.kilometers.valueFormatType = response.user_config.kilometers.value_format_type;;
						$scope.multiUnitData.kilometers.mask.regular = response.user_config.kilometers.mask.regular;
						$scope.multiUnitData.kilometers.mask.verbose = response.user_config.kilometers.mask.verbose;
						$scope.multiUnitData.kilometers.mask.min = response.user_config.kilometers.mask.min;
						$scope.multiUnitData.kilometers.mask.max = response.user_config.kilometers.mask.max;
						$scope.multiUnitData.kilometers.mask.minVerbose = response.user_config.kilometers.mask.min_verbose;
						$scope.multiUnitData.kilometers.mask.maxVerbose = response.user_config.kilometers.mask.max_verbose;
						
						$scope.minKilometers = $scope.formNumberFormat($scope.multiUnitData.kilometers.newValue.min, 'kilometers', 'min');
						$scope.maxKilometers = $scope.formNumberFormat($scope.multiUnitData.kilometers.newValue.max, 'kilometers', 'max');
						
						
						$scope.multiUnitData.year.options.floor = parseInt(response.user_config.year.default_value.min);
						$scope.multiUnitData.year.options.ceil = parseInt(response.user_config.year.default_value.max);
						$scope.multiUnitData.year.options.step = parseInt(response.user_config.year.field.step);
						$scope.multiUnitData.year.newValue.min = parseInt(response.user_config.year.default_value.min);
						$scope.multiUnitData.year.newValue.max = parseInt(response.user_config.year.default_value.max);
						$scope.multiUnitData.year.displayFormat.year.label = response.user_config.year.field.label;
						$scope.multiUnitData.year.displayFormat.year.keyName = response.user_config.year.key_name;
						$scope.multiUnitData.year.displayFormat.year.step = parseInt(response.user_config.year.field.step);
						$scope.multiUnitData.year.defaultValue.min = parseInt(response.user_config.year.default_value.min);
						$scope.multiUnitData.year.defaultValue.max = parseInt(response.user_config.year.default_value.max);
						$scope.multiUnitData.year.valueFormatType = response.user_config.year.value_format_type;;
						$scope.multiUnitData.year.mask.regular = response.user_config.year.mask.regular;
						$scope.multiUnitData.year.mask.verbose = response.user_config.year.mask.verbose;
						$scope.multiUnitData.year.mask.min = response.user_config.year.mask.min;
						$scope.multiUnitData.year.mask.max = response.user_config.year.mask.max;
						$scope.multiUnitData.year.mask.minVerbose = response.user_config.year.mask.min_verbose;
						$scope.multiUnitData.year.mask.maxVerbose = response.user_config.year.mask.max_verbose;
						
						$scope.minYear = $scope.formNumberFormat($scope.multiUnitData.year.newValue.min, 'year', 'min');
						$scope.maxYear = $scope.formNumberFormat($scope.multiUnitData.year.newValue.max, 'year', 'max');
						
						$scope.multiUnitData.belowmarket.options.floor = parseInt(response.user_config.below_market_average_percent.default_value.min);
						$scope.multiUnitData.belowmarket.options.ceil = parseInt(response.user_config.below_market_average_percent.default_value.max);
						$scope.multiUnitData.belowmarket.options.step = parseInt(response.user_config.below_market_average_percent.field.step);
					/*	$scope.multiUnitData.belowmarket.newValue.min = parseInt(response.user_config.below_market_average_percent.default_value.min);
						$scope.multiUnitData.belowmarket.newValue.max = parseInt(response.user_config.below_market_average_percent.default_value.max);  */
						$scope.multiUnitData.belowmarket.displayFormat.belowmarket.label = response.user_config.below_market_average_percent.field.label;
						$scope.multiUnitData.belowmarket.displayFormat.belowmarket.keyName = response.user_config.below_market_average_percent.key_name;
						$scope.multiUnitData.belowmarket.displayFormat.belowmarket.step = parseInt(response.user_config.below_market_average_percent.field.step);
						$scope.multiUnitData.belowmarket.defaultValue.min = parseInt(response.user_config.below_market_average_percent.default_value.min);
						$scope.multiUnitData.belowmarket.defaultValue.max = parseInt(response.user_config.below_market_average_percent.default_value.max);
						$scope.multiUnitData.belowmarket.valueFormatType = response.user_config.below_market_average_percent.value_format_type;;
						$scope.multiUnitData.belowmarket.mask.regular = response.user_config.below_market_average_percent.mask.regular;
						$scope.multiUnitData.belowmarket.mask.verbose = response.user_config.below_market_average_percent.mask.verbose;
						$scope.multiUnitData.belowmarket.mask.min = response.user_config.below_market_average_percent.mask.min;
						$scope.multiUnitData.belowmarket.mask.max = response.user_config.below_market_average_percent.mask.max;
						$scope.multiUnitData.belowmarket.mask.minVerbose = response.user_config.below_market_average_percent.mask.min_verbose;
						$scope.multiUnitData.belowmarket.mask.maxVerbose = response.user_config.below_market_average_percent.mask.max_verbose;
					
						if($scope.wallOfDeals){
							$scope.setLabelWallOfDeal();				
						}else{
							$scope.multiUnitData.price.newValue.min = parseInt(response.user_config.price.default_value.min);
							$scope.multiUnitData.belowmarket.newValue.min = parseInt(response.user_config.below_market_average_percent.default_value.min);						
						}	
						
						$scope.multiUnitData.price.newValue.max = parseInt(response.user_config.price.default_value.max);
						$scope.multiUnitData.belowmarket.newValue.max = parseInt(response.user_config.below_market_average_percent.default_value.max);
							
						$scope.minPrice = $scope.formNumberFormat($scope.multiUnitData.price.newValue.min, 'price', 'min');
						$scope.maxPrice = $scope.formNumberFormat($scope.multiUnitData.price.newValue.max, 'price', 'max');						
					
						$scope.minBelowMarket = $scope.formNumberFormat($scope.multiUnitData.belowmarket.newValue.min, 'belowmarket', 'min');
						$scope.maxBelowMarket = $scope.formNumberFormat($scope.multiUnitData.belowmarket.newValue.max, 'belowmarket', 'max');
						
						callback();					
					} else {
						$log.error("ChangeMultiUnitSelection:error");
					}
				}else {
					$log.error("ChangeMultiUnitSelection:error");
				}
			});
		}
		
		$scope.changeMultiUnit = function (value) {
			if($cookies.get('isLogin')) {
				$scope.user_id = $cookies.get('userId');
			}
			else {
				$scope.user_id = 'null';
			}
			
			if(value.toUpperCase() == 'PRICE') {
				var toPrice = '', fromPrice = '';
				if($scope.multiUnitData.price.units.two == 'CAD') {
					toPrice = 'CAD';
					fromPrice = 'USD';
				}
				else if($scope.multiUnitData.price.units.two == 'USD') {
					toPrice = 'USD';
					fromPrice = 'CAD';
				}
				
				var dataPrice = {'config[attribute][price][type]':toPrice, 'current_values[values][0]': $scope.multiUnitData.price.newValue.min,
				'current_values[values][1]': $scope.multiUnitData.price.newValue.max, 'current_values[from_format]':fromPrice};
		
				searchFormFactory.ChangeMultiUnitSelection($scope.domainID, $scope.user_id, dataPrice, function(response) {
					if(response.status) {
						var temp = $scope.multiUnitData.price.units.one;
						$scope.multiUnitData.price.units.one = $scope.multiUnitData.price.units.two;
						$scope.multiUnitData.price.units.two = temp;
						
						$scope.multiUnitData.price.options.floor = Math.floor(parseInt(response.display_format.price.default_value.min));
						$scope.multiUnitData.price.options.ceil = Math.ceil(parseInt(response.display_format.price.default_value.max));
						
						if($scope.multiUnitData.price.newValue.min == parseInt(response.display_format.price.default_value.min)) {
							$scope.multiUnitData.price.newValue.min = Math.floor(parseInt(response.display_format.price.default_value.min));
						}
						else if(parseInt(response.display_format.price.default_value.min) > parseInt(response.new_values[0])) {
							$scope.multiUnitData.price.newValue.min = Math.floor(parseInt(response.display_format.price.default_value.min));
						}
						else if(parseInt(response.new_values[0]) > parseInt(response.display_format.price.default_value.max)) {
							$scope.multiUnitData.price.newValue.min = Math.floor(parseInt(response.display_format.price.default_value.max));
						}
						else {
							$scope.multiUnitData.price.newValue.min = Math.floor(parseInt(response.new_values[0]));
						}
						
						if($scope.multiUnitData.price.newValue.max == parseInt(response.display_format.price.default_value.max)) {
							$scope.multiUnitData.price.newValue.max = Math.ceil(parseInt(response.display_format.price.default_value.max));
						}
						else if(parseInt(response.display_format.price.default_value.max) < parseInt(response.new_values[1])) {
							$scope.multiUnitData.price.newValue.max = Math.ceil(parseInt(response.display_format.price.default_value.max));
						}
						else if(parseInt(response.new_values[1]) < parseInt(response.display_format.price.default_value.min)) {
							$scope.multiUnitData.price.newValue.max = Math.ceil(parseInt(response.display_format.price.default_value.min));
						}
						else {
							$scope.multiUnitData.price.newValue.max = Math.ceil(parseInt(response.new_values[1]));
						}
						
						$scope.multiUnitData.price.displayFormat.price.label = response.display_format.price.field.label;
						$scope.multiUnitData.price.displayFormat.price.keyName = response.display_format.price.key_name;
						$scope.multiUnitData.price.displayFormat.price.step = parseInt(response.display_format.price.field.step);
						$scope.multiUnitData.price.options.step = parseInt(response.display_format.price.field.step);
						$scope.multiUnitData.price.defaultValue.min = Math.floor(parseInt(response.display_format.price.default_value.min));
						$scope.multiUnitData.price.defaultValue.max = Math.ceil(parseInt(response.display_format.price.default_value.max));
						$scope.multiUnitData.price.valueFormatType = response.display_format.price.value_format_type;
						$scope.multiUnitData.price.mask.regular = response.display_format.price.mask.regular;
						$scope.multiUnitData.price.mask.verbose = response.display_format.price.mask.verbose;
						$scope.multiUnitData.price.mask.min = response.display_format.price.mask.min;
						$scope.multiUnitData.price.mask.max = response.display_format.price.mask.max;
						$scope.multiUnitData.price.mask.minVerbose = response.display_format.price.mask.min_verbose;
						$scope.multiUnitData.price.mask.maxVerbose = response.display_format.price.mask.max_verbose;
						
						$scope.minPrice = $scope.formNumberFormat($scope.multiUnitData.price.newValue.min, 'price', 'min');
						$scope.maxPrice = $scope.formNumberFormat($scope.multiUnitData.price.newValue.max, 'price', 'max');
					} else {
						$log.error("ChangeMultiUnitSelection:error");
					}
				});					
			}
			else if(value.toUpperCase() == 'KILOMETERS') {
				var toKilometer = '', fromKilometer = '';
				
				if($scope.multiUnitData.kilometers.units.two == 'Miles') {
					toKilometer = 'miles';
					fromKilometer = 'kilometers';
				}
				else if($scope.multiUnitData.kilometers.units.two == 'Kilometers') {
					toKilometer = 'kilometers';
					fromKilometer = 'miles';
				}
				
				var dataKilometer = {'config[attribute][kilometers][type]':toKilometer, 'current_values[values][0]': $scope.multiUnitData.kilometers.newValue.min,
					'current_values[values][1]': $scope.multiUnitData.kilometers.newValue.max, 'current_values[from_format]':fromKilometer};
			
				searchFormFactory.ChangeMultiUnitSelection($scope.domainID, $scope.user_id, dataKilometer, function(response) {
					if(response.status) {
						var temp = $scope.multiUnitData.kilometers.units.one;
						$scope.multiUnitData.kilometers.units.one = $scope.multiUnitData.kilometers.units.two;
						$scope.multiUnitData.kilometers.units.two = temp;
						
						$scope.multiUnitData.kilometers.options.floor = Math.floor(parseInt(response.display_format.kilometers.default_value.min));
						$scope.multiUnitData.kilometers.options.ceil = Math.ceil(parseInt(response.display_format.kilometers.default_value.max));
						
						if($scope.multiUnitData.kilometers.newValue.min == parseInt(response.display_format.kilometers.default_value.min)) {
							$scope.multiUnitData.kilometers.newValue.min = Math.floor(parseInt(response.display_format.kilometers.default_value.min));
						}
						else if(parseInt(response.display_format.kilometers.default_value.min) > parseInt(response.new_values[0])) {
							$scope.multiUnitData.kilometers.newValue.min = Math.floor(parseInt(response.display_format.kilometers.default_value.min));
						}
						else if(parseInt(response.new_values[0]) > parseInt(response.display_format.kilometers.default_value.max)) {
							$scope.multiUnitData.kilometers.newValue.min = Math.floor(parseInt(response.display_format.kilometers.default_value.max));
						}
						else {
							$scope.multiUnitData.kilometers.newValue.min = Math.floor(parseInt(response.new_values[0]));
						}
						
						if($scope.multiUnitData.kilometers.newValue.max == parseInt(response.display_format.kilometers.default_value.max)) {
							$scope.multiUnitData.kilometers.newValue.max = Math.ceil(parseInt(response.display_format.kilometers.default_value.max));
						}
						else if(parseInt(response.display_format.kilometers.default_value.max) < parseInt(response.new_values[1])) {
							$scope.multiUnitData.kilometers.newValue.max = Math.ceil(parseInt(response.display_format.kilometers.default_value.max));
						}
						else if(parseInt(response.new_values[1]) < parseInt(response.display_format.kilometers.default_value.min)) {
							$scope.multiUnitData.kilometers.newValue.max = Math.ceil(parseInt(response.display_format.kilometers.default_value.min));
						}
						else {
							$scope.multiUnitData.kilometers.newValue.max = Math.ceil(parseInt(response.new_values[1]));
						}
						
						$scope.multiUnitData.kilometers.displayFormat.kilometers.label = response.display_format.kilometers.field.label;
						$scope.multiUnitData.kilometers.displayFormat.kilometers.keyName = response.display_format.kilometers.key_name;
						$scope.multiUnitData.kilometers.displayFormat.kilometers.step = parseInt(response.display_format.kilometers.field.step);
						$scope.multiUnitData.kilometers.options.step = parseInt(response.display_format.kilometers.field.step);
						$scope.multiUnitData.kilometers.defaultValue.min = Math.floor(parseInt(response.display_format.kilometers.default_value.min));
						$scope.multiUnitData.kilometers.defaultValue.max = Math.ceil(parseInt(response.display_format.kilometers.default_value.max));
						$scope.multiUnitData.kilometers.valueFormatType = response.display_format.kilometers.value_format_type;
						$scope.multiUnitData.kilometers.mask.regular = response.display_format.kilometers.mask.regular;
						$scope.multiUnitData.kilometers.mask.verbose = response.display_format.kilometers.mask.verbose;
						$scope.multiUnitData.kilometers.mask.min = response.display_format.kilometers.mask.min;
						$scope.multiUnitData.kilometers.mask.max = response.display_format.kilometers.mask.max;
						$scope.multiUnitData.kilometers.mask.minVerbose = response.display_format.kilometers.mask.min_verbose;
						$scope.multiUnitData.kilometers.mask.maxVerbose = response.display_format.kilometers.mask.max_verbose;
						
						$scope.minKilometers = $scope.formNumberFormat($scope.multiUnitData.kilometers.newValue.min, 'kilometers', 'min');
						$scope.maxKilometers = $scope.formNumberFormat($scope.multiUnitData.kilometers.newValue.max, 'kilometers', 'max');
					} else {
						$log.error("ChangeMultiUnitSelection:error");
					}
				});
			}	
		}
		
		$scope.getSearchAttribute = function(value, callback) {
			var param = {domain_id: $scope.domainID};
			searchFormFactory.GetSearchAttribute(param, function(response) {
				if(response != null) {
					if(response.status) {
						angular.forEach(response.attribute_value.city, function(value, key) {
							value.ticked = false;
							value.count = 0;
							value.value.trim().length == 0 ? value.value = "Unclassified" : value.value = value.value;
							$scope.cityList.push(value);
						});
						
						angular.forEach(response.attribute_value.country, function(value, key) {
							value.ticked = false;
							value.count = 0;
							value.value.trim().length == 0 ? value.value = "Unclassified" : value.value = value.value;
							$scope.countryList.push(value);
						});

						angular.forEach(response.attribute_value.make, function(value, key) {
							value.ticked = false;
							value.count = 0;
							value.value.trim().length == 0 ? value.value = "Unclassified" : value.value = value.value;
							$scope.makeList.push(value);
						});
						angular.forEach(response.attribute_value.model, function(value, key) {
							value.ticked = false;
							value.count = 0;
							value.value.trim().length == 0 ? value.value = "Unclassified" : value.value = value.value;
							$scope.modelList.push(value);
						});
						angular.forEach(response.attribute_value.body, function(value, key) {
							value.ticked = false;
							value.count = 0;
							value.value.trim().length == 0 ? value.value = "Unclassified" : value.value = value.value;
							$scope.bodyList.push(value);
						});
						angular.forEach(response.attribute_value.transmission, function(value, key) {
							value.ticked = false;
							value.count = 0;
							value.value.trim().length == 0 ? value.value = "Unclassified" : value.value = value.value;
							$scope.transmissionList.push(value);
						});
						angular.forEach(response.attribute_value.colour, function(value, key) {
							value.ticked = false;
							value.count = 0;
							value.value.trim().length == 0 ? value.value = "Unclassified" : value.value = value.value;
							$scope.colourList.push(value);
						});
						angular.forEach(response.attribute_value.user_type, function(value, key) {
							value.ticked = false;
							value.value.trim().length == 0 ? value.value = "Unclassified" : value.value = value.value;
							$scope.userTypeList.push(value);
						});
						angular.forEach(response.attribute_value.doors, function(value, key) {
							value.ticked = false;
							value.value.trim().length == 0 ? value.value = "Unclassified" : value.value = value.value;
							$scope.doorsList.push(value);
						});
						angular.forEach(response.attribute_value.drivetrain, function(value, key) {
							value.ticked = false;
							value.value.trim().length == 0 ? value.value = "Unclassified" : value.value = value.value;
							$scope.drivetrainList.push(value);
						});
						
						callback(value);
					} else {
						$log.error("getSearchAttribute:error");
					}
				}
            });
		}    
		
		$scope.listSelect = function(value, form) {
			if(value == 'sort') {
		//		$log.debug($scope.sortList);
			}
			else {
				$scope.refreshList(value, form, function() {
					//Need to uncomment below function afterwards
				//	$scope.getSearchAttributeCount('city', 'make', 'model', 'body', 'transmission', 'colour');
				}); 
			}
		}
		
		$scope.refreshList = function(value, form, callback) {	
		     switch(value.toUpperCase()) {
				case 'COUNTRY':
				/*	angular.forEach($scope.cityList, function(value, key) { $scope.cityList[key].count = 0; });
					angular.forEach($scope.makeList, function(value, key) { $scope.makeList[key].count = 0; });
					angular.forEach($scope.bodyList, function(value, key) { $scope.bodyList[key].count = 0; });
					angular.forEach($scope.transmissionList, function(value, key) { $scope.transmissionList[key].count = 0; });
					angular.forEach($scope.colourList, function(value, key) { $scope.colourList[key].count = 0; });
					angular.forEach($scope.modelList, function(value, key) { $scope.modelList[key].count = 0; });*/
					
					$scope.closeCityList.invoke();
						angular.forEach($scope.cityList, function(value, key) {
							value.ticked = false;
						});
						
					if($scope.selectedCountry.length != 0) {				
						$scope.getCityData();
					}else{				
						$scope.changeCityLabel.invoke("Select");
						$scope.isCityDisabled = false;						
					}		
					$scope.getCityData();		
					break;				
				
				
				case 'CITY':
					$scope.clearCountryList.invoke();
					angular.forEach($scope.makeList, function(value, key) { $scope.makeList[key].count = 0; });
					angular.forEach($scope.bodyList, function(value, key) { $scope.bodyList[key].count = 0; });
					angular.forEach($scope.transmissionList, function(value, key) { $scope.transmissionList[key].count = 0; });
					angular.forEach($scope.colourList, function(value, key) { $scope.colourList[key].count = 0; });
					angular.forEach($scope.modelList, function(value, key) { $scope.modelList[key].count = 0; });	
					angular.forEach($scope.userTypeList, function(value, key) { $scope.userTypeList[key].count = 0; });	
					angular.forEach($scope.doorsList, function(value, key) { $scope.doorsList[key].count = 0; });	
					angular.forEach($scope.drivetrainList, function(value, key) { $scope.drivetrainList[key].count = 0; });						
					
					var index = $scope.cityList.indexOf($filter('filter')($scope.cityList, { ticked: true }, true)[0] );
					if(index === -1){
						$scope.changeCityLabel.invoke("Select");
						$scope.isCityDisabled = false;		
					}									
					break;		
					
				case 'MAKE':
					angular.forEach($scope.cityList, function(value, key) { $scope.cityList[key].count = 0; });
					angular.forEach($scope.bodyList, function(value, key) { $scope.bodyList[key].count = 0; });
					angular.forEach($scope.transmissionList, function(value, key) { $scope.transmissionList[key].count = 0; });
					angular.forEach($scope.colourList, function(value, key) { $scope.colourList[key].count = 0; });
					angular.forEach($scope.modelList, function(value, key) { $scope.modelList[key].count = 0; });
					angular.forEach($scope.userTypeList, function(value, key) { $scope.userTypeList[key].count = 0; });	
					angular.forEach($scope.doorsList, function(value, key) { $scope.doorsList[key].count = 0; });	
					angular.forEach($scope.drivetrainList, function(value, key) { $scope.drivetrainList[key].count = 0; });	
										
					if($scope.selectedMake.length == 0) {
						$scope.changeModelLabel.invoke("Choose a make first");						
						$scope.closeModelList.invoke();
						angular.forEach($scope.modelList, function(value, key) {
							if(value.ticked == true) {
								value.ticked = false;
							}
						});
						$timeout( function() {
							$scope.isModelDisabled = true;
						}, 250, true);
					}
					else {
						$scope.getModelData(function() {
							if($scope.modelList.length == 0) {
								$scope.closeModelList.invoke();
								angular.forEach($scope.modelList, function(value, key) {
									if(value.ticked == true) {
										value.ticked = false;
									}
								});
								$scope.changeModelLabel.invoke("No models found for make");
								$scope.isModelDisabled = true;
							}
							else {
								$scope.changeModelLabel.invoke("Select");
								$scope.isModelDisabled = false;
							}

							if(true == $scope.isDesktop && $scope.modelList.length > 0) {
								$scope.openModelList.invoke();
							}							
							//$scope.getSearchAttributeCount('model');
						});
					
					}
					break;
				case 'MODEL':
					angular.forEach($scope.cityList, function(value, key) { $scope.cityList[key].count = 0; });
					angular.forEach($scope.makeList, function(value, key) { $scope.makeList[key].count = 0; });
					angular.forEach($scope.bodyList, function(value, key) { $scope.bodyList[key].count = 0; });
					angular.forEach($scope.transmissionList, function(value, key) { $scope.transmissionList[key].count = 0; });
					angular.forEach($scope.colourList, function(value, key) { $scope.colourList[key].count = 0; });
					angular.forEach($scope.userTypeList, function(value, key) { $scope.userTypeList[key].count = 0; });	
					angular.forEach($scope.doorsList, function(value, key) { $scope.doorsList[key].count = 0; });	
					angular.forEach($scope.drivetrainList, function(value, key) { $scope.drivetrainList[key].count = 0; });						
					
					break;
				case 'BODY':
					angular.forEach($scope.cityList, function(value, key) { $scope.cityList[key].count = 0; });
					angular.forEach($scope.makeList, function(value, key) { $scope.makeList[key].count = 0; });
					angular.forEach($scope.transmissionList, function(value, key) { $scope.transmissionList[key].count = 0; });
					angular.forEach($scope.colourList, function(value, key) { $scope.colourList[key].count = 0; });
					angular.forEach($scope.modelList, function(value, key) { $scope.modelList[key].count = 0; });
					angular.forEach($scope.userTypeList, function(value, key) { $scope.userTypeList[key].count = 0; });	
					angular.forEach($scope.doorsList, function(value, key) { $scope.doorsList[key].count = 0; });	
					angular.forEach($scope.drivetrainList, function(value, key) { $scope.drivetrainList[key].count = 0; });						
					
					break;
				case 'TRANSMISSION': 
					angular.forEach($scope.cityList, function(value, key) { $scope.cityList[key].count = 0; });
					angular.forEach($scope.makeList, function(value, key) { $scope.makeList[key].count = 0; });
					angular.forEach($scope.bodyList, function(value, key) { $scope.bodyList[key].count = 0; });
					angular.forEach($scope.colourList, function(value, key) { $scope.colourList[key].count = 0; });
					angular.forEach($scope.modelList, function(value, key) { $scope.modelList[key].count = 0; });
					angular.forEach($scope.userTypeList, function(value, key) { $scope.userTypeList[key].count = 0; });	
					angular.forEach($scope.doorsList, function(value, key) { $scope.doorsList[key].count = 0; });	
					angular.forEach($scope.drivetrainList, function(value, key) { $scope.drivetrainList[key].count = 0; });						
					
					break;
				case 'COLOUR':  
					angular.forEach($scope.cityList, function(value, key) { $scope.cityList[key].count = 0; });
					angular.forEach($scope.makeList, function(value, key) { $scope.makeList[key].count = 0; });
					angular.forEach($scope.bodyList, function(value, key) { $scope.bodyList[key].count = 0; });
					angular.forEach($scope.transmissionList, function(value, key) { $scope.transmissionList[key].count = 0; });
					angular.forEach($scope.modelList, function(value, key) { $scope.modelList[key].count = 0; });
					angular.forEach($scope.userTypeList, function(value, key) { $scope.userTypeList[key].count = 0; });	
					angular.forEach($scope.doorsList, function(value, key) { $scope.doorsList[key].count = 0; });	
					angular.forEach($scope.drivetrainList, function(value, key) { $scope.drivetrainList[key].count = 0; });						
					
					break;
				case 'USERTYPE':  
					angular.forEach($scope.cityList, function(value, key) { $scope.cityList[key].count = 0; });
					angular.forEach($scope.makeList, function(value, key) { $scope.makeList[key].count = 0; });
					angular.forEach($scope.bodyList, function(value, key) { $scope.bodyList[key].count = 0; });
					angular.forEach($scope.transmissionList, function(value, key) { $scope.transmissionList[key].count = 0; });
					angular.forEach($scope.colourList, function(value, key) { $scope.colourList[key].count = 0; });
					angular.forEach($scope.modelList, function(value, key) { $scope.modelList[key].count = 0; });
					angular.forEach($scope.doorsList, function(value, key) { $scope.doorsList[key].count = 0; });	
					angular.forEach($scope.drivetrainList, function(value, key) { $scope.drivetrainList[key].count = 0; });	
					
					break;
				case 'DOORS':  
					angular.forEach($scope.cityList, function(value, key) { $scope.cityList[key].count = 0; });
					angular.forEach($scope.makeList, function(value, key) { $scope.makeList[key].count = 0; });
					angular.forEach($scope.bodyList, function(value, key) { $scope.bodyList[key].count = 0; });
					angular.forEach($scope.transmissionList, function(value, key) { $scope.transmissionList[key].count = 0; });
					angular.forEach($scope.colourList, function(value, key) { $scope.colourList[key].count = 0; });
					angular.forEach($scope.modelList, function(value, key) { $scope.modelList[key].count = 0; });
					angular.forEach($scope.userTypeList, function(value, key) { $scope.userTypeList[key].count = 0; });	
					angular.forEach($scope.drivetrainList, function(value, key) { $scope.drivetrainList[key].count = 0; });	
					break;
					
				case 'DRIVETRAIN':  
					angular.forEach($scope.cityList, function(value, key) { $scope.cityList[key].count = 0; });
					angular.forEach($scope.makeList, function(value, key) { $scope.makeList[key].count = 0; });
					angular.forEach($scope.bodyList, function(value, key) { $scope.bodyList[key].count = 0; });
					angular.forEach($scope.transmissionList, function(value, key) { $scope.transmissionList[key].count = 0; });
					angular.forEach($scope.colourList, function(value, key) { $scope.colourList[key].count = 0; });
					angular.forEach($scope.modelList, function(value, key) { $scope.modelList[key].count = 0; });
					angular.forEach($scope.userTypeList, function(value, key) { $scope.userTypeList[key].count = 0; });	
					angular.forEach($scope.doorsList, function(value, key) { $scope.doorsList[key].count = 0; });	
					break;	
								
				default:
		    }
			callback();
		}
				
		$scope.getSearchAttributeCount = function() {
			var argsArray = Array.prototype.slice.call(arguments);
			
			for(var i = 0; i < argsArray.length; i++) {
				var value = argsArray[i];
				var data = $scope.prepareSearchRequestBodyData();
				searchFormFactory.GetSearchAttributeCount($scope.domainID, value, data, function(value, response) {
					if(response != null){
						if(undefined != response.status && response.status == 1) {
							switch(value.toUpperCase()) {
								case 'CITY':
									angular.forEach(response.result.city, function(value, key) {
										angular.forEach(value, function(value1, key1) {
											var index = $scope.cityList.indexOf($filter('filter')($scope.cityList, { integer_representation: key1 }, true)[0] );
											if(undefined != $scope.cityList[index]) {
												$scope.cityList[index].count = value1.count;
											}
										});   
									});
									break;								
								case 'MAKE':
									angular.forEach(response.result.make, function(value, key) {
										angular.forEach(value, function(value1, key1) {
											var index = $scope.makeList.indexOf($filter('filter')($scope.makeList, { integer_representation: key1 }, true)[0] );
											if(undefined != $scope.makeList[index]) {
												$scope.makeList[index].count = value1.count;
											}
										});
									});
									break;
								case 'MODEL':
									angular.forEach(response.result.model, function(value, key) {
										angular.forEach(value, function(value1, key1) {
											var index = $scope.modelList.indexOf($filter('filter')($scope.modelList, { integer_representation: key1 }, true)[0] );
											if(undefined != $scope.modelList[index]) {
												$scope.modelList[index].count = value1.count;
											}
										});    
									});                                             
									break;
								case 'BODY':
									angular.forEach(response.result.body, function(value, key) {
										angular.forEach(value, function(value1, key1) {
											var index = $scope.bodyList.indexOf($filter('filter')($scope.bodyList, { integer_representation: key1 }, true)[0] );
											if(undefined != $scope.bodyList[index]) {
												$scope.bodyList[index].count = value1.count;
											}
										});               
									});
									break;
								case 'TRANSMISSION':
									angular.forEach(response.result.transmission, function(value, key) {
										angular.forEach(value, function(value1, key1) {
											var index = $scope.transmissionList.indexOf($filter('filter')($scope.transmissionList, { integer_representation: key1 }, true)[0] );
											if(undefined != $scope.transmissionList[index]) {
												$scope.transmissionList[index].count = value1.count;
											}
										});  
									});
									break;
								case 'COLOUR':
									angular.forEach(response.result.colour, function(value, key) {
										angular.forEach(value, function(value1, key1) {
											var index = $scope.colourList.indexOf($filter('filter')($scope.colourList, { integer_representation: key1 }, true)[0] );
											if(undefined != $scope.colourList[index]) {
												$scope.colourList[index].count = value1.count;
											}
										});    
									});
									break;
								default:
							}
						} else {
							$log.error("getSearchAttributeCount:error");
						}
					}else{
						$log.error("getSearchAttributeCount:error");
					}
				});
			}
		}    
		
		$scope.getSearchAttributeCount2 = function() {
			var data = $scope.prepareSearchRequestBodyData();
			
			var argsArray = Array.prototype.slice.call(arguments);
			
			var attributes = '';
			
			for(var i = 0; i < argsArray.length; i++) {
				if(i+1 != argsArray.length) {
					attributes += argsArray[i] + ',';
				}
				else {
					attributes += argsArray[i];
				}
			}
			
			searchFormFactory.GetSearchAttributeCount($scope.domainID, attributes, data, function(value1, response) {
				if(undefined != response.status && response.status == 1) {
					for(var i = 0; i < argsArray.length; i++) {
						switch(argsArray[i].toUpperCase()) {
							case 'CITY':
								angular.forEach(response.result.city, function(value, key) {
									angular.forEach(value, function(value1, key1) {
										var index = $scope.cityList.indexOf($filter('filter')($scope.cityList, { integer_representation: key1 }, true)[0] );
										if(undefined != $scope.cityList[index]) {
											$scope.cityList[index].count = value1.count;
										}
									});   
								});
								break;
							case 'MAKE':
								angular.forEach(response.result.make, function(value, key) {
									angular.forEach(value, function(value1, key1) {
										var index = $scope.makeList.indexOf($filter('filter')($scope.makeList, { integer_representation: key1 }, true)[0] );
										if(undefined != $scope.makeList[index]) {
											$scope.makeList[index].count = value1.count;
										}
									});
								});
								break;
							case 'MODEL':
								angular.forEach(response.result.model, function(value, key) {
									angular.forEach(value, function(value1, key1) {
										var index = $scope.modelList.indexOf($filter('filter')($scope.modelList, { integer_representation: key1 }, true)[0] );
										if(undefined != $scope.modelList[index]) {
											$scope.modelList[index].count = value1.count;
										}
									});    
								});                                             
								break;
							case 'BODY':
								angular.forEach(response.result.body, function(value, key) {
									angular.forEach(value, function(value1, key1) {
										var index = $scope.bodyList.indexOf($filter('filter')($scope.bodyList, { integer_representation: key1 }, true)[0] );
										if(undefined != $scope.bodyList[index]) {
											$scope.bodyList[index].count = value1.count;
										}
									});               
								});
								break;
							case 'TRANSMISSION':
								angular.forEach(response.result.transmission, function(value, key) {
									angular.forEach(value, function(value1, key1) {
										var index = $scope.transmissionList.indexOf($filter('filter')($scope.transmissionList, { integer_representation: key1 }, true)[0] );
										if(undefined != $scope.transmissionList[index]) {
											$scope.transmissionList[index].count = value1.count;
										}
									});  
								});
								break;
							case 'COLOUR':
								angular.forEach(response.result.colour, function(value, key) {
									angular.forEach(value, function(value1, key1) {
										var index = $scope.colourList.indexOf($filter('filter')($scope.colourList, { integer_representation: key1 }, true)[0] );
										if(undefined != $scope.colourList[index]) {
											$scope.colourList[index].count = value1.count;
										}
									});    
								});
								break;
							default:
						}
					}
				} else {
					$log.error("getSearchAttributeCount:error");
				}
			});
		}    
		
		$scope.$watch('searching', function() {
			if($scope.searching == true && $scope.checkStatus == true && $scope.isSaveSearchEnable == true) {
				var data = $scope.prepareSearchRequestBodyData();
				
				searchFormFactory.CreateSearch($scope.domainID, data, function(response) {
                    if(response.status) {
						$scope.showClearButton = false;
						$scope.showNewSearchButton = true;
						$scope.isSaveSearchEnable = false;
                    } else {
                        $log.error("Create search:error");
                    }
                });    
			}
			else if($scope.searching == true && $scope.isSaveSearchEnable == false) {
				var data = $scope.prepareSearchRequestBodyData();
				
				searchFormFactory.UpdateSavedSearch($scope.domainID, $scope.searchID, data, function(response) {
                    if(response.status) {
                        $log.debug(response);
                    } else {
                        $log.error("Edit search:error");
                    }
                });    
			}
		});
		
	/*	$scope.saveCheckBoxClick = function() {
			if($scope.checkStatus == true) {
				if($scope.selectedCity.length > 0 || $scope.selectedCountry.length > 0 || $scope.selectedMake.length > 0 
				|| $scope.selectedModel.length > 0 || $scope.selectedBody.length > 0 || $scope.selectedTransmission.length > 0
				|| $scope.selectedColour.length > 0 || $scope.multiUnitData.price.newValue.min != $scope.multiUnitData.price.defaultValue.min
				|| $scope.multiUnitData.price.newValue.max != $scope.multiUnitData.price.defaultValue.max
				|| $scope.multiUnitData.year.newValue.min != $scope.multiUnitData.year.defaultValue.min
				|| $scope.multiUnitData.year.newValue.max != $scope.multiUnitData.year.defaultValue.max
				|| $scope.multiUnitData.kilometers.newValue.min != $scope.multiUnitData.kilometers.defaultValue.min
				|| $scope.multiUnitData.kilometers.newValue.max != $scope.multiUnitData.kilometers.defaultValue.max
				|| $scope.multiUnitData.belowmarket.newValue.min != $scope.multiUnitData.belowmarket.defaultValue.min
				|| $scope.multiUnitData.belowmarket.newValue.max != $scope.multiUnitData.belowmarket.defaultValue.max
				|| $scope.selectedUserType.length > 0 || $scope.selectedDoors.length > 0  || $scope.selectedDrivetrain.length > 0 
				|| $scope.checkCarsWOImage == true) 
				{
					$scope.isDataAvailToSave = true;
				}
			}
			
			//~ if($scope.isSaveSearchEnable != true) {
				//~ $scope.isDataAvailToSave = true;
			//~ }
		}  
		  */
		
		$scope.saveCheckBoxClick = function() {
			if($scope.checkStatus == true) {
				var cityIndex = $scope.cityList.indexOf($filter('filter')($scope.cityList, { ticked: true }, true)[0] );
				var countryIndex = $scope.countryList.indexOf($filter('filter')($scope.countryList, { ticked: true }, true)[0] );
				var makeIndex = $scope.makeList.indexOf($filter('filter')($scope.makeList, { ticked: true }, true)[0] );
				var modelIndex = $scope.modelList.indexOf($filter('filter')($scope.modelList, { ticked: true }, true)[0] );
				var bodyIndex = $scope.bodyList.indexOf($filter('filter')($scope.bodyList, { ticked: true }, true)[0] );
				var transmissionIndex = $scope.transmissionList.indexOf($filter('filter')($scope.transmissionList, { ticked: true }, true)[0] );
				var colourIndex = $scope.colourList.indexOf($filter('filter')($scope.colourList, { ticked: true }, true)[0] );
				var userIndex = $scope.userTypeList.indexOf($filter('filter')($scope.userTypeList, { ticked: true }, true)[0] );
				var doorsIndex = $scope.doorsList.indexOf($filter('filter')($scope.doorsList, { ticked: true }, true)[0] );
				var drivetrainIndex = $scope.drivetrainList.indexOf($filter('filter')($scope.drivetrainList, { ticked: true }, true)[0] );
				
				if(cityIndex != -1 || countryIndex != -1 || makeIndex != -1 || modelIndex != -1 || bodyIndex != -1 || transmissionIndex != -1
					|| colourIndex != -1 || userIndex != -1 || doorsIndex != -1 || drivetrainIndex != -1 || $scope.isPriceChanged 
					|| $scope.isYearChanged || $scope.isKmChanged || $scope.isBmaChanged || $scope.checkCarsWOImage == true) 
				{ 	
					$scope.isDataAvailToSave = true;
				}
			}			
		}
		
		$scope.formatDateDisplay = function(raw_value) {
			var formated_value = "";
			var tempValue = new Date("November 21, 2016");
			formated_value += tempValue.getDate() + "/" + tempValue.getMonth() + "/" + tempValue.getFullYear();
			return formated_value;
		}
	
		$scope.searchSubmit = function(value) {
			$scope.isDataAvailToSave = false;
			$scope.emptySearchValue='';
			$scope.keywordSearchValue = $scope.issearchByKeyword ? $scope.keywordSearchValue : ''; 
			$scope.issearchByKeyword = false;
			if($scope.scrollLoadData.busy == false || $scope.scrollLoadData.busy == undefined){
				$scope.scrollLoadData.busy= true;
				if('FULL' == value.toUpperCase() && $scope.checkStatus == true) {
					if($scope.$storage.searchID != undefined && $scope.$storage.previousState != null && 'SAVEDSEARCH' == $scope.$storage.previousState.toUpperCase()) {
						if(!$scope.fromSavedSearch){
							$scope.saveCheckBoxClick();
							if($scope.isDataAvailToSave == false || $scope.isDataAvailToSave == undefined) {
								$scope.popupMessage = "Please select atleast one item before saving search.";
								$scope.isPopupVisible = true;
								$scope.scrollLoadData.busy= false;
								return;
							}
						}
					}else{						
						$scope.saveCheckBoxClick();
						if(($scope.isUserLoggedIn == false || $scope.isUserLoggedIn == undefined) || ($scope.isDataAvailToSave == false || $scope.isDataAvailToSave == undefined)) {
							$scope.scrollLoadData.busy = false;
							if($scope.isUserLoggedIn == false || $scope.isUserLoggedIn == undefined) {
								//$scope.popupMessage = "Please login before saving search.";
								this.onExit('login');
								$state.go('login');
							}
							else if($scope.isDataAvailToSave == false || $scope.isDataAvailToSave == undefined) {
								$scope.popupMessage = "Please select atleast one item before saving search.";
								$scope.isPopupVisible = true;
								$scope.scrollLoadData.busy= false;
							}						
							return;
						}
				}
			}
				if(!$scope.isDesktop){
					$scope.showSearchForm = false;
					$scope.showSearchResult = true;
				}	
				$scope.searchResult = [];
				$scope.pageNumber = 1;
				$scope.counter = 0;
				
				$scope.sortDropDownDisable = true;
				$scope.searching = true;
				var data = $scope.prepareSearchRequestBodyData();
				
				searchFormFactory.GetSearchItemList($scope.domainID, data, function(response) {
					// $scope.checkStatus = false;
					$scope.searching = false;
					
					$scope.$storage.search_request = data;
					var isResultExit = false;
					if(response != null){
						isResultExit = true;					
					
						if(undefined != response.status && 1 == response.status) {
							$scope.$storage.total_count = response.result.total_count;
							$scope.$storage.attribute_label = response.result.attribute_label;
							$scope.$storage.search_result = response.result.search_result;
							$scope.$storage.user_display_format = response.result.user_display_format;
							if($scope.isDesktop){
								//$scope.showSearchForm = true;
								if(true == $scope.showSearchForm) {

								}
								else {
									$scope.showSearchForm = false;
									$scope.showSearchResult = true;
									$scope.newSearchResultMargin = '0px';
									$scope.newSearchResultBoxWidth = '25%';
									$scope.newSearchResultSection = w.width();
								}
							}						
							
							$scope.scrollToTop();
							
							$scope.requestData = data;
							$scope.totalCount = response.result.total_count;
							$scope.attributeLabel = response.result.attribute_label;
							$scope.userDisplayFormat = response.result.user_display_format;
							$scope.userHasProductFlag = response.result.user_has_product_flag;
							$scope.scrollLoadData.setData($scope.domainID, $scope.perPageShow, $scope.requestData, function() {
								$scope.busy = $scope.scrollLoadData.busy;
							});
									
							$scope.scrollLoadData.busy= false;
							$scope.loadMore();						
							$scope.sortDropDownDisable = false;
							//~ $scope.onExit('show');
							//~ $state.go('show', {requestData: data, totalCount:response.result.total_count, attributeLabel:response.result.attribute_label, searchResult:response.result.search_result, userDisplayFormat:response.result.user_display_format});				
						} else {
							isResultExit = false;	
						}
					}					
					if(isResultExit == false){
						if(!$scope.isDesktop){
							$scope.showSearchForm = false;
						}
						$scope.showSearchResult = true;
						$scope.scrollLoadData.busy= false;	
						$scope.$storage.total_count = 0;
						$scope.totalCount = 0;
						$scope.searchResult = [];
						$log.error("GetSearchItemList:error");
					}
				});
			}
		}
		
		$scope.prepareSearchRequestBodyData = function() {
			var requestBodyData = {'attribute[city][must_have]':1, 'attribute[country][must_have]':1, 'attribute[make][must_have]':1, 
				'attribute[model][must_have]':1, 'attribute[price][must_have]':1, 'attribute[year][must_have]':1, 
				'attribute[kilometers][must_have]':1, 'attribute[body][must_have]':1, 'attribute[transmission][must_have]':1,
				'attribute[colour][must_have]':1, 'attribute[doors][must_have]':1, 'attribute[image0][must_have]':1,
				'attribute[below_market_average_percent][must_have]':1, 'attribute[user_type][must_have]':1, 'attribute[drivetrain][must_have]':1};
			
			var data = requestBodyData;
			
			if($scope.cityList.length > 0) {
				var temp = [];
				angular.forEach($scope.cityList, function(value, key) {
					if(true == value.ticked) {
						temp.push(value.integer_representation);
					}
				});
				if(temp.length > 0) {
					$.extend(true, data, {'attribute[city][values][value][]':temp});
				}
			}
			
			if($scope.countryList.length > 0) {
				var temp = [];
				angular.forEach($scope.countryList, function(value, key) {
					if(true == value.ticked) {
						temp.push(value.integer_representation);
					}
				});
				if(temp.length > 0) {
					$.extend(true, data, {'attribute[country][values][value][]':temp});
				}
			}
			
			
			if($scope.makeList.length > 0) {
				var temp1 = [];
				var temp2 = [];
				
				angular.forEach($scope.makeList, function(value, key) {
					if(true == value.ticked) {
						if(value.group == 0) {
							temp1.push(value.integer_representation);
						}
						else if(value.group == 1) {
							temp2.push(value.integer_representation);
						}
					}
				});
				if(temp1.length > 0) {
					$.extend(true, data, {'attribute[make][values][value][]':temp1});
				}
				if(temp2.length > 0) {
					$.extend(true, data, {'attribute[make][values][group][]':temp2});
				}
			}
			
			if($scope.modelList.length > 0) {
				$log.debug($scope.modelList);
				var temp = [];
				angular.forEach($scope.modelList, function(value, key) {
					if(true == value.ticked) {
						temp.push(value.integer_representation);
					}
				});
				
				if(temp.length > 0) {
					$.extend(true, data, {'attribute[model][values][value][]':temp});
				}
			}
			
			
			if($scope.bodyList.length > 0) {
				var temp = [];
				angular.forEach($scope.bodyList, function(value, key) {
					if(true == value.ticked) {
						temp.push(value.integer_representation);
					}
				});
				if(temp.length > 0) {
					$.extend(true, data, {'attribute[body][values][group][]':temp});
				}
			}
			
			if($scope.transmissionList.length > 0) {
				var temp = [];
				angular.forEach($scope.transmissionList, function(value, key) {
					if(true == value.ticked) {
						temp.push(value.integer_representation);
					}
				});
				if(temp.length > 0) {
					$.extend(true, data, {'attribute[transmission][values][group][]':temp});
				}
			}
			
			if($scope.colourList.length > 0) {
				var temp = [];
				angular.forEach($scope.colourList, function(value, key) {
					if(true == value.ticked) {
						temp.push(value.integer_representation);
					}
				});
				if(temp.length > 0) {
					$.extend(true, data, {'attribute[colour][values][group][]':temp});
				}
			}
			
			if($scope.userTypeList.length > 0) {
				var temp = [];
				angular.forEach($scope.userTypeList, function(value, key) {
					if(true == value.ticked) {
						temp.push(value.integer_representation);
					}
				});
				if(temp.length > 0) {
					$.extend(true, data, {'attribute[user_type][values][group][]':temp});
				}
			}
			
			if($scope.doorsList.length > 0) {
				var temp = [];
				angular.forEach($scope.doorsList, function(value, key) {
					if(true == value.ticked) {
						temp.push(value.integer_representation);
					}
				});
				if(temp.length > 0) {
					$.extend(true, data, {'attribute[doors][values][group][]':temp});
				}
			}
			if($scope.drivetrainList.length > 0) {
				var temp = [];
				angular.forEach($scope.drivetrainList, function(value, key) {
					if(true == value.ticked) {
						temp.push(value.integer_representation);
					}
				});
				if(temp.length > 0) {
					$.extend(true, data, {'attribute[drivetrain][values][group][]':temp});
				}
			}
			
			$.extend(true, data, {'attribute[price][display_format]':$scope.multiUnitData.price.displayFormat.price.keyName});
			$.extend(true, data, {'attribute[kilometers][display_format]':$scope.multiUnitData.kilometers.displayFormat.kilometers.keyName});
		
			// minimum price
			if($scope.multiUnitData.price.newValue.min == $scope.multiUnitData.price.defaultValue.min) {
				$.extend(true, data, {'attribute[price][value][min]':''});
			}
			else {
				$.extend(true, data, {'attribute[price][value][min]':$scope.multiUnitData.price.newValue.min});
			}
			
			// maximum price
			if($scope.multiUnitData.price.newValue.max == $scope.multiUnitData.price.defaultValue.max) {
				$.extend(true, data, {'attribute[price][value][max]':''});
			}
			else {
				$.extend(true, data, {'attribute[price][value][max]':$scope.multiUnitData.price.newValue.max});
			}
			
			// minimum year
			if($scope.multiUnitData.year.newValue.min == $scope.multiUnitData.year.defaultValue.min) {
				$.extend(true, data, {'attribute[year][value][min]':''});
			}
			else {
				$.extend(true, data, {'attribute[year][value][min]':$scope.multiUnitData.year.newValue.min});
			}
			
			// maximum year
			if($scope.multiUnitData.year.newValue.max == $scope.multiUnitData.year.defaultValue.max) {
				$.extend(true, data, {'attribute[year][value][max]':''});
			}
			else {
				$.extend(true, data, {'attribute[year][value][max]':$scope.multiUnitData.year.newValue.max});
			}
			
			// minimum kilometers
			if($scope.multiUnitData.kilometers.newValue.min == $scope.multiUnitData.kilometers.defaultValue.min) {
				$.extend(true, data, {'attribute[kilometers][value][min]':''});
			}
			else {
				$.extend(true, data, {'attribute[kilometers][value][min]':$scope.multiUnitData.kilometers.newValue.min});
			}
			
			// maximum kilometers
			if($scope.multiUnitData.kilometers.newValue.max == $scope.multiUnitData.kilometers.defaultValue.max) {
				$.extend(true, data, {'attribute[kilometers][value][max]':''});
			}
			else {
				$.extend(true, data, {'attribute[kilometers][value][max]':$scope.multiUnitData.kilometers.newValue.max});
			}
			
			// minimum belowmarket
			if($scope.multiUnitData.belowmarket.newValue.min == $scope.multiUnitData.belowmarket.defaultValue.min) {
				$.extend(true, data, {'attribute[below_market_average_percent][value][min]':''});
			}
			else {
				$.extend(true, data, {'attribute[below_market_average_percent][value][min]':$scope.multiUnitData.belowmarket.newValue.min});
			}
			
			// maximum belowmarket
			if($scope.multiUnitData.belowmarket.newValue.max == $scope.multiUnitData.belowmarket.defaultValue.max) {
				$.extend(true, data, {'attribute[below_market_average_percent][value][max]':''});
			}
			else {
				$.extend(true, data, {'attribute[below_market_average_percent][value][max]':$scope.multiUnitData.belowmarket.newValue.max});
			}
			
			if($scope.checkNotificationStatus) {
				$.extend(true, data, {'enable_notification':1});
			}
			else {
				$.extend(true, data, {'enable_notification':0});
			}
			
			if($scope.$storage.previousState != null && 'SAVEDSEARCH' == $scope.$storage.previousState.toUpperCase()) {
				$.extend(true, data, {'property[edit_search]':'Save'});
				$.extend(true, data, {'property[search_id]':$scope.searchID});
				$.extend(true, data, {'edit_first_load':1});
			}
			
			if($scope.checkCarsWOImage) {
				$.extend(true, data, {'attribute[image0][values][value][]':1});
			}
			
			$.extend(true, data, {'save_submit':'true'});
			
			if('post_date' == $scope.sortSelected.key) {
				$.extend(true, data, {'sort[post_date]':$scope.sortSelected.value});
			}
			else if('heuristic' == $scope.sortSelected.key) {
				$.extend(true, data, {'sort[heuristic]':$scope.sortSelected.value});
			}
			else if('price' == $scope.sortSelected.key) {
				$.extend(true, data, {'sort[price]':$scope.sortSelected.value});
			}
			else if('year' == $scope.sortSelected.key) {
				$.extend(true, data, {'sort[year]':$scope.sortSelected.value});
			}
			
			$.extend(true, data, {'attribute[price][display_format]':$scope.multiUnitData.price.displayFormat.price.keyName});
			$.extend(true, data, {'attribute[kilometers][display_format]':$scope.multiUnitData.kilometers.displayFormat.kilometers.keyName});
			
			return data;
		}
		
		$scope.myStyle = {};

	 /*   $scope.hidePopup = function () {
             $scope.isPopupVisible = false;
        }
		*/
		$scope.loadMore = function() {
			if($scope.totalCount > 0 && $scope.counter < $scope.totalCount) {
				$scope.scrollLoadData.nextPage($scope.pageNumber, function(response) {
					if(response != null){
						$scope.searchResult = $scope.searchResult.concat(response.result.search_result);
						$scope.userHasProductFlag = response.result.user_has_product_flag;
						$scope.userDisplayFormat = response.result.user_display_format;
						$scope.busy = $scope.scrollLoadData.busy;
						$scope.counter = $scope.counter + $scope.perPageShow;
						$scope.pageNumber++;
					}
				});
			}
		}			

		$scope.searchSubmitKeyword = function(value) {
		//	$scope.clearForm('searchByKeyword');
			
		//	$scope.searchResult = [];
		/*	$scope.pageNumber = 1;
			$scope.counter = 0;*/
			
			if(null == $scope.keywordSearchValue || undefined == $scope.keywordSearchValue || $scope.keywordSearchValue.trim().length == 0) {
				$scope.emptySearchValue="Please enter some keywords";
			/*	$scope.busy = false;
				$scope.scrollLoadData.busy = false
				if($scope.isDesktop){
					$scope.showSearchForm = true;
				}else{
					$scope.showSearchForm = false;
				}		
				$scope.showSearchResult = true;
				$scope.scrollToTop();
				$scope.totalCount = 0;*/
				//$scope.searchSubmit('full');	
			}
			else {
				$scope.clearForm('searchByKeyword');
				$scope.emptySearchValue = '';
				$scope.pageNumber = 1;
				$scope.counter = 0;
         
                $scope.sortDropDownDisable = true;
				if('SEARCHFORM' == value.toUpperCase()) {
					$scope.busy = true;
					$scope.scrollLoadData.busy = true;
					if($scope.isDesktop){
						//$scope.showSearchForm = true;
						if(false == $scope.showSearchForm) {
							$scope.showSearchForm = false;
							$scope.showSearchResult = true;
							$scope.newSearchResultMargin = '0px';
							$scope.newSearchResultBoxWidth = '25%';
							$scope.newSearchResultSection = w.width();
						}
					}else{
						$scope.showSearchForm = false;
						$scope.showSearchResult = true;
					}		
				}
				else if('SEARCHRESULT' == value.toUpperCase()) {
					$scope.busy = true;
					$scope.scrollLoadData.busy = true;
					if($scope.isDesktop){
						//$scope.showSearchForm = true;
					}else{
						$scope.showSearchForm = false;
					}		
					$scope.showSearchResult = true;
				}
				
				$scope.scrollToTop();
				
				searchFormFactory.GetSearchByKeyword($scope.domainID, $scope.keywordSearchValue, function(response) {
					if(1 == response.status) {
						var modelFlag = false;
						var dataFlag = false;
						angular.forEach(response.attribute_value, function(value, key) {
							if('CITY' == value.attribute_name.toUpperCase()) {
								var index = $scope.cityList.indexOf($filter('filter')($scope.cityList, { integer_representation: value.integer_representation }, true)[0] );
								if(undefined != $scope.cityList[index]) {
									$scope.cityList[index].ticked = true;
									dataFlag = true;
								}
							}
							else if('COUNTRY' == value.attribute_name.toUpperCase()) {
								var index = $scope.countryList.indexOf($filter('filter')($scope.countryList, { integer_representation: value.integer_representation }, true)[0] );
								if(undefined != $scope.countryList[index]) {
									$scope.countryList[index].ticked = true;
									dataFlag = true;
								}
							}
							else if('MAKE' == value.attribute_name.toUpperCase()) {
								var index = $scope.makeList.indexOf($filter('filter')($scope.makeList, { integer_representation: value.integer_representation }, true)[0] );
								if(undefined != $scope.makeList[index]) {
									$scope.makeList[index].ticked = true;
									modelFlag = true;
									dataFlag = true;
								}
							}
							else if('MODEL' == value.attribute_name.toUpperCase()) {
								modelFlag = true;
							}
							else if('BODY' == value.attribute_name.toUpperCase()) {
								var index = $scope.bodyList.indexOf($filter('filter')($scope.bodyList, { integer_representation: value.integer_representation }, true)[0] );
								if(undefined != $scope.bodyList[index]) {
									$scope.bodyList[index].ticked = true;
									dataFlag = true;
								}
							}
							else if('TRANSMISSION' == value.attribute_name.toUpperCase()) {
								var index = $scope.transmissionList.indexOf($filter('filter')($scope.transmissionList, { integer_representation: value.integer_representation }, true)[0] );
								if(undefined != $scope.transmissionList[index]) {
									$scope.transmissionList[index].ticked = true;
									dataFlag = true;
								}
							}
							else if('COLOUR' == value.attribute_name.toUpperCase()) {
								var index = $scope.colourList.indexOf($filter('filter')($scope.colourList, { integer_representation: value.integer_representation }, true)[0] );
								if(undefined != $scope.colourList[index]) {
									$scope.colourList[index].ticked = true;
									dataFlag = true;
								}
							}
							else if('PRICE' == value.attribute_name.toUpperCase()) {
								$scope.multiUnitData.price.newValue.min = value.value;
								$scope.multiUnitData.price.newValue.max = value.value;
								$scope.rangeSliderChange('price');
								dataFlag = true;
							}
							else if('YEAR' == value.attribute_name.toUpperCase()) {
								if($scope.multiUnitData.year.newValue.min <= value.value && $scope.multiUnitData.year.newValue.max >= value.value){
									$scope.multiUnitData.year.newValue.min = value.value;
									$scope.multiUnitData.year.newValue.max = value.value;
									$scope.rangeSliderChange('year');
								}else {
									$scope.multiUnitData.year.newValue.min = value.value;
									$scope.multiUnitData.year.newValue.max = value.value;
									$scope.minYear = value.value;
									$scope.maxYear = value.value;		
									$scope.isYearChanged = true;								
								}			
								$scope.isSearchedYearByKeyword = true;	
								dataFlag = true;
							}
							else if('KILOMETERS' == value.attribute_name.toUpperCase()) {
								$scope.multiUnitData.kilometers.newValue.min = value.value;
								$scope.multiUnitData.kilometers.newValue.max = value.value;
								$scope.rangeSliderChange('kilometers');
								dataFlag = true;
							}
							else if('DOORS' == value.attribute_name.toUpperCase()) {
								var index = $scope.doorsList.indexOf($filter('filter')($scope.doorsList, { integer_representation: value.integer_representation }, true)[0] );
								if(undefined != $scope.doorsList[index]) {
									$scope.doorsList[index].ticked = true;
									dataFlag = true;
								}
							}
							else if('DRIVETRAIN' == value.attribute_name.toUpperCase()) {
								var index = $scope.drivetrainList.indexOf($filter('filter')($scope.drivetrainList, { integer_representation: value.integer_representation }, true)[0] );
								if(undefined != $scope.drivetrainList[index]) {
									$scope.drivetrainList[index].ticked = true;
									dataFlag = true;
								}
							}
						});
						
						if(true == modelFlag) {
							$scope.isModelDisabled = false;
							$scope.getModelData(function() {
								angular.forEach(response.attribute_value, function(value, key) {
									if('MODEL' == value.attribute_name.toUpperCase()) {
										var index = $scope.modelList.indexOf($filter('filter')($scope.modelList, { integer_representation: value.integer_representation }, true)[0] );
										if(undefined != $scope.modelList[index]) {
											$scope.modelList[index].ticked = true;		
											dataFlag = true;										
										}
									}
								});
								modelFlag = false;		
								if($scope.modelList.length > 0){
									$scope.changeModelLabel.invoke("Select");
									$scope.isModelDisabled = false;		
								}							
							});
							
							if($scope.makeList.length != 0) {
									if($scope.modelList.length > 0){
										$scope.changeModelLabel.invoke("Select");
										$scope.isModelDisabled = false;		
									}else{
										$scope.changeModelLabel.invoke("No model found for make");
										$scope.isModelDisabled = true;
									}												
							}
							if(dataFlag){
								if(response.attribute_value.length > 0) {
									$scope.scrollLoadData.busy = false;
									$scope.issearchByKeyword = true;
									$scope.searchSubmit('full');
								}
							}
							else {
								$scope.emptySearchValue = '0 results for search "'+$scope.keywordSearchValue+'"';
								$scope.totalCount = 0;
								$scope.searchResult = [];
								$scope.scrollLoadData.busy = false;
								$scope.busy = $scope.scrollLoadData.busy;
								$scope.counter = 0;
								$scope.pageNumber = 0;
							}
						}
						else {
							if(response.attribute_value.length > 0) {
								$scope.scrollLoadData.busy = false;
								$scope.issearchByKeyword = true;
								$scope.searchSubmit('full');
							}
							else {
								$scope.totalCount = 0;
								$scope.searchResult = [];
								$scope.scrollLoadData.busy = false;
								$scope.busy = $scope.scrollLoadData.busy;
								$scope.counter = 0;
								$scope.pageNumber = 0;
							}
						}
						//Need to uncomment below function afterwards
					//	$scope.getSearchAttributeCount('city', 'make', 'model', 'body', 'transmission', 'colour');
						$scope.scrollLoadData.busy = false;
						$scope.sortDropDownDisable = false;
					}
					else {
						$log.error("GetSearchByKeyword:error");
					}
				});
			}
		}

		$scope.lastScrollTop = 0;
		$scope.direction = "";
		
		angular.element($window).bind("scroll", function() {
			if(!$scope.showSharePopUp && $scope.device !=('ipad' || 'iphone')){
		      $scope.st = window.pageYOffset;		      
		      if ($scope.st > $scope.lastScrollTop) {
		          $scope.direction = "down";
		          if(!$scope.isDesktop){		          
					$scope.stickyHeader = "sticky-header-down";				
				 }
		      } else {
					$scope.direction = "up";
					if(!$scope.isDesktop){
						if($window.scrollY >= 50)	{	          
							$scope.stickyHeader = "sticky-header-up";
						}else{
							$scope.stickyHeader = "";
						}
					}
				}	    		      
		      $scope.lastScrollTop = $scope.st;
		      $scope.$apply();
		  }
		 });

		$scope.sortSelectionChanged = function(index) {
			$scope.sortSelected = $scope.sortList[index];
			$scope.sortSelected.ticked = true;
			$scope.busy = true;
			//$scope.scrollLoadData.busy = true;
			$scope.searchSubmit('full');
			angular.forEach($scope.sortList, function(value, key) {
				if(index == value.id) {
					value.ticked = true;
					$scope.dropdownbg = false;
					$scope.browserScrollHide = false;
				}
				else {
					value.ticked = false;
				}
			});	
			$scope.scrollLoadData.busy = true;
		}

		/*****************************************************/	
		$scope.dropdownbg = false;
		$scope.browserScrollHide = false;
		$scope.popupShowHideFunction = function(){
			$scope.dropdownbg = $scope.dropdownbg ? false : true;			
			$scope.browserScrollHide = $scope.dropdownbg;			
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
	
		$scope.closeTag = function(value, id, callback, callResultPage) {
			if('CITY' == value.toUpperCase()) {
				var index = $scope.cityList.indexOf($filter('filter')($scope.cityList, { integer_representation: id }, true)[0] );
				if(undefined != $scope.cityList[index] && $scope.cityList[index].ticked == true) {
					$scope.cityList[index].ticked = false;
					$scope.refreshButtonTextCity.invoke();
					$scope.refreshList('city', '', function() {});
				}
				
			}
			if('COUNTRY' == value.toUpperCase()) {
				var index = $scope.countryList.indexOf($filter('filter')($scope.countryList, { integer_representation: id }, true)[0] );
				if(undefined != $scope.countryList[index] && $scope.countryList[index].ticked == true) {
					$scope.countryList[index].ticked = false;
					$scope.refreshButtonTextCountry.invoke();
					$scope.refreshList('country', '', function() {});
				}			
			}
			else if('MAKE' == value.toUpperCase()) {
				var index = $scope.makeList.indexOf($filter('filter')($scope.makeList, { integer_representation: id }, true)[0] );
				if(undefined != $scope.makeList[index] && $scope.makeList[index].ticked == true) {
					$scope.makeList[index].ticked = false;		
					$scope.refreshButtonTextMake.invoke();		
					$scope.refreshList('make', '', function() {});
				}			
			}
			else if('MODEL' == value.toUpperCase()) {
				var index = $scope.modelList.indexOf($filter('filter')($scope.modelList, { integer_representation: id }, true)[0] );
				if(undefined != $scope.modelList[index] && $scope.modelList[index].ticked == true) {
					$scope.modelList[index].ticked = false;
					$scope.refreshButtonTextModel.invoke();
				}
			}
			else if('USERTYPE' == value.toUpperCase()) {
				var index = $scope.userTypeList.indexOf($filter('filter')($scope.userTypeList, { integer_representation: id }, true)[0] );
				if(undefined != $scope.userTypeList[index] && $scope.userTypeList[index].ticked == true) {
					$scope.userTypeList[index].ticked = false;
					$scope.refreshButtonTextUserType.invoke();
				}
			}
			else if('BODY' == value.toUpperCase()) {
				var index = $scope.bodyList.indexOf($filter('filter')($scope.bodyList, { integer_representation: id }, true)[0] );
				if(undefined != $scope.bodyList[index] && $scope.bodyList[index].ticked == true) {
					$scope.bodyList[index].ticked = false;
					$scope.refreshButtonTextBody.invoke();
				}
			}
			else if('TRANSMISSION' == value.toUpperCase()) {
				var index = $scope.transmissionList.indexOf($filter('filter')($scope.transmissionList, { integer_representation: id }, true)[0] );
				if(undefined != $scope.transmissionList[index] && $scope.transmissionList[index].ticked == true) {
					$scope.transmissionList[index].ticked = false;
					$scope.refreshButtonTextTransmission.invoke();
				}
			}
			else if('COLOUR' == value.toUpperCase()) {
				var index = $scope.colourList.indexOf($filter('filter')($scope.colourList, { integer_representation: id }, true)[0] );
				if(undefined != $scope.colourList[index] && $scope.colourList[index].ticked == true) {
					$scope.colourList[index].ticked = false;
					$scope.refreshButtonTextColour.invoke();
				}
			}
			else if('PRICE' == value.toUpperCase()) {				
				$scope.multiUnitData.price.newValue.min = $scope.multiUnitData.price.defaultValue.min;
				$scope.multiUnitData.price.newValue.max = $scope.multiUnitData.price.defaultValue.max;
				$scope.rangeSliderChange('price');
				$scope.isPriceChanged = false;
			}
			else if('YEAR' == value.toUpperCase()) {		
				$scope.multiUnitData.year.newValue.min = $scope.multiUnitData.year.defaultValue.min;
				$scope.multiUnitData.year.newValue.max = $scope.multiUnitData.year.defaultValue.max;	
				$scope.rangeSliderChange('year');		
				$scope.isYearChanged = false;					
			}
			else if('KILOMETERS' == value.toUpperCase()) {				
				$scope.multiUnitData.kilometers.newValue.min = $scope.multiUnitData.kilometers.defaultValue.min;
				$scope.multiUnitData.kilometers.newValue.max = $scope.multiUnitData.kilometers.defaultValue.max;
				$scope.rangeSliderChange('kilometers');
				$scope.isKmChanged = false;
			}
			else if('BELOWMARKET' == value.toUpperCase()) {				
				$scope.multiUnitData.belowmarket.newValue.min = $scope.multiUnitData.belowmarket.defaultValue.min;
				$scope.multiUnitData.belowmarket.newValue.max = $scope.multiUnitData.belowmarket.defaultValue.max;
				$scope.rangeSliderChange('belowmarket');
				$scope.isBmaChanged = false;					
			}
			else if('DOORS' == value.toUpperCase()) {
				var index = $scope.doorsList.indexOf($filter('filter')($scope.doorsList, { integer_representation: id }, true)[0] );
				if(undefined != $scope.doorsList[index] && $scope.doorsList[index].ticked == true) {
					$scope.doorsList[index].ticked = false;
					$scope.refreshButtonTextDoors.invoke();
				}
			}
			else if('DRIVETRAIN' == value.toUpperCase()) {
				var index = $scope.drivetrainList.indexOf($filter('filter')($scope.drivetrainList, { integer_representation: id }, true)[0] );
				if(undefined != $scope.drivetrainList[index] && $scope.drivetrainList[index].ticked == true) {
					$scope.drivetrainList[index].ticked = false;
					$scope.refreshButtonTextDrivetrain.invoke();
				}
			}
			
			if($scope.wallOfDeals){
				$scope.setLabelWallOfDeal();			
			}
			//Need to uncomment below function afterwards
		//	$scope.getSearchAttributeCount('city', 'make', 'model', 'body', 'transmission', 'colour');		
			
			if($scope.isDesktop || callResultPage){
				callback('FULL');	
			}			
		}

		$scope.onFilterSearchClicked = function() {
			$scope.hideSearchResult();
		}
		$scope.goToTop = function() {
			$scope.scrollToTop();
		}

		$scope.onPopupClose = function() {
			$scope.$parent.isPopUpOpen = false;
			$scope.$parent.tempClassForPopUpOpen = "";
			$scope.$parent.searchScroller = "";
		}
		
		$scope.splitCity  =  function(value) {
			var cityName = value.split(",");
			return cityName[0];
		}
		
		$scope.setLabelWallOfDeal = function(){
			$scope.price = true;
			$scope.belowmarket = true;	
			
			$scope.isPriceChanged = true;
			$scope.isBmaChanged = true;	
					
			$scope.multiUnitData.price.newValue.min = 1000;
			$scope.multiUnitData.belowmarket.newValue.min = 10;
			$scope.rangeSliderChange('price');
			$scope.rangeSliderChange('belowmarket');	
		}

		$scope.showHideClearAllButton = function() {
			if($scope.selectedCity.length > 0 || $scope.selectedCountry.length > 0 || $scope.selectedMake.length > 0
				|| $scope.selectedModel.length > 0 || $scope.selectedBody.length > 0 || $scope.selectedTransmission.length > 0 
				|| $scope.selectedColour.length > 0	|| $scope.selectedUserType.length > 0 || $scope.isPriceChanged 
				|| $scope.isYearChanged || $scope.isKmChanged || $scope.isBmaChanged || $scope.selectedDoors.length > 0 
				|| $scope.selectedDrivetrain.length > 0) 
			{			
					return true;
			}
		}	
		
		$scope.updateFlagAction = function(product_id, flag_name, flag_action) {
			var data = {'product_id':product_id, 'flag_name':flag_name, 'flag_action':flag_action};
			if($cookies.get('isLogin')) {
				$scope.user_id = $cookies.get('userId');
				searchFormFactory.UpdateFlagAction($scope.user_id, data, function(response) {
					
				if(response.status == 1){
					if(flag_action.toUpperCase() == 'UNFLAG'){
						delete $scope.userHasProductFlag[product_id];
					}else if(flag_action.toUpperCase() == 'FLAG' && flag_name.toUpperCase() == 'FAVORITE'){
						var temp = [];
						temp.push('favorite',true);
						temp.push('product_id',product_id);
						$scope.userHasProductFlag[parseInt(product_id)] = temp;						
					}else if(flag_name.toUpperCase() == 'HIDDEN'){
						var index = $scope.searchResult.indexOf($filter('filter')($scope.searchResult, { product_id : product_id }, true)[0] );
						$scope.searchResult.splice(index,1);  						
					}
					console.log('Success');
				}else{
					console.log('error');
				}				
			});		
			}
			else {
				$state.go('login', {product_id : product_id, flag_name : flag_name, flag_action: flag_action, action : "UpdateFlag" });
			}				
		}
		
		$scope.changeDisplayFormat = function(value){
		    if(value != undefined){
				if(value.match("kilometers")) {
					value = value.replace("kilometers", "km");			 
				}else if(value.match("miles")){
					value = value.replace("miles", "mi");
				}
				return value;
		    }/*else{
				 display_format = "km/mi";
			}*/
		}

		/*More button handler*/
		$scope.moreButtonClicked = function(){
			this.isMoreButtonClicked = !this.isMoreButtonClicked;
		}

		/*Get car review external link*/
		$scope.getCarRecallDetails = function(value){
			var url = $scope.CAR_RECALLS_EXTERNAL_SITE_API_URL + value;
			oktpusServiceFactory.getWithoutQueryString(url, function(response){
				console.log(response);
				if(response.status == 1){
					angular.forEach(response.result, function(value, key) {
  						$scope.car_reviews_external_link = value.external_url;
  						console.log($scope.car_reviews_external_link);
  						$window.open($scope.car_reviews_external_link, "_blank");
					});
				}
				// return $scope.car_reviews_external_link;
			});
		}

		/*Get car review external link*/
		$scope.getCarReviewDetails = function(value){
			var url = $scope.CAR_REVIEWS_EXTERNAL_SITE_API_URL + value;
			oktpusServiceFactory.getWithoutQueryString(url, function(response){
				console.log(response);
				if(response.status == 1){
					angular.forEach(response.result, function(value, key) {
  						$scope.car_reviews_external_link = value.external_url;
  						console.log($scope.car_reviews_external_link);
  						$window.open($scope.car_reviews_external_link, "_blank");
					});
				}
				// return $scope.car_reviews_external_link;
			});
		}


		$scope.getCarPartsDetails = function(value){	
			$scope.popupNo = 0;			
			$scope.seeCarPartsLinkClick = $scope.seeCarPartsLinkClick + 1;
			$scope.productId = value;			
			$scope.carPartsPopups = ''; 
			$scope.forward = false;
			$scope.reverse = false;
			if($scope.lastProductId != value) {
				$scope.seeCarPartsLoading = true;
				searchFormFactory.getCarPartsDetails(value, function(response) {	
					console.log(response);								
					if(response.status == 1){		
					$scope.backUpArray = [];	
					$scope.carPartsResult = response.result;		
					$scope.isSeeCarPartsClicked = true;
					$scope.productId = value;
					$scope.popupNo = 1;
					$scope.keyValues = "result";
					$scope.backUpArray["result"] = response.result;
					$scope.lastProductId = value;
					}
					$timeout( function() {
						$scope.seeCarPartsLoading = false;
					}, 300, true);
				});	
			}else{
				if($scope.seeCarPartsLinkClick != 2 || !$scope.isSeeCarPartsClicked){
					$scope.seeCarPartsLoading = false;
					$scope.isSeeCarPartsPopupOpen = true;
					$scope.carPartsResult = $scope.backUpArray["result"];
					console.log($scope.carPartsResult);
					$scope.isSeeCarPartsClicked = true;
					$scope.popupNo = 1;
					$scope.keyValues = "result";
					$scope.lastProductId = value;
					$scope.seeCarPartsLinkClick = 1;
				}else {
					$scope.seeCarPartsLinkClick = 0;
				}
			}
		}
	
		$scope.getSubPart = function(key, value){
			$scope.reverse = false;
			$scope.subArray = $scope.keyValues.split(',');	
			key = ($scope.subArray.indexOf(key)!== -1) ? key+'s' : key;
			$scope.keyValues = $scope.keyValues !== '' ? ($scope.keyValues +',' +key) :  key; 						
			$scope.backUpArray[key] = value.children;
			$scope.popupNo = parseInt($scope.popupNo) + 1;
			$scope.carPartsPopups = (parseInt($scope.popupNo) % 2 == 0) ? true : false;
			$scope.forward = true;
			$scope.carPartsResult = value.children;
		}	
		$scope.backClicked = function(){	
			$scope.forward = false;
			$scope.carPartsPopups = '';
			$scope.subArray = $scope.keyValues.split(',');
			var removeIndex = $scope.subArray[$scope.subArray.length -2];
			$scope.subArray.splice(-1,1);
			$scope.keyValues = $scope.subArray.toString();
			$scope.carPartsResult = $scope.backUpArray[removeIndex]; 
			$scope.popupNo = parseInt($scope.popupNo) - 1;
			$scope.carPartsPopups = (parseInt($scope.popupNo) % 2 == 0) ? true : false;
			$scope.reverse = true;	
		}	
		
		$scope.onSeeCarPartsClicked = function() {
			$scope.isSeeCarPartsPopupOpen = true;
			$scope.isSeeCarPartsClicked = $scope.isSeeCarPartsClicked ? true : false;
		}				
		
		$scope.settingCompareCarsCookieValuesToVariables = function(){
			if(($cookies.get('selectedCarCount') !== undefined && $cookies.get('selectedCarCount') !== null) 
			&& ($cookies.getObject('compareCars') !== undefined && $cookies.getObject('compareCars') !== null) )
			{
				$scope.selectedCarCount = parseInt($cookies.get('selectedCarCount'));
				$scope.compareCars = $cookies.getObject('compareCars'); 
			}
		}
		
		//This below function is called for the first time of page loading
		$scope.settingCompareCarsCookieValuesToVariables();	
			
		$scope.addToCompare = function(car_id, car_url, car_image, car_title, car_price){	
			$scope.isAlreadyAdded = false;
			$scope.isCompareCarsMessage = false ;	
			//This below function is called every time when the user clicked on 'Add to compare' button, because user some time clear the history, at that time it should not effect to our flow.  
			$scope.settingCompareCarsCookieValuesToVariables();
			var index = $scope.compareCars.indexOf($filter('filter')($scope.compareCars, { product_id : car_id }, true)[0]);
			if(index == -1){
				if($scope.selectedCarCount < 4){			
					$scope.comparePopup={ "display":"block"} ;
					$scope.isCompareClicked = true;		
					$scope.compareCars.push({'product_id' : car_id , 'url': car_url, 'image': car_image, 'title': car_title, 'price': car_price});
					$scope.selectedCarCount = $scope.selectedCarCount + 1;	
					$cookies.putObject('compareCars',$scope.compareCars);
					$cookies.put('selectedCarCount',$scope.selectedCarCount);				
				}else{
					$scope.comparePopup={ "display":"block"} ;
					$scope.compareCarsMessage = "You can compare upto 4 cars at once. Please remove a current selection before adding a new one.";
					$scope.isCompareCarsMessage = true ;
					$scope.isCompareClicked = true;					
				}
			}else{
					$scope.compareCarsMessage = "Already added";
					$scope.isAlreadyAdded = true;
					$scope.productId = car_id; 
					$timeout(function () {		  	
						$scope.isAlreadyAdded = true;
					}, 5000);
				}
			$timeout(function () {		  	
				$scope.comparePopup={ "display":"none"}     
			}, 8000);
		}

		$scope.compareCarsList = function(){
			if($cookies.get('selectedCarCount') !== undefined && $cookies.get('selectedCarCount') !== null){
				this.onExit('compare');
				$state.go('compare');	
			}else{				
				 $scope.removeAllCompareCars();
			}
		}
		
		$scope.removeProductIdFromCompareList = function(product_id){
			var index = $scope.compareCars.indexOf($filter('filter')($scope.compareCars, { product_id : product_id }, true)[0]);
			$scope.compareCars.splice(index,1);  		
			$cookies.putObject('compareCars',$scope.compareCars);	
			$scope.selectedCarCount = $scope.selectedCarCount - 1; 
			$cookies.put('selectedCarCount',$scope.selectedCarCount);
			$scope.isCompareCarsMessage = false;	
			if($scope.selectedCarCount == 0){
				$scope.compareCarsMessage = 'You have not selected any car to compare. Please add cars of your choice and view here to compare.';
			}
		}
		
	   $scope.removeAllCompareCars = function(){
			$scope.selectedCarCount = 0;
			$scope.compareCars = [];
			$cookies.remove("selectedCarCount");
			$cookies.remove("compareCars");
			$scope.isCompareCarsMessage = false;	
			$scope.compareCarsMessage = 'You have not selected any car to compare. Please add cars of your choice and view here to compare.';
			$timeout(function () {		  	
				$scope.comparePopup={ "display":"none"}     
			}, 8000); 
			
		}
		
		$scope.displayCamparePopup = function(){
			$scope.isCompareClicked = true;
			$scope.comparePopup={ "display":"block"} ;
		}
		$scope.hideCamparePopup = function(){
			$scope.comparePopup={ "display":"none"} ;
		}
	}]);

// searchApp.directive('href', function() {
//   return {
//     compile: function(element) {
//         //if(element.hash == '#/terms'){
//             element.attr('target', '_blank');
//         //}
//     }
//   };
// });