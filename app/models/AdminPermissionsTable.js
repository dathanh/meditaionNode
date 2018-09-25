var adminPermissionSchema = mongoose.Schema({
	_id:{ type: Number, default: 1 },
	controller: String,
	action: String,
	role_id: String,
	status: String,
	created_date: Date,
	updated_date: Date,
});


//methods ======================
//generating a hash

//create the model for users and expose it to our app
module.exports = mongoose.model('admin_permissions', adminPermissionSchema);
