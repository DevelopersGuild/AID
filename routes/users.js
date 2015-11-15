var express = require('express');
var router = express.Router();
router.name = 'users';

var UsersController = require('../controllers/users');

router.param('id', UsersController.retrieve_id);
router.get('/:id', UsersController.show);

module.exports = router;
