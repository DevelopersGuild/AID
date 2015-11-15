module.exports = function(sequelize, DataTypes) {
  var Star = sequelize.define('Star', {
    none: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Star.hasOne(models.Major);
        Star.belongsToMany(models.User, { through: 'UserStar' });
      }
    }
  });
  return Star;
};