'use strict';

motoAdsApp.controller('NavbarController', function NavbarController($scope, $location) {

  $scope.routeIs = function(routeName) {
    return $location.path() === routeName;
  };

});

motoAdsApp.controller('AdvertsController', ['$scope', '$filter', '$window', 'Brand', 'Country', 'Advert',
  function($scope, $filter, $window, Brand, Country, Advert) {
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

    $scope.sortAdverts = function(sortKey) {
      if (sortKey) {
        console.log('sortKey = ' + sortKey);
        $scope.adverts = $filter('orderBy')($scope.adverts, sortKey);
      }
    };

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
      $scope.adverts = $filter('orderBy')($scope.adverts, ['brandName', 'modelName']);
    }

    $scope.removeAdvert = function(idx) {
      var removeAdvert = $scope.adverts[idx];
      Advert.remove({advertId: removeAdvert._id}, function() {
        $scope.adverts.splice(idx, 1);
        alert('Advert removed');
      });
    };

    $scope.editAdvert = function(_advertId) {
      $window.location = "#/editAdvert/" + _advertId;
    };
  }]);

motoAdsApp.controller('CommentController', ['$scope',
  function($scope) {
    $scope.commentModeOn = false;
    
    $scope.isAnyComment = function() {
      return ($scope.advert.comments.length > 0);
    };
  }]);

motoAdsApp.controller('AddAdvertController', ['$scope', '$window', 'Brand', 'Country', 'Advert',
  function($scope, $window, Brand, Country, Advert) {
    $scope.brands = Brand.query();

    $scope.countries = Country.query();

    var emptyAdvert = {
      brandName: null,
      modelName: null,
      year: 2010,
      price: 10000,
      imageUrl: "img/audi_a1_1.jpg",
      countryName: null,
      regionName: null
    };

    $scope.addAdvert = function() {
      Advert.save($scope.newAdvert, function() {
        alert('New advert added');
        // if not return to #/
        //$scope.resetAdvert();
        $window.location = "#/";
      });
    };

    $scope.resetAdvert = function() {
      $scope.brand = null;
      $scope.model = null;
      $scope.country = null;
      $scope.region = null;
      $scope.newAdvert = angular.copy(emptyAdvert);
      if ($scope.advertForm) {
        $scope.advertForm.$setPristine();
      }
    };

    $scope.isUnchanged = function() {
      return angular.equals($scope.newAdvert, emptyAdvert);
    };

    $scope.resetAdvert();
  }]);

motoAdsApp.controller('EditAdvertController', ['$scope', '$routeParams', '$window', 'Brand', 'Country', 'Advert',
  function($scope, $routeParams, $window, Brand, Country, Advert) {
    $scope.brands = Brand.query();

    function currentBrandAndModel(brandName, modelName) {
      angular.forEach($scope.brands, function(item) {
        if (item.name === brandName) {
          $scope.brand = item;
          return;
        }
      });

      angular.forEach($scope.brand.models, function(item) {
        if (item.name === modelName) {
          $scope.model = item;
          return;
        }
      });
    }

    $scope.countries = Country.query();

    function currentCountryAndRegion(countryName, regionName) {
      angular.forEach($scope.countries, function(item) {
        if (item.name === countryName) {
          $scope.country = item;
          return;
        }
      });

      angular.forEach($scope.country.regions, function(item) {
        if (item.name === regionName) {
          $scope.region = item;
          return;
        }
      });
    }

    var previousAdvert = null;
    $scope.editAdvert = Advert.get({advertId: $routeParams.advertId}, function() {
      currentBrandAndModel($scope.editAdvert.brandName, $scope.editAdvert.modelName);
      currentCountryAndRegion($scope.editAdvert.countryName, $scope.editAdvert.regionName);
      previousAdvert = angular.copy($scope.editAdvert);
    });

    $scope.updateAdvert = function() {
      Advert.update($scope.editAdvert, function() {
        // if not return to #/
        //previousAdvert = angular.copy($scope.editAdvert);
        alert('Advert updated');
        $window.location = "#/";
      });
    };

    $scope.isUnchanged = function() {
      return angular.equals($scope.editAdvert, previousAdvert);
    };

    $scope.resetAdvert = function() {
      $scope.editAdvert = angular.copy(previousAdvert);
      if ($scope.advertForm) {
        $scope.advertForm.$setPristine();
      }
    };
  }]);