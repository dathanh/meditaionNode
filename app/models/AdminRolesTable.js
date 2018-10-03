var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var adminRolesSchema = mongoose.Schema({
	_id:{ type: Number, default: 1 },
	name: String,
	description: String,
	status: String,
	created_date: Date,
	updated_date: Date,
	active_hash: String,
});


//methods ======================
//generating a hash

//create the model for users and expose it to our app
module.exports = mongoose.model('admin_roles', adminRolesSchema);
