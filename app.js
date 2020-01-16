const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = new express();
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const dashboardRouter = require('./routes/dashboard')

const {getHomePage} = require('./routes/index');
const {getStartPage} = require('./routes/start');
const {getStudent} = require('./routes/student');

const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage, updateStudent} = require('./routes/player');
const port = 2000;
require('dotenv').config({ path: '.env.local' });


// session support is required to use ExpressOIDC
app.use(session({
  secret: process.env.CLIENT_SECRET_ADMIN,
  resave: true,
  saveUninitialized: false
}));
const oidc = new ExpressOIDC({
  issuer: `https://dev-149346.okta.com/oauth2/default`,
  client_id: process.env.CLIENT_ID_ADMIN,
  client_secret: process.env.CLIENT_SECRET_ADMIN,
  redirect_uri: 'http://localhost:8080/authorization-code/callback',
  scope: 'openid profile',
  appBaseUrl: 'http://localhost:8080'
});
// const oidc_student = new ExpressOIDC({
//   issuer: `https://dev-149346.okta.com/oauth2/default`,
//   client_id: process.env.CLIENT_ID,
//   client_secret: process.env.CLIENT_SECRET,
//   redirect_uri: 'http://localhost:3000/authorization-code/callback',
//   scope: 'openid profile',
//   appBaseUrl: 'http://localhost:3000'

// })

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: "OOMPHproctors.db.5391918.389.hostedresource.net",
  user: "OOMPHproctors",
  password: process.env.MYSQL_PW,
  database: "OOMPHproctors",
});
// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);
//app.use(oidc_student.router);

// routes for the app

// app.get('/', (req, res) => {
//   if (req.userContext) {
//     res.render('start.ejs', {
//       title: "Admin Access"
//       ,message: ''
//     });
//   } else {
//     res.send('Please <a href="/login">login</a>');
//   }
// });
//app.all('*', oidc.ensureAuthenticated());
app.get('/', getStartPage);
// app.get('/student', getStudent);
// app.get('/student', oidc_student.ensureAuthenticated(), (req, res) => {
//   // res.send(JSON.stringify(req.userContext.userinfo));
//    res.render('student.ejs', {
//      title: "Student Portal"
//      ,message: ''
//    });
//  });
//app.get('/', getHomePage);
//app.get('/admin', getAdminPage);
app.get('/index', oidc.ensureAuthenticated(),  (req, res) => {
  if (req.userContext.userinfo.preferred_username ==='drewradley@gmail.com')
  {
    console.log("is admin")
    let query = "SELECT * FROM `Proctors` ORDER BY id ASC"; // query database to get all the players
    // execute query
    db.query(query, (err, result) => {
      console.log(result);
        if (err) {
            res.redirect('/');
        }
        res.render('index.ejs', {
          title: `Admin ${req.userContext.userinfo.preferred_username}!`
            ,proctors: result
        });
    }); 
  } else {
      let studentEmail = req.userContext.userinfo.preferred_username;
      let query = "SELECT * FROM `Proctors` WHERE studentEmail = '" + studentEmail + "' ";
      db.query(query, (err, result) => {
        console.log('student');
        console.log(result);
        if (err) {
            res.redirect('/');
        }
        res.render('student.ejs', {
          title: `Student: ${req.userContext.userinfo.preferred_username}!`
          ,proctor: result[0]
          }); 
        });
    
      
    //res.redirect('/');
  }

  //  res.render('index.ejs', {
  //    title: "Admin Access"
  //    ,message: JSON.stringify(req.userContext.userinfo)
  //  });
 });
app.get('/add', oidc.ensureAuthenticated(), (req, res) => {
 // res.send(JSON.stringify(req.userContext.userinfo));
  res.render('add-player.ejs', {
    title: "Add a new student/proctors"
    ,message: ''
  });
});
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addPlayer);
app.post('/edit/:id', editPlayer);
// app.post('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
app.get('/index/:id', updateStudent);
app.post('/index', updateStudent);


// });
app.post('/logout', (req, res, next) => {
  //oidc.forceLogoutAndRevoke();
  req.logout();
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});
app.get('/local-logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
// app.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');


// });
// app.post('/forces-logout', oidc.forceLogoutAndRevoke(), (req, res) => {
//   // Nothing here will execute, after the redirects the user will end up wherever the `routes.logoutCallback.afterCallback` specifies (default `/`)
// });

oidc.on('ready', () => {
  app.listen(8080, () => console.log(`Started 8080!`));
});

oidc.on('error', err => {
  console.log('Unable to configure ExpressOIDC', err);
});
// oidc_student.on('ready', () => {
//   app.listen(3000, () => console.log(`Started 3000!`));
// });

// oidc_student.on('error', err => {
//   console.log('Unable to configure ExpressOIDC', err);
// });
// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});