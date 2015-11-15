var express     = require('express');
var router      = express.Router();
var controllers = require('../controllers');
var fs          = require('fs');
var path        = require('path');
var basename    = path.basename(module.filename);
var routes      = {};

/*
 * Load all routes
 */
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var route = require(path.join(__dirname, file));
    routes[route.name] = route;
  });

/*
 * Specify all routes
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// ----- User controller routes
router.get('/users', controllers.UsersController.index);

module.exports = router;
