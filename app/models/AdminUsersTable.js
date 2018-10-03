var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var adminUsersSchema = mongoose.Schema({
    _id: {
        type: Number,
        default: 1
    },
    name: String,
    email: String,
    password: String,
    status: String,
    lock: String,
    created_date: Date,
    updated_date: Date,
    active_hash: String,
    role_id: {
        type: Number,
        default: 2
    }
});


//methods ======================
//generating a hash
adminUsersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
adminUsersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};



//create the model for users and expose it to our app
module.exports = mongoose.model('admin_users', adminUsersSchema);
