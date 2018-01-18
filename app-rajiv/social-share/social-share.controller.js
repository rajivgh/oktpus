/*global angular*/

(function withAngular(angular) {
  'use strict';

  angular.module('oktpusShare', [
    'ngRoute',
    'share.socialshare'
  ])
  .config(['socialshareConfProvider', function configApp(socialshareConfProvider) {

    socialshareConfProvider.configure([{
      'provider': 'twitter',
      'conf': {
        'url': '{{url}}',
        'text': '{{title}}',
        'via': 'npm',
        'hashtags': '{{make}}',
        'trigger': 'click',
        'popupHeight': 800,
        'popupWidth' : 400
      }
    }]);
  }])
  .controller('ShareController', ['$scope', '$timeout','Socialshare',
  function ($scope, $timeout, Socialshare) {
	 $scope.shareDetails  =  function(url, media, title, city, make, model) {		
		 $scope.$parent.showSharePopUp = true;
		 $scope.$parent.url   = url;
		 $scope.$parent.media = media;
		 $scope.$parent.title = title + '   ';
		 $scope.$parent.city = city;
		 $scope.$parent.make = make;
		 $scope.$parent.model = model;		
    }  
     $scope.closeSharePopUp  =  function() {	
		 $scope.$parent.showSharePopUp = false;	
    }  
    
  }]);
}(angular));
