const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('./passport');
const MongoDB = require('./database/');
const mongoose = require('mongoose');
const app = express();

const PORT = 8080;

const user = require('./routes/user');

app.use(morgan('dev'));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.use(
  session({
    secret: 'shiggity-swiggity',
    cookie: { expires: new Date(Date.now() + 30 * 86400 * 1000) },
    store: new MongoStore({ mongooseConnection: MongoDB }),
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use('/user', user);

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
