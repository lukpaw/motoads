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

motoAdsApp.directive('commentForm', function(Advert) {
  return {
    restrict: "E",
    replace: true,
    scope: {
      commentModeOn: '=',
      advertId: '='
    },
    templateUrl: "views/commentForm.html",
    link: function(scope, element, attrs) {
      scope.content = '';
      scope.previewModeOn = false;

      scope.closeCommentForm = function() {
        scope.previewModeOn = false;
        scope.commentModeOn = false;
      };

      scope.isUnchanged = function() {
        return angular.isUndefined(scope.content) || angular.equals(scope.content, '');
      };

      scope.togglePreviewMode = function() {
        scope.preview = scope.content;
        scope.previewModeOn = !scope.previewModeOn;
      };

      scope.sendCommentForm = function() {
        var advert = Advert.get({advertId: scope.advertId}, function() {
          advert.comments.push(scope.content);
          Advert.update(advert, function() {
            scope.closeCommentForm();
            scope.$parent.advert.comments.push(scope.content);
            scope.content = '';
          });
        });

        scope.preview = scope.content;
        scope.previewModeOn = true;
      };
    }
  };
});