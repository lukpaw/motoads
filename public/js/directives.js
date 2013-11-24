'use strict';

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

motoAdsApp.directive('commentForm', function() {
  return {
    restrict: "E",
    replace: true,
    scope: true,
    templateUrl: "views/commentForm.html",
    link: function(scope) {
      scope.content = null;
      scope.previewModeOn = false;

      scope.isUnchanged = function() {
        return angular.isUndefined(scope.content) || angular.equals(scope.content, null);
      };

      scope.activateComment = function() {
        scope.content = null;
        scope.previewModeOn = false;
      };

      scope.togglePreviewMode = function() {
        scope.preview = scope.content;
        scope.previewModeOn = !scope.previewModeOn;
      };

      scope.cancelComment = function() {
        scope.content = null;
      };

      scope.addComment = function() {
        alert('Thanks for your comment');
        scope.preview = scope.content;
        scope.previewModeOn = true;
      };
    }
  };
});