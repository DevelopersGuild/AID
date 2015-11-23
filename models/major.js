module.exports = function(sequelize, DataTypes) {
  var Major = sequelize.define('Major', {
    assist_code: DataTypes.STRING,
    full_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Major.hasOne(models.Articulation);
        Major.belongsTo(
          models.School, { as: 'iaSchool' }
        );
        Major.belongsTo(
          models.School, { as: 'oiaSchool' }
        );
      }
    },
    underscored: true
  });
  return Major;
};