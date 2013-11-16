'use strict';

motoAdsApp.controller('NavbarController', function NavbarController($scope, $location) {

  $scope.routeIs = function(routeName) {
    return $location.path() === routeName;
  };

});

motoAdsApp.controller('AdvertsController', ['$scope', '$window', 'Brand', 'Country', 'Advert',
  function($scope, $window, Brand, Country, Advert) {
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

    $scope.adverts = [];
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
    }

    $scope.removeAdvert = function(_advertId) {
      Advert.remove({advertId: _advertId}, function() {
        alert('Advert removed');
        // TODO refresh page
      });
    };

    $scope.editAdvert = function(_advertId) {
      $window.location = "#/editAdvert/" + _advertId;
    };

  }]);

motoAdsApp.controller('AddAdvertController', ['$scope', 'Brand', 'Country', 'Advert',
  function($scope, Brand, Country, Advert) {
    $scope.brands = Brand.query();

    $scope.countries = Country.query();

    var emptyAdvert = {
      _id: null,
      brand: null,
      model: null,
      year: 2010,
      price: 10000,
      imageUrl: "img/audi_a1_1.jpg",
      country: null,
      region: null
    };

    $scope.addAdvert = function() {
      var newAdvert = {
        _id: null,
        brandName: $scope.newAdvert.brand.name,
        modelName: $scope.newAdvert.model.name,
        year: $scope.newAdvert.year,
        price: $scope.newAdvert.price,
        imageUrl: $scope.newAdvert.imageUrl,
        countryName: $scope.newAdvert.country.name,
        regionName: $scope.newAdvert.region.name
      };

      Advert.save(newAdvert, function() {
        alert('New advert added');
        $scope.reset();
      });
    };

    $scope.reset = function() {
      $scope.newAdvert = angular.copy(emptyAdvert);
      if ($scope.advertForm) {
        // TODO Uncomment in angular 1.1.1 or higher
        //$scope.advertForm.$setPristne();
      }
    };

    $scope.isUnchanged = function() {
      return angular.equals($scope.newAdvert, emptyAdvert);
    };

    $scope.reset();
  }]);

motoAdsApp.controller('EditAdvertController', ['$scope', '$routeParams', 'Brand', 'Country', 'Advert',
  function($scope, $routeParams, Brand, Country, Advert) {
    $scope.brands = Brand.query();
    var brand = null;
    var model = null;

    function currentBrandAndModel(brandName, modelName) {
      angular.forEach($scope.brands, function(item) {
        if (item.name === brandName) {
          brand = item;
          return 1;
        }
      });

      angular.forEach(brand.models, function(item) {
        if (item.name === modelName) {
          model = item;
          return 1;
        }
      });
    }

    $scope.countries = Country.query();
    var country = null;
    var region = null;

    function currentCountryAndRegion(countryName, regionName) {
      angular.forEach($scope.countries, function(item) {
        if (item.name === countryName) {
          country = item;
          return 1;
        }
      });

      angular.forEach(country.regions, function(item) {
        if (item.name === regionName) {
          region = item;
          return 1;
        }
      });
    }

    var previousAdvert = null;
    var retrieveAdvert = Advert.get({advertId: $routeParams.advertId}, function() {
      currentBrandAndModel(retrieveAdvert.brandName, retrieveAdvert.modelName);
      currentCountryAndRegion(retrieveAdvert.countryName, retrieveAdvert.regionName);

      $scope.editAdvert = {
        _id: retrieveAdvert._id,
        brand: brand,
        model: model,
        year: retrieveAdvert.year,
        price: retrieveAdvert.price,
        imageUrl: retrieveAdvert.imageUrl,
        country: country,
        region: region
      };
      
      previousAdvert = angular.copy($scope.editAdvert);
    });

    $scope.updateAdvert = function() {
      var editAdvert = {
        _id: $scope.editAdvert._id,
        brandName: $scope.editAdvert.brand.name,
        modelName: $scope.editAdvert.model.name,
        year: $scope.editAdvert.year,
        price: $scope.editAdvert.price,
        imageUrl: $scope.editAdvert.imageUrl,
        countryName: $scope.editAdvert.country.name,
        regionName: $scope.editAdvert.region.name
      };

      Advert.update(editAdvert, function() {
        previousAdvert = angular.copy($scope.editAdvert);
        alert('Advert updated');
      });
    };

    $scope.isUnchanged = function() {
      return angular.equals($scope.editAdvert, previousAdvert);
    };
    
    // TODO Add reset button to retrieve data from previousAdvert
  }]);