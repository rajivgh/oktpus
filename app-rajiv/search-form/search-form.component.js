'use strict';

var myModule = angular.module('searchForm');

// Register `searchForm` component, along with its associated controller and template
myModule.component('searchFormPartial', {
    templateUrl: 'search-form/search-form-partial.template.html',
    controller: 'SearchFormController'
  });

myModule.component('searchFormFull', {
    templateUrl: 'search-form/search-form.template.html',
    controller: 'SearchFormController'
  });

myModule.component('searchForm', {
    templateUrl: 'search-form/search-form.template.html',
    controller: 'SearchFormController'
  });
