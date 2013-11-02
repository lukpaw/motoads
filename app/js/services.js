'use strict';

var motoAdsServices = angular.module('motoAdsServices', ['ngResource']);

motoAdsServices.factory('Brand', ['$resource', function($resource) {
    return $resource('data/:id.json', {}, {
      query: {
        method: 'GET',
        params: {
          id: 'brands'
        },
        isArray: true
      }
    });
  }]);

motoAdsServices.factory('Country', ['$resource', function($resource) {
    return $resource('data/:id.json', {}, {
      query: {
        method: 'GET',
        params: {
          id: 'countries'
        },
        isArray: true
      }
    });
  }]);

motoAdsServices.factory('Advert', ['$resource', function($resource) {
    return $resource('data/:id.json', {}, {
      query: {
        method: 'GET',
        params: {
          id: 'adverts'
        },
        isArray: true
      }
    });
  }]);
