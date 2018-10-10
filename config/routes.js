var AdminUsers = require('../app/controllers/AdminUsers');
var Cognito = require('../app/controllers/Cognito');
var AdminUsersApi = require('../app/api/AdminUsers');
var createRoutes = require('./createRoutes');
var csrf = require('csurf');
const paginate = require('express-paginate');
var listRoutes = require('./listRoutes');
//you can include all your controllers
var csrfProtection = csrf({
    cookie: true
});
const permission = require('./permissions2');

module.exports = function(app, passport) {
    app.use(paginate.middleware(5, 50));

    // app.get('/admin/login', csrfProtection, AdminUsers.login);
    app.get('/admin/login', csrfProtection, Cognito.login);
    // app.get('/admin/logout', AdminUsers.logout);
    app.get('/admin/logout', Cognito.logout);

    // app.post('/admin/login', passport.authenticate('local-login', {
    //     successRedirect: '/admin-users/index', // redirect to the secure profile section
    //     failureRedirect: '/admin/login', // redirect back to the signup page if there is an error
    //     failureFlash: true // allow flash messages
    // }));
    app.post('/admin/login', Cognito.login);
    createRoutes.setResource(listRoutes.Api);
    createRoutes.setRoutes('api');
    console.log(createRoutes.getResource());
    app.post('/api/admin-users/login', AdminUsersApi.login);
    app.use('/api/', AdminUsersApi.checkLogin, createRoutes.getRouter());
    createRoutes.setResource(listRoutes.Controller);
    createRoutes.setRoutes();
    app.locals.routesLink = createRoutes.getResource();
    console.log(createRoutes.getResource());
    // app.use('/', permission.login, permission.checkPermissions(), csrfProtection, createRoutes.getRouter());
    // app.use('/', Cognito.checkLogin, csrfProtection, createRoutes.getRouter());
    app.use('/', csrfProtection, createRoutes.getRouter());

}
