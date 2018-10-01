var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var flash = require('connect-flash')
var routes = require('../../config/routes');
var createRoutes = require('../../config/createRoutes');
const path = require('path');
const fs = require('fs');
//joining path of directory
const directoryPath = path.join(__dirname, 'controllers');
exports.loggedIn = function(req, res, next) {
    if (req.session.user) { // req.session.passport._id

        next();

    } else {

        res.redirect('/login');

    }

}

exports.home = function(req, res) {
    // req.flash("success", "request thanh cong");
    // createRoutes.getFilename(
    //     (filename)=>{
    //         console.log(filename);
    //     }
    // );
    // console.log(req.url);
    res.render('index.ejs', {
        title: 'Home page',
        error: req.flash("error"),
        success: req.flash("success"),
        info: req.flash("info"),
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
        req.flash('info', "success first")
        res.redirect('/home');
        req.flash('info', "success yesss")
    } else {
        req.flash('info', "info demo");
        req.flash('success', "success demo");
        req.flash('error', "errors demo");
        res.render('newLogin', {
            info: req.flash('info'),
            success: req.flash('success'),
            error: req.flash('error'),
            layout: false
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
