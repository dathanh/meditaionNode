var express = require('express');

var app = express();
var multer = require('multer')
var constants = require('constants');
var constant = require('./config/constants');
var createRoutes = require('./config/createRoutes');
var i18n = require("i18n");
const fileUpload = require('express-fileupload');
var port = process.env.PORT || 8042;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var now = new Date();
var expressLayouts = require('express-ejs-layouts');
var menuContent = require('./config/menu');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressLayouts);
app.use(fileUpload({
    createParentPath: true
}));
/***************Mongodb configuratrion********************/
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
//configuration ===============================================================
mongoose.connect(configDB.url, {
    useNewUrlParser: true
}); // connect to our database


require('./config/passport')(passport); // pass passport for configuration
i18n.configure({
    locales: ['en', 'vn'],
    directory: __dirname + '/locales',
    defaultLocale: 'vn',
});
i18n.setLocale('vn');
//set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// app.use(bodyParser()); // get information from html forms
app.use(i18n.init);

//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'ejs'); // set up ejs for templating


//required for passport
//app.use(session({ secret: 'iloveyoudear...' })); // session secret

app.use(session({
    secret: 'I Love India...',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================

// console.log('testtt' + JSON.stringify(createRoutes.getResource()));
app.locals = {
    menuContent: menuContent,
    checkExist: (prop, obj = {}) => {
        return obj.hasOwnProperty(prop);
    }
}
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);


//catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).render('404', {
        title: "Sorry, page not found",
        session: req.session
    });
});

app.use(function(req, res, next) {
    res.status(500).render('404', {
        title: "Sorry, page not found"
    });
});
exports = module.exports = app;
