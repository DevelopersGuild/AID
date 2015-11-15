module.exports = function(sequelize, DataTypes) {
  var Major = sequelize.define('Major', {
    assist_code: DataTypes.STRING,
    full_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Major.belongsToMany(models.School, {through: 'SchoolMajor'});
      }
    }
  });
  return Major;
};