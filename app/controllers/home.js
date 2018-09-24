var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var routes = require('../../config/routes');

exports.loggedIn = function(req, res, next) {
    if (req.session.user) { // req.session.passport._id

        next();

    } else {

        res.redirect('/login');

    }

}

exports.home = function(req, res) {
    req.flash("success", "request thanh cong");
    console.log("controller :"+req.params.controller);
    res.render('index.ejs', {
        title: 'Home page',
        error: req.flash("error"),
        success: req.flash("success"),
        session: req.session,
        routes: routes,

    });

}


exports.signup = function(req, res) {

    if (req.session.user) {

        res.redirect('/home');

    } else {

        res.render('signup', {
            error: req.flash("error"),
            success: req.flash("success"),
            session: req.session
        });
    }

}


exports.login = function(req, res) {



    if (req.session.user) {

        res.redirect('/home');

    } else {

        res.render('newLogin', {
            error: req.flash("error rwutgi4rutyi"),
            success: req.flash("success ewrgweygruwygruwgeu"),
            session: req.session,
            layout: false,
            // params: req.params(),
        });

    }

}

exports.logout = (req, res) => {
    console.log('da log out');
    req.logout();
    req.session.destroy();
    res.redirect('/login');
}
