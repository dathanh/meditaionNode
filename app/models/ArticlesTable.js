var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var articlesSchema = mongoose.Schema({
    _id: {
        type: Number,
        default: 1
    },
    name: String,
    title: String,
    description: String,
    thumbnail: String,
    status: String,
    created_date: Date,
    updated_date: Date,
});

module.exports = mongoose.model('articles', articlesSchema);
