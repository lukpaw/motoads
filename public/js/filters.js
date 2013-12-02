'use strict';

motoAdsApp.filter('newlines', function() {
  return function(text) {
    if (text) {
      return text.replace(/\n/g, '<br/>');
    }
    return text;
  };
});