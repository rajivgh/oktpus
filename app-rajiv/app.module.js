'use strict';

angular.module('oktpusServiceModule', []);
angular.module('homePage', []);
angular.module('headerPane', []);
angular.module('searchForm', []);
angular.module('menuPage', []);
angular.module('menuList', []);
angular.module('logIn', []);
angular.module('signUp', []);
angular.module('forgotPwd', []);
angular.module('learnMore', []);
angular.module('userSettings', []);
angular.module('savedSearch', []);
angular.module('garage', []);
angular.module('notification', []);
angular.module('footerPane', []);
angular.module('oktpusShare', []);
angular.module('compare',[]);
angular.module('wmcw',[]);
//angular.module('test',[]);

// Define the `oktpusApp` module
angular.module('oktpusApp', [
	// ...which depends on following module's
/*	'ngAnimate',
	'ngAria',
	'material.svgAssetsCache',
	'ngMessages',*/
	'ui.router',
	'ng.deviceDetector',
	'rzModule',
	'ngStorage',
	'ngSanitize',
	'ngCookies',
	'oktpusServiceModule',
	'multiSelectDropDown',
	'errSrc',
	'disableElement',
	'scrollLoadData',
	'homePage',
	'headerPane',
	'searchForm',
	'menuPage',
	'menuList',
	'logIn',
	'signUp',
	'forgotPwd',
	'learnMore',
	'duScroll',
	'userSettings',
	'savedSearch',
	'garage',
	'notification',
	'footerPane',
	'ngDisableScroll',
	'reSizeWindow',
	'oktpusShare',
	'compare',
	'wmcw'
]);
