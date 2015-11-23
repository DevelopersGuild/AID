/**
* Helper functions for assist scraper.
*/

var request = require('request');
var cheerio = require('cheerio');
var url     = require('url');

var AssistScraper = {
  get_all_ias           : get_all_ias,
  get_all_oias          : get_all_oias,
  get_all_majors        : get_all_majors,
  get_all_courses       : get_all_courses,
  get_individual_courses: get_individual_courses
};

module.exports = AssistScraper;

function get_all_ias(callback)
{
  var url = 'http://www.assist.org/web-assist/welcome.html';
  request(url, function(error, response, html)
  {
    if (error)
      return callback('Request for all ias failed.');

    var $ = cheerio.load(html);
    var ias = [];

    $('option').each(function(i)
    {

      // Index i === 0 is default value.
      if($(this).parent().attr('name') == 'ia' && i !== 0)
      {
        var ia = $(this).text();

        // Get rid of .html extension.
        var value = $(this).attr('value')
          .slice(0, -5);
        ias.push({ full_name: ia, assist_code: value });
      }
    });
    return callback(null, ias);
  });
}

function get_all_oias(ia, callback)
{
  var url = 'http://www.assist.org/web-assist/'+ia+'.html';

  request(url, function(error, response, html)
  {
    if (error)
      return callback('Request for all oias falled ('+ia+').');

    var $ = cheerio.load(html);
    var oias = [];

    $('option').each(function(i)
    {
      if($(this).parent().attr('id') == 'oia' && i != 188)
      {
        var oia = $(this).text();
        if (oia.indexOf('To:') > -1)
        {
          // Some oias have a 'From' field which modifies the ia property of the URL.
          oia = oia.replace('To:', '').trim();

          // Grab only the oia property of the URL in value.
          var value = $(this).attr('value');
          var url = require("url");
          value = url.parse(value, true).query.oia;
          oias.push({ full_name: oia, assist_code: value});
        }
      }
    });
    return callback(null, oias);
  });
}

function get_all_majors(ia, oia, callback)
{
  var url = 'http://www.assist.org/web-assist/articulationAgreement.do?inst1=none&inst2=none&ia='+ia+'&ay=15-16&oia='+oia+'&dir=1';

  request(url, function(error, response, html)
  {
    if (error)
      return callback('Request for all majors failed ('+ia+','+oia+').');

    var $ = cheerio.load(html);
    var majors = [];
    var majors_not_available = false;

    $('#title').each(function()
    {
      if($(this).text().indexOf("By Major") > -1 &&
        $(this).text().indexOf("Not Available") > -1)
          majors_not_available = true;
    });

    if (majors_not_available)
      return callback('Majors not available for this school ('+ia+','+oia+').');
    
    $('option').each(function()
    {
      if($(this).parent().parent().attr('name') == 'major' &&
        $(this).parent().attr('name') == 'dora' &&
        $(this).attr('value').length > 0 &&
        $(this).attr('value') != '-1')
      {
        var dora = $(this).text();
        var value = $(this).attr('value');
        majors.push({ full_name: dora, assist_code: value });
      }
    });

    for(var i = 0; i < majors.length; i++)
    {
      majors[i].assist_code = majors[i].assist_code.replace('/','*');
    }

    if (majors.length > 0)
      return callback(null, majors);
    else
      return callback('No majors found ('+ia+','+oia+').');
  });
}

function get_all_courses(ia, oia, dora, callback)
{
  // Get the aay value.
  var url = 'http://www.assist.org/web-assist/articulationAgreement.do?inst1=none&inst2=none&ia='+ia+'&ay=15-16&oia='+oia+'&dir=1';
  request(url, function(error, response, html)
  {
    if(error)
      return callback('Request for aay failed ('+ia+','+oia+','+dora+').');

    var aay = get_aay(html);

    // Get the iframe.
    var url2 = 'http://www.assist.org/web-assist/report.do?agreement=aa&reportPath=REPORT_2&reportScript=Rep2.pl&event=19&dir=1&sia='+ia+'&ria='+oia+'&ia='+ia+'&oia='+oia+'&aay='+aay+'&ay=15-16&dora='+dora;
    request(url2, function(error, response, html)
    {
      if(error)
        return callback('Request for iFrame failed ('+ia+','+oia+','+dora+').');

      var url3 = get_iframe(html);

      // The iframe data.
      request(url3, function(error, response, html)
      {
        if(error)
          return callback('Request for iFrame data failed ('+ia+','+oia+','+dora+').');

        var $ = cheerio.load(html);
        var text = $('body').text();

        return callback(null, get_articulations(text));
      });
    });
  });
}

function get_individual_courses(courses)
{
  courses_string = JSON.stringify(courses);

  if (!courses_string)
    return;

  var results = [];
  courses_string = courses_string.match(/\{"assist_code".*?\}/g);

  // Convert to object.
  var re = /\{"assist_code":"(.*?)","full_name":"(.*?)","units":"(.*?)"\}/;
  var code;
  var title;
  var units;
  courses_string.forEach(function(course)
  {
    assist_code  = course.replace(re, '$1');
    full_name    = course.replace(re, '$2');
    units        = course.replace(re, '$3');
    results.push({ assist_code: assist_code, full_name: full_name, units: units });
  });
  return results;
}

////////////////// PRIVATE METHODS //////////////////

// Conjunctions that are found within a course box.
var conjunctions =
{
  and_either : ' AND EITHER ',
  or        : ' OR ',
  and       : ' AND ',
  amp       : ' & '
};

/**~*~*
  Gets the aay value for institutions that have an older articulation agreement.
*~**/
function get_aay(html)
{
  var aay = '15-16';
  var $ = cheerio.load(html);

  $('input').each(function(i, elem)
  {
    if($(this).parent().attr('name') == 'major' &&
      $(this).attr('name') == 'aay')
    {
      aay = $(this).attr('value');
    }
  });

  return aay;
}

/**~*~*
  Gets the iframe that contains the articulation agreement between the two institutions.
*~**/
function get_iframe(html)
{
  var url;
  var $ = cheerio.load(html);

  $('iframe').each(function(i, elem)
  {
    url = $(this).attr('src');
  });

  return url;
}

/**~*~*
  Gets the articulated courses from the two institutions.
*~**/
function get_articulations(text)
{
  text = text.replace(/  +/g, ' ');
  var result = [];
  var from = false;
  var ia_course = '';
  var oia_course = '';
  var courses = [];

  // Splits the text into course boxes.
  courses = text.match(/---[^-]+\|[^-]+---/g);

  if (!courses)
    return;

  // Split each box into from and to.
  courses.forEach(function(course)
  {
    // Remove dashes and extra notes.
    course = course.replace(/---[^-]*?\n(.*\|[^-]+)---/g, '$1').trim();

    for (var i = 0; i < course.length; ++i)
    {
      if (course[i] == '|' || course[i] == '\n')
      {
        oia_course += '\n';
        ia_course += '\n';
        from = !from;
      }
      else if (!from)
        oia_course += course[i];

      else if (from)
        ia_course += course[i];
    }

    if (/\(\d+\.?\d*\)/.test(oia_course) ||
      /\(\d+\.?\d*\)/.test(ia_course) ||
      !is_articulated(oia_course) ||
      !is_articulated(ia_course))
        result.push({ ia_courses: parse_course(ia_course), oia_courses: parse_course(oia_course) });
    oia_course = '';
    ia_course = '';
    from = !from;
  });
  return result;
}

/**~*~*
  Extracts the course information from raw course data.
*~**/
function parse_course(text)
{
  // Splits each course using the units as a marker for the starting line.
  var courses = text.replace(/(^.*\(\d+\.?\d*\).|\n*)(^.*\(\d+\.?\d*\))/mg, '$1|$2')
    .replace(/\s\s+/g, ' ')
    .trim()
    .split('|')
    .filter(function(course)
    {
      return course !== '' && course !== '\n';
    });

  courses.forEach(function(elem, i, arr)
  {
    // Move & to end of line.
    var re = new RegExp('(.*)' + conjunctions.amp + '(.*?\\\(\\\d+\.?\\\d*\\\).*)');
    arr[i] = elem.replace(re, '$1 $2' + conjunctions.amp);
  });

  return conjunction_split(courses);
}

/**~*~*
  Splits the courses into individual courses connected by conjunctions.
*~**/
function conjunction_split(array)
{
  var result = [];
  var line = array.join(' ');

  if (line.indexOf(conjunctions.and_either) > -1)
  {
    // More complicated...
  }
  else if (line.indexOf(conjunctions.and) > -1)
    result.push({ and: get_and_splitted(line) });

  else if (line.indexOf(conjunctions.or) > -1)
    result.push({ or: get_or_splitted(line) });

  else if (line.indexOf(conjunctions.amp) > -1)
    result.push({ amp: get_amp_splitted(line) });

  else
    result.push(parse_course_data(line));

  return result;
}

function get_and_splitted(line)
{
  var result = [];
  var and_splitted = line.split(conjunctions.and);

  and_splitted.forEach(function(elem)
  {
    if (elem.indexOf(conjunctions.or) > -1)
      result.push({ or: get_or_splitted(elem) });

    else if (elem.indexOf(conjunctions.amp) > -1)
      result.push({ amp: get_amp_splitted(elem) });

    else
      result.push(parse_course_data(elem));
  });
  return result;
}

function get_or_splitted(line)
{
  var result = [];
  var or_splitted = line.split(conjunctions.or);

  or_splitted.forEach(function(elem)
  {
    if (elem.indexOf(conjunctions.amp) > -1)
      result.push({ amp: get_amp_splitted(elem) });

    else
      result.push(parse_course_data(elem));

  });
  return result;
}

function get_amp_splitted(line)
{
  var result = [];
  var amp_splitted = line.split(conjunctions.amp);
  var course;
  amp_splitted.forEach(function(elem)
  {
    result.push(parse_course_data(elem));
  });
  return result;
}

function parse_course_data(line)
{
  // If course not articulated, result is empty.
  if (!is_articulated(line))
    return;

  var units = line.match(/\(\d+\.?\d*\)/);
  var code = line.replace(/(^.+?[0-9]+.*?)\s.+/, '$1');
  var title;
  if (units)
  {
    units = units[0];

    title = line.replace(units, '')
      .replace(code, '')
      .replace(/\s\s+/g, ' ')
      .trim();
    units = units.slice(1, -1).trim();
    code = code.replace(/\s\s+/g, ' ').trim();

    return { assist_code: code, full_name: title, units: units };
  }
  return;
}

function is_articulated(line)
{
  var not_articulated  =
  [
    'no course articulated',
    'no articulation',
    'not articulated',
    'no comparable lab',
    'no comparable courses',
    'this course is never articulated'
  ];

  for (var i = 0; i < not_articulated.length; ++i)
  {
    if (line.toLowerCase().indexOf(not_articulated[i]) > -1)
      return false;
  }
  return true;
}
