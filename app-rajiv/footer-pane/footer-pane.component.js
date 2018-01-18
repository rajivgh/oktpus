'use strict';

var myModule = angular.module('footerPane');

// Register `footerPane` component, along with its associated controller and template
myModule.component('footerPane', {
    templateUrl: 'footer-pane/footer-pane.template.html',
    controller: 'FooterController'
  });
