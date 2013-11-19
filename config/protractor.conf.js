exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
    'browserName': 'chrome'
  },
  specs: ['../test/e2e/**/protractor-*.js'],
  jasmineNodeOpts: {
    isVerbose: false,
    showColors: true
  },
  baseUrl: 'http://localhost:3000/'
};