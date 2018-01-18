'use strict';

var wmcw = angular.module('wmcw', ['paypal-button', 'ngDialog']);
wmcw.controller('CarWorthController', ['$log', '$scope', '$state', '$http', 'oktpusServiceFactory', 'searchFormFactory', '$filter', 'ngDialog', '$window', '$cookies', '$location', '$localStorage','$anchorScroll',
function($log, $scope, $state, $http, oktpusServiceFactory, searchFormFactory, $filter, ngDialog, $window, $cookies, $location, $localStorage, $anchorScroll) {
/*	$scope.wmcwSubmit = function () {			
		var data = {'car[make]':$scope.make, 'car[make]':$scope.make, 'car[model]':$scope.model, 'car[transmission]':$scope.transmission,
					'car[year]':$scope.year, 'car[kilometer]':$scope.mileage, 'car[display_format]':$scope.mileageIn, 'person[email]':$scope.email, 
					'person[first_name]':'', 'person[last_name]':'', 'person[city]':$scope.city, 'person[state]':$scope.state, 
					'person[country]':$scope.country};		
		console.log(data);
	}*/

    $scope.domainID = 1;
    $scope.MODEL_ATTRIBUTE_URL = "https://oktpus.com/get/1/attribute/4/by/attribute_values/";
    $scope.MODEL_GROUP_CONSTRAINT = "/groups/";
    $scope.cityList = [];
    $scope.countryList = [{name: 'Canada', code: 'CA'}, {name: 'Unites States', code: 'US'}, {name:  'Mexico', code: 'MX'}];
    $scope.makeList = [];
    $scope.modelList = [];
    $scope.transmissionList = [];
    $scope.isModelDisable = true;
    $scope.chooseMake = "Select"; //"Choose Make";
    $scope.chooseModel = "Choose a Make first";
    $scope.carmodelm = "Choose a Make first";
    $scope.isMessage = false;
    $scope.message = '';    
    $scope.isLoading = false ;

    $scope.isGeoLocation = false;
    $scope.lat = 0;
    $scope.lng = 0;
    $scope.accessDenied = false;
    $scope.clearCountryList = {};
    $scope.clearCityList = {};
    $scope.isCityDisabled = false;
    $scope.refreshButtonTextCity = {};
    $scope.isDisplay = false;
    $scope.paymentMessage = "";
    $scope.paymentData = {};
    $scope.popupHeight = ($window.innerHeight - 50) +"px";
    $scope.$storage = $localStorage;
    $scope.tempClassForMenu = "";
    $scope.menuShow = false;
    $scope.showSharePopUp = false;
    $scope.isFirstTime = 1;
    $scope.isEmailInvalid = $scope.isFirstTime == 1 ? false : true;
    $scope.isEmailRequired = $scope.isFirstTime == 1 ? false : true;
    $scope.isTermsRequired = false;
    $scope.searchFilter = "";
    $scope.searchFilterModel = "";
    $scope.searchFilterTrans = "";
    $scope.searchFilterCountry = "";

    $window.scrollTo(0, 0);
    
    $scope.scroll = function () {
        // $window.scrollTo(0, angular.element(document.getElementById('div1')).offsetTop);  
      /*$window.scrollTo(0, 0);  */
      $location.hash('wmcwdiv');
      $anchorScroll();
      };

    $scope.showselectModelPopup = false; 
     
    $scope.carmakemodel = "Select";
    $scope.selectValueAction = function(make){
        $scope.carmakemodel = make.value;
        $scope.closeSelectMakePopup();
        $scope.onChangeMake(make.id);
        $scope.clearFilter();
        $scope.setRadioSelection(make.value, 'selection');
     };

    $scope.selectValueActionModel = function(value){
        $scope.carmodelm = value;
        $scope.closeSelectModelPopup();
        $scope.clearFilter();
        $scope.setRadioSelection(value, 'selectionmodel');
     };

    $scope.selectValueActionCntry = function(value){
        $scope.carcntrymodel = value;
        $scope.closeSelectCountryPopup();
        $scope.clearFilter();
        $scope.setRadioSelection(value,'selectioncntry');
    };

    $scope.cartransmodel = "Select";
    $scope.selectValueActionTrans = function(value){
        $scope.cartransmodel = value;
        $scope.closeSelectTransPopup();
        $scope.clearFilter();
        $scope.setRadioSelection(value, 'selectiontrans');
    };

    $scope.setRadioSelection = function(value, radioName){
        var a = $window.document.getElementsByName(radioName);
        for(var i=0; i < a.length; i++){
          if(a[i].value==value) a[i].checked = true; 
        }
    };
    
    $scope.openselectMakePopup = function(){
        /*console.log("openModelPopup: " + $scope.showModelPopup);*/
        $scope.showselectMakePopup = true;
        $scope.popup={"display":"block"};
        //$scope.setFocus();
    };
    
    $scope.openselectModelPopup = function(){
        /*console.log("openModelPopup: " + $scope.showModelPopup);*/
        if($scope.carmakemodel !== 'Select' && $scope.carmakemodel !== '' && $scope.carmodelm !== 'No model found for make'){
            $scope.showselectModelPopup = true;
            $scope.modelpopup={"display":"block"};
            //$scope.setFocus();
        }
    };
    
    $scope.openselectTransPopup = function(){
        $scope.showselectTransPopup = true;
        $scope.transpopup={"display":"block"};
        //$scope.setFocus();
    };

    $scope.openselectCountryPopup = function(){
        $scope.showselectCountryPopup = true;
        $scope.countrypopup={"display":"block"};
        //$scope.setFocus();
    };

    $scope.closeSelectMakePopup = function(){
        $scope.showselectMakePopup = false;
        $scope.popup={"display":"none"};
    };

    $scope.closeSelectModelPopup = function(){
        $scope.showselectModelPopup = false;
        $scope.modelpopup={"display":"none"};
    };
    
    $scope.closeSelectTransPopup = function(){
        $scope.showselectTransPopup = false;
        $scope.transpopup={"display":"none"};
    };
    
    $scope.closeSelectCountryPopup = function(){
        $scope.showselectCountryPopup = false;
        $scope.countrypopup={"display":"none"};
    };

    $scope.setFocus = function(){
        $window.document.getElementById('searchInput').focus();
    };

    $scope.clearFilter = function(){
        $scope.searchFilter = "";
        $scope.searchFilterModel = "";
        $scope.searchFilterTrans = "";
        $scope.searchFilterCountry = "";
    };

    $scope.onEnter = function() {
        $scope.$storage.currentState = 'wmcw';
        $scope.$storage.nextState = null;
    }
    
    $scope.onExit = function(value) {
        $scope.$storage.nextState = value;
        $scope.$storage.previousState = $scope.$storage.currentState;
    }

    if($cookies.get('isLogin'))
        $scope.email = $cookies.get('emailId');

    $scope.opts = {
        env: 'sandbox', // or production
        style: {
            label: 'checkout', // checkout | credit | pay
            size: 'small', // small | medium | responsive
            shape: 'pill', // pill | rect
            color: 'blue' // gold | blue | silver
        },
        redirect_urls: {
            return_url: "http://173.236.29.91:50031/angular-oktpus/app-karan/#/home",
            cancel_url: "http://173.236.29.91:50031/angular-oktpus/app-karan/#/search"
        },
/*        client: {
            sandbox: 'Af6u_MquM7T6avy_OZQ_6Pf-BuBt2FsWBNqgourMxHuQSvVxW1mLXSGZ2XtE8Az7FbEZDGky6OAmK_ly',
            production: 'AVZhosFzrnZ5Mf3tiOxAD0M6NHv8pcB2IFNHAfp_h69mmbd-LElFYkJUSII3Y0FPbm7S7lxBuqWImLbl'
        },*/
        client: {
            sandbox: 'AQnQTCwskbXrVBt5kJK9IwOlqwkpH-6Rrj8A7-f_dmAqazUT6zs_j9PToNXsoPmbCTthv02dC4tuzGCL',
            production: 'AYgNnoqAtQdPHBehT7YC7qZqyfQzW4gihhL8MhTKQ0I_io8OPt1pb1d-Cedsk7bHT9byDTQRLmjKjDWO'
        },
        payment: function() {
            //console.log("In payment");
            $scope.isEmailRequired = false;
            $scope.isEmailInvalid = false;
            $scope.isTermsRequired = false;
            var env = this.props.env;
            var client = this.props.client;
            return paypal.rest.payment.create(env, client, {
                transactions: [{
                    amount: {
                        total: '2.99',
                        currency: 'USD'
                    }
                }],
            });
        },
        commit: true, // Optional: show a 'Pay Now' button in the checkout flow
        onAuthorize: function(data, actions) {
            // Optional: display a confirmation page here
            return actions.payment.execute().then(function(response) {
                // console.log('Before');
                // console.log(response);
                // console.log('After');
                // $scope.checkoutPayPal(response);
                // Show a success page to the buyer
                if(response.state == "approved"){
                    $scope.paymentData = response;
                    ngDialog.open({
                        template: 'wmcw/wmcw.paymentsuccess.html',
                        className: 'ngdialog-theme-default',
                        showClose: true,
                        closeByDocument: true,
                        closeByEscape: false,
                        scope: $scope
                    });
                    $scope.checkoutPayPal(response);
                }

            });
        },
        onCancel: function(data, actions) {
            console.log('onCancel function');
        }
    };
    //console.log("PAypal");
    // console.log($scope.opts.env);
    // console.log($scope.opts.client);

    /*Goto top of page*/
    $scope.gotoTop = function(){
        $window.scrollTo(0, 0);
        //console.log("gotoTop");
    };
    
    //Menu close
	$scope.menuOutClick = function() {
		$scope.menuShow = false;
	}	
    $scope.gotoTermsOfService = function(){
        // $location.path('/terms');
        // this.gotoTop();
        // console.log($location.host());
        // $window.open('/#terms', '_blank');
    }
	$scope.backButtonClicked = function() {		
		var state = $scope.$storage.previousState;
		$scope.onExit(state);
		$state.go(state);
	}

    /*Validate form inputs*/
    $scope.validateForm = function(){
        //console.log('validateForm');
        $scope.isFirstTime += 1;
        if(!$scope.termsOfService){
            $scope.isTermsRequired = true;
            $scope.isEmailInvalid = false;
            $scope.isEmailRequired = false;

            return false;
        }else if(typeof $scope.email === 'undefined' || $scope.email.length === 0){
            $scope.isEmailRequired = true;
            $scope.isTermsRequired = false;
            $scope.isEmailInvalid = false;

            return false;
        }else if(!$scope.ValidateEmail($scope.email)){
            $scope.isEmailInvalid = true;
            $scope.isEmailRequired = false;
            $scope.isTermsRequired = false;

            return false;
        }
        $scope.isTermsRequired = false;
        $scope.isEmailInvalid = false;
        $scope.isEmailRequired = false;
        
        return true;
    }

    /*Validate Terms of Service*/
    $scope.validateTOS = function(){
        //console.log('validateTOS');
        if(!$scope.termsOfService){
            $scope.isTermsRequired = true;
            return;
        }
        $scope.isTermsRequired = false;
    }

    /*Validate email value*/
    $scope.ValidateEmail = function(mail){
        //console.log("ValidateEmail");
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
            //$scope.isEmailInvalid = false;
            return (true);
        }
        //$scope.isEmailInvalid = true;
        return (false);
    }

    $scope.checkoutPayPal = function(paypalResponse) {
        //console.log("checkoutPayPal");
        var data = {
            'car[make]': $scope.make,
            'car[model]': $scope.model,
            'car[transmission]': $scope.transmission,
            'car[year]': $scope.year,
            'car[kilometers]': $scope.mileage,
            'car[kilometers][type]': $scope.mileageIn,
            'person[email]': $scope.email,
            'person[first_name]': $scope.firstname,
            'person[last_name]': $scope.lastname,
            'person[city]': $scope.city,
            'person[state]': $scope.state,
            'person[country]': $scope.country,
            'person[transaction_id]': paypalResponse.id
        };
        var url = "https://oktpus.com/api/market_average_request?domain_id=1";
        oktpusServiceFactory.postWithoutQueryString(data, url, function(response) {
            //console.log(response);
            if(response.status){
                $scope.isDisplay = true;
                $scope.$evalAsync();
                //$scope.paymentData = paypalResponse;
/*                ngDialog.open({
                    template: 'wmcw/wmcw.paymentsuccess.html',
                    className: 'ngdialog-theme-default',
                    showClose: true,
                    closeByDocument: true,
                    closeByEscape: false,
                    scope: $scope
                });*/
                $scope.gotoTop();
            }else{
                //Error part
                console.log("API Request Error");
            }
        });

        //	delete $http.defaults.headers.common['X-Requested-With'];
        //	$http.defaults.useXDomain = true;
        //	$http.defaults.withCredentials = true;
        //	$http.defaults.headers.post["Content-Type"] = "application/json";

        /*	 $http({
        		url: "https://www.sandbox.paypal.com/cgi-bin/webscr", 
        		method: "POST",
        		data: {"cmd": "_xclick", "business": "karan1991patil-facilitator1@gmail.com",
        			"upload": "1",
        			"rm": "2",
        			"charset": "utf-8"},
        	   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        	});*/
        /*	var data = {
        		cmd: "_xclick",
        		business: "karan1991patil-facilitator1@gmail.com",
        		upload: "1",
        		rm: "2",
        		charset: "utf-8"
        	  };
        	  
        	   var form = $('<form></form>');
        	  form.attr("action", "https://www.sandbox.paypal.com/cgi-bin/webscr");
        	  form.attr("method", "POST");
        	  form.attr("style", "display:none;");
        	//  form.attr("data", data);
        	  form.addFormFields(form, data);
        	//  this.addFormFields(form, parms.options);
        	  $("body").append(form);

        	  // submit form
        	//  this.clearCart = clearCart == null || clearCart;
        	  form.submit();
        	  form.remove();
        	  console.log("Hello");			  
        	  */
        //	  return $http("https://www.sandbox.paypal.com/cgi-bin/webscr");	

    };

    $scope.loadAttributeData = function(value) {
        this.getSearchAttribute(value, function(value){});
        //$scope.getGeoLocation(false);
    };

    /*Get dropdown attribute values*/
    $scope.getSearchAttribute = function(value, callback) {
        var param = {domain_id: $scope.domainID};
        /*CarWorthFactory*/searchFormFactory.GetSearchAttribute(param, function(response) {
            if(response != null) {
                if(response.status) {
                    angular.forEach(response.attribute_value.city, function(value, key) {
                        $scope.cityList.push(value);
                    });
                    angular.forEach(response.attribute_value.make, function(value, key) {
                        $scope.makeList.push(value);
                    });
                    angular.forEach(response.attribute_value.transmission, function(value, key) {
                        $scope.transmissionList.push(value);
                    });
                    callback(value);
                } else {
                    $log.error("getSearchAttribute:error");
                }
            }
        });
    };

    /*Get Model dropdown attribute values*/
    $scope.getModelAttributeValues = function(makeId, callback) {
        url = $scope.MODEL_ATTRIBUTE_URL + makeId;
        oktpusServiceFactory.getWithoutQueryString(url, function(response){
            if(response != null) {
                if(response.status) {
                    angular.forEach(response.attribute_value.model, function(value, key) {
                        $scope.modelList.push(value);
                    });
                }
            }
        }
    )};

    /*Model list url preparation*/
    $scope.getModelUrl = function(makeObject) {
        var id = 0, group = 0;
        if(makeObject.group > 0){
            group = makeObject.id;
            id = 0;
        }else{
            id = makeObject.id;
            group = 0;
        }

        return this.MODEL_ATTRIBUTE_URL + id + this.MODEL_GROUP_CONSTRAINT + group;
    };

    /*Check object is empty or not*/
    $scope.isObjectEmpty = function(card){
       return Object.keys(card).length === 0;
    }

    $scope.getModelList = function(selectedMake){
        $scope.isMessage = false;     
        //var url = $scope.MODEL_ATTRIBUTE_URL + selectedMakeId;
        var url = $scope.getModelUrl(selectedMake);
        oktpusServiceFactory.getWithoutQueryString(url, function(response) {
            if(response.status == 1) {
                $scope.chooseModel = "Select";
                $scope.carmodelm = "Select";
                $scope.model = '';
                $scope.modelList = response.result;                     
                $scope.isModelDisable = ($scope.modelList.length > 0) ? false : true;
                /*$scope.$evalAsync();*/                   
                $scope.chooseModel = $scope.isModelDisable ? "No model found for make" : "Select";
                //console.log("chooseModel: " + $scope.chooseModel);
                $scope.carmodelm = $scope.isModelDisable ? "No model found for make" : "Select";
                if($scope.isModelDisable){
                    $scope.message = '';
                    $scope.isMessage = false;
                }else{
                    $scope.isLoading = false ;
                }
            }else if(response.status == 0){
                $scope.modelList.length = 0;
            }else{
                $log.debug("GetCompare:error");
                $scope.isLoading = false ;
            }
        });
    }
    
    $scope.onChangeMake = function(makeId){
        var index = $scope.makeList.indexOf($filter('filter')($scope.makeList, { id: makeId }, true)[0] );
        $scope.getModelList(this.makeList[index]);
    }

    /*Get Current geological location using gogle api*/
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
                                                        /*  $scope.popup={
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

    /*Get Current city name from geo location latitude, langitude*/
    $scope.getCityNameByLatLng = function(){
        var param = {'domain_id': $scope.domainID,'filters[latitude]':$scope.lat,'filters[longitude]':$scope.lng};
        searchFormFactory.GetSearchAttributeProd(param, function(response){
            if(response.status){
                var city = (response.attribute_value[0].value).split(",");
                $scope.city = city[0];
                $scope.state = city[1];
                for(var i = 0; i < $scope.countryList.length; i++){
                    if($scope.countryList[i].code.trim() == city[2].trim()){
                        $scope.country = $scope.countryList[i].code;
                        break;
                    }
                };
            }
            else {
                $log.error("Error occured while getting City Name");                
            }
        });
    }

    $scope.$watch('menuShow', function() {
        if($scope.menuShow == true) {
            $scope.tempClassForMenu = "showHideMenu";
        }
        else {
            $scope.tempClassForMenu = "";
        }
    });

    $scope.menuOutClick = function() {
        $scope.menuShow = false;
    }

}
]);

wmcw.directive('href', function() {
  return {
    compile: function(element) {
        if(element.hash == '#/terms'){
            element.attr('target', '_blank');
        }
    }
  };
});

wmcw.filter('myfilter', function(){
    return function(makevaluelst, searchtxt){
        return makevaluelst.filter(function(vegetable){
            return (vegetable.value).toLowerCase().startsWith(searchtxt.toLowerCase());
        });
    };
});

wmcw.filter('mycountryfilter', function(){
    return function(makevaluelst, searchtxt){
        return makevaluelst.filter(function(vegetable){
            return (vegetable.name).toLowerCase().startsWith(searchtxt.toLowerCase());
        });
    };
});