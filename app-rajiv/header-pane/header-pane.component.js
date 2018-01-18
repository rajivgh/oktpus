'use strict';

var myModule = angular.module('headerPane');

// Register `headerPane` component, along with its associated controller and template
myModule.component('headerPane1', {
    templateUrl: 'header-pane/header-pane1.template.html',
    controller: 'HeaderController'
  });


myModule.component('headerPane2', {
    templateUrl: 'header-pane/header-pane2.template.html',
    controller: 'HeaderController'
  });
