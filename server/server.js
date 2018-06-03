const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('./passport');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();

const PORT = 8080;

const user = require('./routes/user');
const file_storage = require('./routes/file_storage');


app.use(morgan('dev'));
app.use(methodOverride('_method'));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.use(
  session({
    secret: 'shiggity-swiggity',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use('/file', file_storage);
app.use('/user', user);

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
