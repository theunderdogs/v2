'use strict';

var user = {
    profileID: String,
    fullname: String,
    profilePic: String
};

module.exports = function (mongoose) {
    return mongoose.model('user', new mongoose.Schema(user));
}