'use strict';

// Register `menuList` component, along with its associated controller and template
angular.
  module('menuList').
  component('menuList', {
    templateUrl: 'menu-list/menu-list.template.html',
    controller: 'MenuListController'
  });
