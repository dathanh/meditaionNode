var verifyToken = require('./verifyToken');
var constants = require('../../config/constants');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

exports.login = (req, res) => {
    if (req.method == "POST") {
        var authenticationData = {
            Username: req.body.email,
            Password: req.body.password,
        };

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        var poolData = {
            UserPoolId: constants.userpool_id, // Your user pool id here
            ClientId: constants.app_client_id, // Your client id here
        };
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var userData = {
            Username: req.body.email,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                console.log(result);
                req.session.CognitoAccessToken = result.getAccessToken().getJwtToken();
                res.redirect('/admin/admin-users/index')
            },

            onFailure: function(err) {
                error = req.flash('error', err.message);
                res.redirect('/admin/login');

            },

        });
    } else if (req.method == "GET") {

        res.render('newLogin', {
            info: req.flash('info'),
            success: req.flash('success'),
            error: req.flash('error'),
            csrfToken: req.csrfToken(),
            layout: false,
        });
    }

};
exports.checkLogin = (req, res, next) => {
    if (req.session.CognitoAccessToken) {
        next()
    } else {
        error = req.flash('error', 'Login require');
        res.redirect('/admin/login');
    }
}
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
}
