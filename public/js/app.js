'use strict';

var motoAdsApp = angular.module('motoAdsApp', ['ui.bootstrap', 'motoAdsServices']);

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
            });
  }]);