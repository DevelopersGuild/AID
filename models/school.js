module.exports = function(sequelize, DataTypes) {
  var School = sequelize.define('School', {
    assist_code: DataTypes.STRING,
    full_name:   DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        School.hasMany(models.Course);
      }
    },
    underscored: true
  });
  return School;
};