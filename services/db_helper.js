/**
* Helper functions for adding Assist data to database.
*/

var db      = require('../models/index');
var Scraper = require('../services/assist_scraper');

var Articulation       = db.Articulation;
var ArticulationCourse = db.ArticulationCourse;
var Course             = db.Course;
var Major              = db.Major;
var School             = db.School;

// Turn logging off.
db.sequelize.options.logging = false;

var DbHelper = {
  add_articulation: _add_articulation
};

module.exports = DbHelper;

function _add_articulation(articulation)
{
  if (!articulation)
    return;

  // Grab individual data.
  var ia      = articulation.ia;
  var oia     = articulation.oia;
  var major   = articulation.major;
  var courses = articulation.courses;

  // Split courses into their respective schools.
  var ia_courses = [];
  var oia_courses = [];
  if (courses)
  {
    for (var i = 0; i < courses.length; ++i)
    {
      ia_courses.push(courses[i].ia_courses);
      oia_courses.push(courses[i].oia_courses);
    }
  }

  add_school(ia)
    .then(function(ia_id)
    {
      return add_school(oia)
        .then(function(oia_id)
        {
          return add_major(ia_id, oia_id, major);
        });
    })
    .then(add_articulation)
    .then(function(articulation_id)
    {
      // Remove extra information from courses (ia_course, and, amp, etc...)
      var ia_courses_only = Scraper.get_individual_courses(ia_courses);
      if (ia_courses_only)
      {
        for (var i = 0; i < ia_courses_only.length; ++i)
        {
          add_course(ia, ia_courses_only[i])
          .then(function(course)
          {
            return add_articulation_course(articulation_id, course);
          });
        }
      }
      var oia_courses_only = Scraper.get_individual_courses(oia_courses);
      if (oia_courses_only)
      {
        for (var j = 0; j < oia_courses_only.length; ++j)
        {
          add_course(oia, oia_courses_only[j])
          .then(function(course)
          {
            return add_articulation_course(articulation_id, course);
          });
        }
      }
    }
  );
}

/**
* Add school to database using sequelize.
*
* School model:
*   id
*   assist_code
*   full_name
*
* school object:
*   assist_code
*   full_name
*/
function add_school(school)
{
  return School
    .findOrCreate({
      where:    { assist_code: school.assist_code },
      defaults: { full_name: school.full_name }
    })
    .spread(function(school, created)
    {
      return school.id;
    });
}

/**
* Add major to database using sequelize.
*
* Major model:
*   id
*   assist_code
*   full_name
*   ia_school_id
*   oia_school_id
*
* major object:
*   assist_code
*   full_name
*/
function add_major(ia_id, oia_id, major)
{
  return Major
    .findOrCreate({
      where:    { assist_code  : major.assist_code,
                  ia_school_id : ia_id,
                  oia_school_id: oia_id
                },
      defaults: { full_name    : major.full_name }
    })
    .spread(function(major, created)
    {
      return major.id;
    });
}

/**
* Add articulation to database using sequelize.
*
* Articulation model:
*   id
*   major_id
*/
function add_articulation(major_id)
{
  return Articulation
    .findOrCreate({
      where:    { major_id: major_id }
    })
    .spread(function(articulation)
    {
      return articulation.id;
    });
}

/**
* Add course to database using sequelize.
*
* Course model:
*   id
*   assist_code
*   full_name
*   units
*
* course object:
*   assist_code
*   full_name
*   units
*
* School model:
*   id
*   assist_code
*   full_name
*
* school object:
*   assist_code
*   full_name
*/
function add_course(school, course)
{
  return School
    .find({
      where: { assist_code: school.assist_code }
    })
    .then(function(school)
    {
      return Course
        .findOrCreate({
          where   : {
            assist_code: course.assist_code,
            school_id  : school.id
          },
          defaults: {
            full_name  : course.full_name,
            units      : course.units,
          }
        })
        .spread(function(course, created)
        {
          return course;
        });
    });
}

/**
* Link articulation and course.
*
* ArticulationCourses model:
*   id
*   articulation_id
*   course_id
*/
function add_articulation_course(articulation_id, course)
{
  return Articulation
    .find({
      where: { id: articulation_id }
    })
    .then(function(articulation)
    {
      return articulation.addCourse(course);
    });
}