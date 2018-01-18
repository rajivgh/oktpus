'use strict';
 
angular.module('oktpusServiceModule')
.factory('oktpusServiceFactory', ['$log', '$http', '$httpParamSerializer',
	function ($log, $http, $httpParamSerializer) {
		return {
			postWithoutQueryString: function (data, url, callback) {
				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				$http({
					url: url, 
					method: "POST", 
					data: $httpParamSerializer(data),
					responseType: 'json'
				}).success(function(response, status, headers, config) {								
					callback(response);
				}).error(function(response, status, headers, config) {				
					$log.debug("Error:postWithoutQueryString");
					$log.debug(response);
					callback(status);
				});
			},
			
			getWithoutQueryString: function (url,callback) {				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				$http({
					url: url, 
					method: "GET", 
					responseType: 'json'
				}).success(function(response, status, headers, config) {											
					callback(response);
				}).error(function(response, status, headers, config) {				
					$log.debug("Error:while getting response");
					$log.debug(response);
					callback(status);
				});
			}
			
			
			
		}	
	}]);
