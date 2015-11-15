var express = require('express');
var router = express.Router();

var controllers = require('../controllers');

/*
 * Specify all routes
 */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// ----- User controller routes
router.get('/users', controllers.UsersController.index);

module.exports = router;
