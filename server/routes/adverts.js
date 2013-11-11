exports.findAll = function(req, res) {
  var fs = require('fs');
  var file = './server/data/adverts.json';

  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  });
};