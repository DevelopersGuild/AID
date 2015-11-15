module.exports = function(sequelize, DataTypes) {
  var ArticulationCourse = sequelize.define('ArticulationCourse', {
    // this model used as a go-between for the Articulation/Course models
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        ArticulationCourse.belongsTo(models.Articulation);
        ArticulationCourse.belongsTo(models.Course);
      }
    }
  });
  return ArticulationCourse;
};