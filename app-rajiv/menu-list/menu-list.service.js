'use strict';

angular.module('menuList')
.factory('menuListFactory',['$log', '$http', '$httpParamSerializer',
	function ($log, $http, $httpParamSerializer) {
		return {
			Logout: function (callback) {
				
				delete $http.defaults.headers.common['X-Requested-With'];
				$http.defaults.useXDomain = true;
				$http.defaults.withCredentials = true;
				//$http.defaults.xsrfCookieName = "PHPSESSID=4ldq094ni23hd4bfvh32s04ai4";
				//$http.defaults.headers.common["Accept"] = "application/json";
				$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
				
				$http({
				//  url: "http://142.4.215.210:11080/api/user/logout", 
					url: "https://oktpus.com/api/user/logout",
					method: "GET",
					responseType: 'json'
				}).success(function(response, status) {
					callback(response, 1);
				}).error(function(response, status, headers, config) {
					$log.debug("Error:menuListFactory-Logout");
					$log.debug(response);
					callback(response, 0);
				});
			}
		}	
	}]);
