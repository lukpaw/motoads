'use strict';

describe('MotoAds App', function() {

  describe('Adverts view', function() {

    beforeEach(function() {
      browser().navigateTo('../../#/');
    });

    it('should filter on brand and model link click', function() {
      expect(repeater('.ma-advert-table-row').count()).toBe(29);

      element('.accordion-group:eq(0) ul:eq(0) a').click();
      expect(repeater('.ma-advert-table-row').count()).toBe(4);

      element('.accordion-group:eq(3) ul:eq(0) a').click();
      expect(repeater('.ma-advert-table-row').count()).toBe(2);
    });

    it('should filter on country and region select choose', function() {
      expect(repeater('.ma-advert-table-row').count()).toBe(29);

      select('filter.country').option('Germany');
      expect(repeater('.ma-advert-table-row').count()).toBe(20);

      select('filter.region').option('Bavaria');
      expect(repeater('.ma-advert-table-row').count()).toBe(18);
    });

    it('should filter on yearFrom and yearTo type', function() {
      expect(repeater('.ma-advert-table-row').count()).toBe(29);

      input('filter.yearFrom').enter('2010');
      expect(repeater('.ma-advert-table-row').count()).toBe(16);

      input('filter.yearTo').enter('2011');
      expect(repeater('.ma-advert-table-row').count()).toBe(14);
    });

    it('should sort by year', function() {
      expect(repeater('.ma-advert-table-row').count()).toBe(29);

      select('sortByCol').option("Year");
      expect(element('.ma-advert-table-row:eq(0) td:eq(3)').text()).toContain('2005');
      expect(element('.ma-advert-table-row:eq(28) td:eq(3)').text()).toContain('2012');
    });

  });
});