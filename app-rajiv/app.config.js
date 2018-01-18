'use strict';

angular.
  module('oktpusApp').
  config(['$stateProvider', '$urlRouterProvider', '$logProvider',
    function config($stateProvider, $urlRouterProvider, $logProvider) {
		$urlRouterProvider.otherwise('/home');
		
		$logProvider.debugEnabled(true);
	
		var injector = angular.injector();
		var $cookies;
		angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
			$cookies = _$cookies_;
		}]);
	  
		var isLogin = $cookies.get('isLogin');
		
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'home-page/home_page.template.html',
				controller: 'HomePageController',
				onEnter: isUserLogedIn,
			})
			.state('menu', {
				url: '/menu',
				templateUrl: 'menu-component/menu.template.html',
			})
			.state('login', {
				url: '/login',
				params: {
					product_id: null,
					flag_name: null,
					flag_action: null,
					action: null,			
				},
				templateUrl: 'log-in/log-in.template.html',
				controller: 'LogInController',
				onEnter: isUserLogedIn,
			})
			.state('logout', {
				url: '/logout',
				templateUrl: 'home-page/home_page.template.html',
				controller: 'HomePageController',
				onEnter: logout,
			})
			.state('signup', {
				url: '/signup',
				templateUrl: 'sign-up/sign-up.template.html',
				controller: 'SignUpController',
				onEnter: isUserLogedIn,
			})
			.state('forgotpwd', {
				url: '/forgotpwd',
				templateUrl: 'forgot-pwd/forgot-pwd.template.html',
				controller: 'ForgotPwdController',
				onEnter: isUserLogedIn,
			})
			.state('learnmore', {
				url: '/learnmore',
				templateUrl: 'learnmore-component/learnmore.template.html',
				controller: 'LearnMoreController'
			})
			.state('search', {
				url: '/search',
				params: {
					searchKeyword: null,
					selectedSearchFields: null,
					searchFormType: null,
					searchID: null,
					savedSearchData: null,
					savedSearchValuesCount: null,
					notificationStatus: null,
					formType : null				
				},
				templateUrl: 'search-form/search-form.template.html',
				controller: 'SearchFormController'
			})
			.state('wall-of-deals', {
				url: '/wall-of-deals',
				params: {
					searchKeyword: null,
					selectedSearchFields: null,
					searchFormType: null,
					searchID: null,
					savedSearchData: null,
					savedSearchValuesCount: null,
					notificationStatus: null,
					formType : null				
				},
				templateUrl: 'search-form/search-form.template.html',
				controller: 'SearchFormController'
			})
		   .state('settings', {
				url: '/settings',
				templateUrl: 'user-settings/settings.template.html',
				controller: 'UserSettingsController',
				onEnter: checkLoginStatus,
			})
			.state('savedsearch', {
				url: '/savedsearch',
				templateUrl: 'saved-search/saved-search.template.html',
				controller: 'SavedSearchController',
				onEnter: checkLoginStatus,
			})
			.state('garage', {
				url: '/garage',
				templateUrl: 'garage/garage.template.html',
				controller: 'GarageController',
				onEnter: checkLoginStatus,
			})
			.state('notification', {
				url: '/notification',
				templateUrl: 'notification/notification.template.html',
				controller: 'NotificationController',
				onEnter: checkLoginStatus, 
			})
			.state('about', {
				url: '/about',
				templateUrl: 'footer-items/about.html',
				controller: 'FooterController'
			})
			.state('contact', {
				url: '/contact',
				templateUrl: 'footer-items/contact.html',
				controller: 'FooterController'
			})
			.state('privacy', {
				url: '/privacy',
				templateUrl: 'footer-items/privacy.html',
				controller: 'FooterController'
			})
			.state('terms', {
				url: '/terms',
				templateUrl: 'footer-items/terms.html',
				controller: 'FooterController'
			})
			.state('compare', {
				url: '/compare',
				templateUrl: 'compare/compare.template.html',
				controller: 'CompareController'
				
			})
			.state('wmcw', {
				url: '/wmcw',
				templateUrl: /*'wmcw/wmcw.html',*/'wmcw/wmcw.template.html',
				controller: 'CarWorthController'
			});
			//~ .state('show', {
				//~ //parent: 'search',
				//~ url: '/show',
				//~ params: {
					//~ requestData: null,
					//~ totalCount: null,
					//~ attributeLabel: null,
					//~ searchResult:null,
					//~ userDisplayFormat:null
				//~ },
				//~ templateUrl: 'search-result/search-result.template.html',
				//~ controller: 'SearchResultController'
			//~ });
        
		function checkLoginStatus() {
			if($cookies.get('isLogin') == undefined || $cookies.get('isLogin') == false){					
				var url = this.url ;
				url = url.replace('/','');
				injector = angular.element($('body')).injector();
				injector.get('$state').previous = { url : url};
				injector.get('$state').go('login');									
			}
		}
		
		function isUserLogedIn() {
			if($cookies.get('isLogin')){	
				injector = angular.element($('body')).injector();
				injector.get('$state').go('search');									
			}
		}
		
		function logout() {
			var cookies = $cookies.getAll();
			angular.forEach(cookies, function (v, k) {			
				$cookies.remove(k);
			});		
	    } 	        
	}
]);
