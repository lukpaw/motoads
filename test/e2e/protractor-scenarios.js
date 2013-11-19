var util = require('util');

var MotoAdsHomepage = function() {
  this.adverts = element.all(by.repeater('advert in adverts| orderBy:sortByCol.key'));

  this.get = function() {
    browser.get('#/');
  };
};


describe('Adverts view', function() {

  it('should filter on country and region select choose', function() {
    var motoAdsHomepage = new MotoAdsHomepage();
    motoAdsHomepage.get();

    expect(motoAdsHomepage.adverts.count()).toEqual(29);
  });

});