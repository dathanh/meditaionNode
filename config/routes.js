
var AdminUsers = require('../app/controllers/AdminUsers');
var createRoutes = require('./createRoutes');
var csrf = require('csurf');
const paginate = require('express-paginate');
var listRoutes = require('./listRoutes');
//you can include all your controllers
var csrfProtection = csrf({
    cookie: true
});


module.exports = function(app, passport) {
    app.use(paginate.middleware(5, 50));

    app.get('/admin/login', csrfProtection, AdminUsers.login);
    app.get('/admin/logout', AdminUsers.logout);

    app.post('/admin/login', passport.authenticate('local-login', {
        successRedirect: '/admin-users/index', // redirect to the secure profile section
        failureRedirect: '/admin/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    createRoutes.setResource(listRoutes.Api);
    createRoutes.setRoutes('api');
    console.log(createRoutes.getResource());
    app.use('/api/', createRoutes.getRouter());
    createRoutes.setResource(listRoutes.Controller);
    createRoutes.setRoutes();
    app.locals.routesLink = createRoutes.getResource();
    console.log(createRoutes.getResource());
    app.use('/', (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/admin/login');
        }
    }, csrfProtection, createRoutes.getRouter());


}
