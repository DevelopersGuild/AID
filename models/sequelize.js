var config = require('../config');
var Sequelize = require('sequelize');

var sequelize = new Sequelize(
  config.db_info.name,
  config.db_info.username,
  config.db_info.password,
  {
    host: config.db_info.host,
    dialect: config.db_info.type,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
);

module.exports = sequelize;
