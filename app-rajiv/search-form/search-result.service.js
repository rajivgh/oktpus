'use strict';

angular.module('searchForm')
.factory('searchResultFactory',['$log', '$http', '$httpParamSerializer',
	function ($log, $http, $httpParamSerializer) {
		var searchResultFactory = function() {
			
		};

		searchResultFactory.prototype.setData = function(domainID, perPageShow, requestData, callback) {
			this.domainID = domainID;
			this.perPageShow = perPageShow;
			this.data = requestData;
			this.searchResult = [];
			this.busy = false;
			
			callback();
		};

		searchResultFactory.prototype.nextPage = function(pageNumber, callback) {
			if (this.busy) return;
			this.busy = true;

			delete $http.defaults.headers.common['X-Requested-With'];
			$http.defaults.useXDomain = true;
			$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			
			var param = {domain_id: this.domainID, page:pageNumber, per_page:this.perPageShow};
			
			return $http({
				//	url: "http://142.4.215.210:11080/api/item", 
					url: "https://oktpus.com/api/item", 
					method: "POST",
					params: param,
					data: $httpParamSerializer(this.data),
					responseType: 'json'
				}).success(function(response, status) {
					if(response != null){
						this.searchResult = response.result.search_result;
					}
					this.busy = false;
					callback(response);
				}.bind(this)).error(function(response, status, headers, config) {
					$log.debug("Error:searchResultFactory-searchResultFactory");				
					callback(response);
				});
		};

		return searchResultFactory;
}]);
