/**
* This controller should only be used to populate the database with data
* from Assist.org. DO NOT ALLOW USERS TO ROUTE HERE.
*/

var Scraper = require('../services/assist_scraper');
var Db      = require('../services/db_helper');

var AssistScrapeController = {
  name: 'AssistScrapeController',
  init_db: init_db
};

module.exports = AssistScrapeController;

function init_db(req, res, next)
{
  Scraper.get_all_ias(function(err, ias){
    if (err)
      return console.warn(err);

    repeat_oias(0, ias);
    res.send('Populating database...');
  });
}

function repeat_oias(i, ias)
{
  if (i < ias.length)
  {
    Scraper.get_all_oias(ias[i].assist_code, function(err, oias)
    {
      if (err)
        return console.warn(err);

      repeat_majors(i, 0, ias, oias);
      repeat_oias(i+1, ias);
    });
  }
}
    
function repeat_majors(i, j, ias, oias)
{
  if (j < oias.length)
  {
    Scraper.get_all_majors(ias[i].assist_code, oias[j].assist_code, function(err, majors)
    {
      if (err)
        return console.warn(err);

      repeat_courses(i, j, 0, ias, oias, majors);
      repeat_majors(i, j+1, ias, oias);
    });
  }
}

function repeat_courses(i, j, k, ias, oias, majors)
{
  if (k < majors.length)
  {
    console.log(ias[i].assist_code+'/'+oias[j].assist_code+'/'+majors[k].assist_code+' - '+i+'/'+(ias.length-1)+' - '+j+'/'+(oias.length-1)+' - '+k+'/'+(majors.length-1));
    Scraper.get_all_courses(ias[i].assist_code, oias[j].assist_code, majors[k].assist_code, function(err, courses)
    {
      if (err)
        return console.warn(err);

      var articulation = {
        ia: ias[i],
        oia: oias[j],
        major: majors[k],
        courses: courses
      };
      Db.add_articulation(articulation);

      repeat_courses(i, j, k+1, ias, oias, majors);
    });
  }
}
