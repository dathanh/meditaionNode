var home = require('../app/controllers/home');
var AdminUsers = require('../app/controllers/AdminUsers');
var createRoutes = require('./createRoutes');
var csrf = require('csurf');
var listRoutes = require('./listRoutes');
//you can include all your controllers
var csrfProtection = csrf({
    cookie: true
});
module.exports = function(app, passport) {

    app.get('/login', home.login);
    app.get('/signup', home.signup);

    app.get('/', home.loggedIn, home.home); //home
    app.get('/home', home.loggedIn, home.home); //home
    app.get('/logout', home.logout);
    // app.get('/admin-users', AdminUsers.index);
    // app.get('/admin-users/index', AdminUsers.index);

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    createRoutes.setResource(listRoutes.Controller);
    createRoutes.setRoutes();
    app.locals.routesLink = createRoutes.getResource();
    app.use('/', csrfProtection, createRoutes.getRouter());
    createRoutes.setResource(listRoutes.Api);
    createRoutes.setRoutes('Api');
    console.log(createRoutes.getResource());
    app.use('/api/', createRoutes.getRouter());

}
