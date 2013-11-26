'use strict';

var motoAdsApp = angular.module('motoAdsApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'motoAdsServices']);

motoAdsApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
            when('/', {
              controller: 'AdvertsController',
              templateUrl: 'views/adverts.html'
            }).
            when('/addAdvert', {
              controller: 'AddAdvertController',
              templateUrl: 'views/addAdvert.html'
            }).
            when('/editAdvert/:advertId', {
              controller: 'EditAdvertController',
              templateUrl: 'views/editAdvert.html'
            });
  }]);