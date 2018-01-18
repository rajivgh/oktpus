'use strict';

angular.module('searchResult')
.factory('searchResultFactory',['$http', '$httpParamSerializer',
	function ($http, $httpParamSerializer) {
		var searchResultFactory = function(domainID, perPageShow, requestData) {
			this.domainID = domainID;
			this.perPageShow = perPageShow;
			this.data = requestData;
			this.searchResult = [];
			this.busy = false;
		};

		searchResultFactory.prototype.nextPage = function(pageNumber, callback) {
			if (this.busy) return;
			this.busy = true;

			delete $http.defaults.headers.common['X-Requested-With'];
			$http.defaults.useXDomain = true;
			$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			
			var param = {domain_id: this.domainID, page:pageNumber, per_page:this.perPageShow};
			
			return $http({
					url: "http://142.4.215.210:11080/api/item", 
					method: "POST",
					params: param,
					data: $httpParamSerializer(this.data),
					responseType: 'json'
				}).success(function(response, status) {
					this.searchResult = response.result.search_result;
					this.busy = false;
					callback(response);
				}.bind(this)).error(function(response, status, headers, config) {
					console.log(response);
					console.log(status);
					console.log(headers);
					console.log(config);
					callback(response);
				});
		};

		return searchResultFactory;
}]);
