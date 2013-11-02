'use strict';

motoAdsApp.controller('NavbarController', function NavbarController($scope, $location) {

  $scope.routeIs = function(routeName) {
    return $location.path() === routeName;
  };

});

motoAdsApp.controller('AdvertsController', ['$scope', 'Brand', 'Country', 'Advert', 
  function($scope, Brand, Country, Advert) {
    $scope.oneAtATime = true;

    $scope.brands = Brand.query();

    $scope.countries = Country.query();

    $scope.sortByCols = [{
        "key": "year",
        "name": "Year"
      }, {
        "key": "price",
        "name": "Price"
      }];

    var allAdverts = Advert.query(filterAdverts);

    $scope.filter = {
      brandName: null,
      modelName: null,
      country: null,
      region: null,
      yearFrom: null,
      yearTo: null
    };

    $scope.isAnyFilter = function() {
      var f = $scope.filter;
      if (f.brandName || f.modelName || f.country || f.region || f.yearFrom || f.yearTo) {
        return true;
      }
      return false;
    };

    $scope.removeAllFilter = function() {
      $scope.filter = {
        brandName: null,
        modelName: null,
        country: null,
        region: null,
        yearFrom: null,
        yearTo: null
      };
    };

    $scope.addBrandModelFilter = function(brand, model) {
      $scope.filter.brandName = brand.name;
      $scope.filter.modelName = model.name;
    };

    $scope.$watch('filter', filterAdverts, true);

    function filterAdverts() {
      $scope.adverts = [];
      angular.forEach(allAdverts, function(row) {
        if (!$scope.filter.country) {
          $scope.filter.region = null;
        }
        if ($scope.filter.brandName && $scope.filter.brandName !== row.brandName) {
          return;
        }
        if ($scope.filter.modelName && $scope.filter.modelName !== row.modelName) {
          return;
        }
        if ($scope.filter.country && $scope.filter.country.name !== row.countryName) {
          return;
        }
        if ($scope.filter.region && $scope.filter.region.name !== row.regionName) {
          return;
        }
        if ($scope.filter.yearFrom && $scope.filter.yearFrom > row.year) {
          return;
        }
        if ($scope.filter.yearTo && $scope.filter.yearTo < row.year) {
          return;
        }
        $scope.adverts.push(row);
      });
    };

  }]);

motoAdsApp.controller('AddAdvertController', ['$scope', 'Brand', 'Country', 'Advert', 
  function($scope, Brand, Country) {
    $scope.brands = Brand.query();

    $scope.countries = Country.query();

    $scope.emptyAdvert = {
      brand: null,
      model: null,
      year: 2010,
      price: 10000,
      country: null,
      region: null
    };

    $scope.add = function() {
      alert('User added!');
      // TODO: Store it!
      $scope.reset();
    };

    $scope.reset = function() {
      $scope.newAdvert = angular.copy($scope.emptyAdvert);
      if ($scope.advertForm) {
        // TODO Uncomment in angular 1.1.1 or higher
        //$scope.advertForm.$setPristne();
      }
    };

    $scope.isUnchanged = function() {
      return angular.equals($scope.newAdvert, $scope.emptyAdvert);
    };

    $scope.reset();
  }]);

var CURRENCY_REGEXP = /^\-?\d+((\.|\,)\d{0,2})?$/;
motoAdsApp.directive('maCurrency', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (CURRENCY_REGEXP.test(viewValue)) {
          ctrl.$setValidity('float', true);
          return parseFloat(viewValue.replace(',', '.'));
        } else {
          ctrl.$setValidity('float', false);
          return undefined;
        }
      });
    }
  };
});