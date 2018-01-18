'use strict';
 
angular.module('savedSearch')
.factory('savedSearchFactory',['$log', '$rootScope', '$http', '$httpParamSerializer',
	function ($log, $rootScope, $http, $httpParamSerializer) {
		return {
			GetSearchList: function (callback) {				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				$http({
				//	url: "http://142.4.215.210:11080/api/search", 
					url: "https://oktpus.com/api/search", 
					method: "GET", 
					responseType: 'json'
				}).success(function(response, status, headers, config) {	
					callback(response);
				}).error(function(response, status, headers, config) {				
					$log.debug("Error:savedSearchFactory-GetSearchList");					
					callback(status);
				});
			},			
			
			DeleteSavedSearch: function (data, callback) {				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
					
				$http({
				//	url: "http://142.4.215.210:11080/search/update/status", 
					url: "https://oktpus.com/search/update/status", 
					method: "POST", 
					data: $httpParamSerializer(data),
					responseType: 'json'
				}).success(function(response, status, headers, config) {								
					callback(response);
				}).error(function(response, status, headers, config) {				
					$log.debug("Error:savedSearchFactory-DeleteSavedSearch");
					$log.debug(response);
					callback(status);
				});
			},	
			
			OpenSavedSearch: function (searchId, callback) {				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
					
				$http({
				//	url: "http://142.4.215.210:11080/api/search/"+searchId, 
					url: "https://oktpus.com/api/search/"+searchId, 
					method: "GET", 
					responseType: 'json'
				}).success(function(response, status, headers, config) {								
					callback(response);
				}).error(function(response, status, headers, config) {				
					$log.debug("Error:savedSearchFactory-OpenSavedSearch");
					$log.debug(response);
					callback(status);
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
					$log.debug("Error:savedSearchFactory-UpdateSavedSearch");
					$log.debug(response);
					callback(status);
				});
			}
				
		}	
	}]);
