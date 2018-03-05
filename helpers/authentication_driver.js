var models = require('../models/models.js');
var config = require('../config');
var crypto = require('crypto');
var key = config.password_encryption.key;

var debug = require('debug')('idm:auth_helper');

// MW to see if user is registered
exports.authenticate = function(username, password, callback) {

    debug("--> authenticate")

    // Search the user
    models.user.find({
        attributes: ['id', 'username', 'password', 'enabled', 'email', 'gravatar', 'image', 'admin', 'date_password'],
        where: {
            email: username
        }
    }).then(function(user) {
        if (user) {
            // Verify password and if user is enabled to use the web
            if(user.verifyPassword(password) && user.enabled){
                callback(null, user);
            } else { callback(new Error('invalid')); }   
        } else { callback(new Error('user_not_found')); }
    }).catch(function(error){ callback(error) });
};

exports.verifyPassword = function(password) {
    var encripted = crypto.createHmac('sha1', key).update(password).digest('hex');
    return encripted === this.password;
}