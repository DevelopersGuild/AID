module.exports = function(sequelize, DataTypes) {
  var Star = sequelize.define('Star', {
    none: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Star.belongsTo(models.Major);
        Star.belongsToMany(models.User, { through: 'UserStar' });
      }
    },
    underscored: true
  });
  return Star;
};