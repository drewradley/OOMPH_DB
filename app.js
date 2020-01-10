const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const {getHomePage} = require('./routes/index');
const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');
const port = 2000;
require('dotenv').config({ path: '.env.local' });


// session support is required to use ExpressOIDC
app.use(session({
  secret: '0KhuemEvzugCkVn0m7SbiWBh3luBRHslqf3-dJjd',
  resave: true,
  saveUninitialized: false
}));
const oidc = new ExpressOIDC({
  issuer: `https://dev-149346.okta.com/oauth2/default`,
  client_id: '0oa2gck6y8yBJXu1w357',
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: 'http://localhost:3000/authorization-code/callback',
  scope: 'openid profile'
});
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

// routes for the app

app.get('/', getHomePage);
//app.get('/add', oidc.ensureAuthenticated(), addPlayerPage);
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


oidc.on('ready', () => {
  app.listen(3000, () => console.log(`Started!`));
});

oidc.on('error', err => {
  console.log('Unable to configure ExpressOIDC', err);
});
// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});