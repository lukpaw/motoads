'use strict';

var BRANDS_RESPONSE = [
  {"name": "Audi", "models": [{"name": "A1"}, {"name": "A3"}]},
  {"name": "Dacia", "models": [{"name": "Duster"}, {"name": "Logan"}]}
];

var COUNTRIES_RESPONSE = [
  {"name": "Germany", "regions": [{"name": "Bavaria"}, {"name": "Hesse"}]},
  {"name": "Poland", "regions": [{"name": "Lesser Poland"}, {"name": "Masovia"}]}
];

var ADVERTS_RESPONSE = [
  {
    "brandName": "Audi",
    "modelName": "A1",
    "year": 2011,
    "price": "35000",
    "imageUrl": "img/audi_a1_1.jpg",
    "countryName": "Germany",
    "regionName": "Bavaria"
  },
  {
    "brandName": "Audi",
    "modelName": "A1",
    "year": 2010,
    "price": "30000",
    "imageUrl": "img/audi_a1_2.jpg",
    "countryName": "Poland",
    "regionName": "Masovia"
  },
  {
    "brandName": "Dacia",
    "modelName": "Duster",
    "year": 2012,
    "price": "33000",
    "imageUrl": "img/dacia_duster_1.jpg",
    "countryName": "Poland",
    "regionName": "Masovia"
  },
  {
    "brandName": "Dacia",
    "modelName": "Duster",
    "year": 2009,
    "price": "27000",
    "imageUrl": "img/dacia_duster_2.jpg",
    "countryName": "Germany",
    "regionName": "Bavaria"
  }];

describe('MotoAds controllers', function() {
  beforeEach(module('motoAdsApp'));
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('motoAdsServices'));

  describe('AdvertsController', function() {
    var scope, ctrl, $httpBackend, orderByFilter;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $filter) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/api/brands').respond(BRANDS_RESPONSE);
      $httpBackend.expectGET('/api/countries').respond(COUNTRIES_RESPONSE);
      $httpBackend.expectGET('/api/adverts').respond(ADVERTS_RESPONSE);

      orderByFilter = $filter('orderBy');

      scope = $rootScope.$new();
      ctrl = $controller('AdvertsController', {$scope: scope});
    }));

    it('should filter by brand and model', function() {
      expect(scope.adverts).toEqual([]);
      $httpBackend.flush();
      expect(scope.adverts.length).toBe(4);

      scope.$apply(function() {
        scope.filter = {
          brandName: "Audi",
          modelName: "A1",
          country: null,
          region: null,
          yearFrom: null,
          yearTo: null
        };
      });

      expect(scope.adverts.length).toBe(2);
    });

    it('should filter by country and region', function() {
      expect(scope.adverts).toEqual([]);
      $httpBackend.flush();
      expect(scope.adverts.length).toBe(4);

      scope.$apply(function() {
        scope.filter = {
          brandName: null,
          modelName: null,
          country: {name: "Germany"},
          region: {name: "Bavaria"},
          yearFrom: null,
          yearTo: null
        };
      });

      expect(scope.adverts.length).toBe(2);
    });

    it('should filter by from yearFrom to yearTo', function() {
      expect(scope.adverts).toEqual([]);
      $httpBackend.flush();
      expect(scope.adverts.length).toBe(4);

      scope.$apply(function() {
        scope.filter = {
          brandName: null,
          modelName: null,
          country: null,
          region: null,
          yearFrom: 2011,
          yearTo: 2012
        };
      });

      expect(scope.adverts.length).toBe(2);
    });

    it('should sort by year', function() {
      expect(scope.adverts).toEqual([]);
      $httpBackend.flush();
      expect(scope.adverts.length).toBe(4);

      var sortedAdverts = orderByFilter(scope.adverts, "year");

      var prevYear = 0;
      for (var i = 0; i < sortedAdverts.length; i++) {
        var advert = sortedAdverts[i];
        expect(advert.year).toBeGreaterThan(prevYear);
        prevYear = advert.year;
      }
    });

  });

});