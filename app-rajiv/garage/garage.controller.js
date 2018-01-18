'use strict';
 
angular.module('garage')
.controller('GarageController', ['$log', '$scope', '$state','$cookies', '$localStorage', '$window', '$filter', '$timeout','oktpusServiceFactory', 
	function ($log, $scope, $state, $cookies, $localStorage, $window, $filter, $timeout, oktpusServiceFactory) {
		
		$scope.popupHeight = ($window.innerHeight - 75) +"px";
		$scope.$storage = $localStorage;
		$scope.isLogin = $cookies.get('isLogin');
		
		$scope.busy = true;
		
		$scope.result = [];
		$scope.userHasProductFlag = {};
		
		$scope.isResult = false;

		$scope.tempClassForMenu = "";
		$scope.menuShow = false;
		$scope.showSharePopUp = false;
		$scope.url = '';
		$scope.media = '';
		$scope.title = '';
		$scope.city = '';
		$scope.make = '';
		$scope.model = '';
		$scope.compareCars = [];  
		$scope.selectedCarCount = 0;
		$scope.isCompareClicked = false;			
		$scope.isCompareCarsMessage = false ;
		$scope.isAlreadyAdded = false;
		$scope.compareCarsMessage = '';
		
		$window.scrollTo(0, 0);
		
		$scope.onEnter = function() {
			$scope.$storage.currentState = 'garage';
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
			if(undefined == $cookies.get('isLogin') || false == $cookies.get('isLogin')) {
				$scope.$storage.previousState = 'login';
				$scope.$storage.currentState = 'garage';
			}
			else if((true == $cookies.get('isLogin') && undefined == $scope.$storage.previousState)
			|| (true == $cookies.get('isLogin') && $scope.$storage.currentState == $scope.$storage.previousState)) {
				$scope.$storage.previousState = 'search';
				$scope.$storage.currentState = 'garage';
			}
			else if(undefined == $scope.$storage.currentState || undefined == $scope.$storage.previousState) {
				$scope.$storage.previousState = 'login';
				$scope.$storage.currentState = 'garage';
			}
						
			var state = $scope.$storage.previousState;
			
			$scope.onExit(state);
			$state.go(state);
		}
		
		$scope.loadGarageList = function() {
			$scope.result = [];
			$scope.busy = true;		
			var url = "https://oktpus.com/api/garage";	
			oktpusServiceFactory.getWithoutQueryString(url, function(response) {
				if(undefined != response.status && 1 == response.status) {
					$log.debug("GetGarage:success");
					if(response.data.products.length > 0){
						$scope.isResult = true;
					}
					else {
						$scope.isResult = false;
					}
					$scope.busy = false;
					
					$scope.result = response.data.products;	
					$scope.userHasProductFlag =  response.data.user_has_product_flag;
				  } else if(0 == response.status && 401 == response.code) {
					  $scope.busy = false;
					  $log.debug("GetGarage:error");
					  $scope.onExit("login");
					  $state.go('login');
                }
			});
		}	
		
		$scope.getParsedKilometer =  function(value) {
			if(value.match("kilometers")) {
				return value.replace("kilometers", "km");			 
			} else if(value.match("miles")){
				return value.replace("miles", "mi");
			} else{
				return value;
			}		
		}
		
		$scope.updateFlagAction = function(product_id, flag_name, flag_action) {
			var data = {'product_id':product_id, 'flag_name':flag_name, 'flag_action':flag_action};
			if($cookies.get('isLogin')) {
				var user_id = $cookies.get('userId');
				var url = "https://oktpus.com/api/user/"+user_id+"/product/flag";				
				oktpusServiceFactory.postWithoutQueryString(data, url, function(response) {
					if(response.status == 1){
						if(flag_action.toUpperCase() == 'UNFLAG'){
							delete $scope.userHasProductFlag[product_id];
						}else if(flag_action.toUpperCase() == 'FLAG' && flag_name.toUpperCase() == 'FAVORITE'){
							var temp = [];
							temp.push('favorite',true);
							temp.push('product_id',product_id);
							$scope.userHasProductFlag[parseInt(product_id)] = temp;						
						}else if(flag_name.toUpperCase() == 'HIDDEN'){
							var index = $scope.result.indexOf($filter('filter')($scope.result, { product_id : product_id }, true)[0] );
							$scope.result.splice(index,1);  						
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
						$scope.isAlreadyAdded = false;
					}, 5000);
				}
			$timeout(function () {		  	
				$scope.comparePopup={ "display":"none"}     
			}, 9000);
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
			}, 9000); 
			
		}
		
		$scope.displayCamparePopup = function(){
			$scope.isCompareClicked = true;
			$scope.comparePopup={ "display":"block"} ;
		}
		$scope.hideCamparePopup = function(){
			$scope.comparePopup={ "display":"none"} ;
		}
		
		$scope.menuOutClick = function() {
			$scope.menuShow = false;
		}
			
	}]);
	
