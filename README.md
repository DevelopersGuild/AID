AID: Assist ImproveD
=====================

"AID: Assist ImproveD" (or just AID) is an ambitious attempt at improving the functionality of [ASSIST](http://www.assist.org/). From its site, "ASSIST is an online student-transfer information system that shows how course credits earned at one public California college or university can be applied when transferred to another. ASSIST is the official repository of articulation for California’s public colleges and universities and provides the most accurate and up-to-date information about student transfer in California." Note that AID is not affiliated with ASSIST in any way.

While AID started out as a project with goals only to make a website with a prettier/easier-to-use interface (as opposed to ASSIST's current interface), plans have since been proposed to add more useful functionality that ASSIST currently does not provide. The ultimate goal of this project is to provide a better experience for students, counselors, and anyone who uses ASSIST.

## [AssistScrape](https://github.com/DevelopersGuild/Assistscrape)

One of the biggest obstacles to this project was (and will continue to be) the collection of ASSIST's data for the project's own use. Unfortunately, ASSIST does not provide an API to their data and, on top of that, individual articulations are not always uniform in structure.

This project's answer to that is [AssistScrape](https://github.com/DevelopersGuild/Assistscrape), a separate project being used as a component to fill AID's database.

## [AndroidAssist](https://github.com/DevelopersGuild/AndroidAssist)

With goals to bring a similar experience to the mobile app platform, [AndroidAssist](https://github.com/DevelopersGuild/AndroidAssist) is a project also being developed alongside AID. Where AID is a web app that targets PC users, AndroidAssist aims to bring the same functionality to Android mobile devices.

## For Contributors

AID was designed with a basic MVC pattern on top of the Express framework. The project uses [Sequelize](http://docs.sequelizejs.com/en/latest/) for the models, Express' default view functionality, and JavaScript classes that act as basic controllers.

### Models

In a little more depth, the database this project uses is MySQL and Sequelize provides a high-level ORM to interact with that database. If you're looking for a quick peek at the DB schema, take a look at <db/schema.sql>, which reflects the original schema design before Sequelize was considered. Models and migrations should be designed using Sequelize's syntax; an easier way to get going with this would be to install [sequelize-cli](http://docs.sequelizejs.com/en/latest/docs/migrations/#the-cli) for commands that give access to automatic generation of model skeletons. Migrations can also be generated using sequelize-cli and, in fact, are generated automatically when generating a new model. Consult the Sequelize [API](http://docs.sequelizejs.com/en/latest/api/sequelize/) for more help on designing models and migrations.

### Views

Again, AID uses Express' default view functionality. Call/render views in their respectful controllers (and NOT in a routes file). This separates the logic from the middleware that handles requests.

### Controllers

As for controllers, if one is being designed and uses a specific model, be sure to name the file of that controller the plural of its model's filename (i.e. models/user.js -> controllers/users.js). As of the time of this writing, controllers are currently designed only as basic JavaScript classes with the intention of having RESTful methods. This may change in the future to something that still incorporates REST practices, but is a little more refined.

### Routes

For each RESTful controller, add a route file that matches its controller's filename in the routes directory and specify which method of the controller should be called for each route. The point of keeping the handling of routes separate from the controllers is, again, to separate the controller's logic from the router code to handle requests. Separation results in a much lower possibility of others witnessing twisted, evil, destructive, spaghetti code mashed together or in, put briefly, cleaner code.

Be sure to add top-level routing information in app.js i.e.

```
var users = require('./routes/users');
app.use('/user', users);
```

## License

This project is licensed under the MIT License. See [LICENSE.txt](./LICENSE.txt) for more details.
