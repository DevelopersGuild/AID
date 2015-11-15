module.exports = function(sequelize, DataTypes) {
  var Articulation = sequelize.define('Articulation', {
    // this model used as a go-between for the Major/Course models
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Articulation.belongsTo(models.Major);
      }
    }
  });
  return Articulation;
};