'use strict';

var mongoose;
var UserModel;

module.exports = function (setup_mongoose) {
    if (setup_mongoose) {
        mongoose = setup_mongoose;
    }
    
    UserModel = mongoose.model('user', new mongoose.Schema({
                    //profileID: String,
                    //fullname: String,
                    //profilePic: String,
                    facebookId: String,
                    status: String,
                    dateAdded: { type: Date, default: Date.now },
                    role: mongoose.Schema.Types.ObjectId
                }), 'user');
}

module.exports.getModel = () => {
    if (!mongoose) {
        throw new Error("Can't use constructor until mongoose is properly initalized");
    }
    
    return UserModel;
}