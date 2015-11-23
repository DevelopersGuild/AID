module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define('Course', {
    assist_code: DataTypes.STRING,
    full_name: DataTypes.STRING,
    units: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Course.belongsToMany(models.Articulation, { through: 'ArticulationCourses' });
        Course.belongsTo(models.School);
      }
    },
    underscored: true
  });
  return Course;
};