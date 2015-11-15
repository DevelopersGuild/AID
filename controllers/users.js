var models = require('../models');

var UsersController = {
  name: 'UsersController',

  index: function(req, res, next) {
    res.send("much index");
  },

  show: function(req, res, next) {
    if (req)
    res.send(res.user.updatedAt+" wow so show");
  },

  retrieve_id: function(req, res, next, id) {
    models.User.findById(id).then(function(user) {
      if (user) {
        res.user = user;
        next();
      } else {
        next(new Error('failed to load user'));
      }
    });
  }
};

module.exports = UsersController;
