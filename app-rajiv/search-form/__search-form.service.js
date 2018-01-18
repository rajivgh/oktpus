'use strict';

angular.module('searchForm')
.factory('searchFormFactory',['$log', '$http', '$httpParamSerializer',
	function ($log, $http, $httpParamSerializer) {
		return {
			GetSearchAttribute: function (param, callback) {
				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				$http({
				//	url: "http://142.4.215.210:11080/api/attribute",
					url: "https://oktpus.com/api/attribute",
				 
					method: "GET",
					params: param,
					responseType: 'json'
				}).success(function(response, status) {
					//$log.debug(response);
					callback(response);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:searchFormFactory-GetSearchAttribute");				
					callback(response);
				});
			},
			
			GetSearchAttributeProd: function (param, callback) {
				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				$http({
					url: "https://oktpus.com/api/attribute", 
					method: "GET",
					params: param,
					responseType: 'json'
				}).success(function(response, status) {
					callback(response);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:searchFormFactory-GetSearchAttribute");
					callback(response);
				});
			},
		
			GetMultiUnitData: function (domainID, user_id, callback) {
				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				var param = {domain_id: domainID};
				
				$http({
				//	url: "http://142.4.215.210:11080/api/user/" + user_id + "/config", 
					url: "https://oktpus.com/api/user/" + user_id + "/config", 
					method: "GET",
					params: param,
					responseType: 'json'
				}).success(function(response, status) {
					callback(response);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:searchFormFactory-GetMultiUnitData");
					callback(response);
				});
			},
			
			GetModelData: function (url, callback) {
				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				$http({
					url: url, 
					method: "GET",
					responseType: 'json'
				}).success(function(response, status) {
					callback(response);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:searchFormFactory-GetModelData");
					callback(response);
				});
			},
			
			GetSearchAttributeCount: function (domainID, value, data, callback) {
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				var param = {domain_id: domainID, attributes: value};
				
				$http({
				//	url: "http://142.4.215.210:11080/api/item/count", 
					url: "https://oktpus.com/api/item/count", 
					method: "POST",
					params: param,
					data: $httpParamSerializer(data),
					responseType: 'json'
				}).success(function(response, status) {
					callback(value, response);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:searchFormFactory-GetSearchAttributeCount");
					callback(value, response);
				});
			},
			
			GetSearchItemList: function (domainID, data, callback) {
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				var param = {domain_id: domainID, include_count: 1}
				
				$http({
				//	url: "http://142.4.215.210:11080/api/item", 
					url: "https://oktpus.com/api/item",
					method: "POST",
					params: param,
					data: $httpParamSerializer(data),
					responseType: 'json'
				}).success(function(response, status) {
					callback(response);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:searchFormFactory-GetSearchItemList");
					callback(response);
				});
			},

			CreateSearch: function (domainID, data,callback) {
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=6k90o3l21dg17hhosuripmlbf7";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";			
				var param = {domain_id: domainID}
				
				$http({
				//	url: "http://142.4.215.210:11080/api/search", 
					url: "https://oktpus.com/api/search", 
					method: "POST",
					params: param,
					data: $httpParamSerializer(data),
					responseType: 'json'
				}).success(function(response, status) {
					callback(response);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:searchFormFactory-CreateSearch");
					callback(response);
				});
			},
			
			ChangeMultiUnitSelection: function (domainID, user_id, data, callback) {
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				var param = {domain_id: domainID}
				
				$http({
				//	url: "http://142.4.215.210:11080/api/user/" + user_id + "/config", 
					url: "https://oktpus.com/api/user/" + user_id + "/config", 
					method: "POST",
					params: param,
					data: $httpParamSerializer(data),
					responseType: 'json'
				}).success(function(response, status) {
					callback(response);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:searchFormFactory-ChangeMultiUnitSelection");
					callback(response);
				});
			},
			
			UpdateSavedSearch: function (domain_id, search_id, data, callback) {				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				var param = {domain_id: domain_id};
				
				$http({
				//	url: "http://142.4.215.210:11080/api/search/"+search_id, 
					url: "https://oktpus.com/api/search/"+search_id, 
					method: "POST", 
					params: param,
					data: $httpParamSerializer(data),
					responseType: 'json'
				}).success(function(response, status, headers, config) {								
					callback(response);
				}).error(function(response, status, headers, config) {				
					$log.debug("Error:searchFormFactory-UpdateSavedSearch");
					callback(status);
				});
			},
			
			GetSearchByKeyword: function (domain_id, keyword, callback) {				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				var param = {domain_id: domain_id, keywords: keyword};
				
				$http({
				//	url: "http://142.4.215.210:11080/api/attribute", 
					url: "https://oktpus.com/api/attribute", 
					method: "GET", 
					params: param,
					responseType: 'json'
				}).success(function(response, status, headers, config) {								
					callback(response);
				}).error(function(response, status, headers, config) {				
					$log.debug("Error:searchFormFactory-GetSearchByKeyword");
					callback(status);
				});
			},
						
			GetGeoLocation: function (url, callback) {
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				$http.defaults.headers.post["Content-Type"] = "application/json";					
				$http({
					url: url, 
					method: "POST",
					responseType: 'json'
				}).success(function(response) {
					callback(response);
				}).error(function(response) {
					$log.debug("Error:searchFormFactory-GetGeoLocation");
					callback(response);
				});
			},
			
			UpdateFlagAction: function (user_id, data, callback) {
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
			//	var param = {domain_id: domainID};
				
				$http({
					url: "https://oktpus.com/api/user/"+user_id+"/product/flag", 
					method: "POST",
				//	params: param,
					data: $httpParamSerializer(data),
					responseType: 'json'
				}).success(function(response, status) {
					callback(response);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:updateFlagAction");
					callback(response);
				});
			},
			
			getCarPartsDetails: function (product_id, callback) {
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";		
				var param = {'type_id': 1, 'product_id' : product_id};
				$http({
					url: "https://www.oktpus.com/api/external_link", 
					method: "GET",
					params: param,
					responseType: 'json'
				}).success(function(response, status) {
					callback(response);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:getCarPartsDetails");
					callback(response);
				});
			}
			
			/*GetCityNameByGeoLocation: function (url, data, callback) {
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";					
				$http({
					url: url, 
					method: "GET", 
					params: data,
					responseType: 'json'
				}).success(function(response, status, headers, config) {								
					callback(response);
				}).error(function(response, status, headers, config) {				
					$log.debug("Error:searchFormFactory-GetSearchByKeyword");
					$log.debug(response);
					callback(status);
				});
			}*/
		}	
	}]);
