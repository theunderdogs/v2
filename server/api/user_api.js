var mongoose, path, UserModel;
var checkInitialization = () => {
    if (!mongoose && !path) {
        throw new Error("Can't use constructor until mongoose and path are properly initalized");
    }
};

module.exports = (setup_mongoose, setup_path) => {
    if (setup_mongoose) {
        mongoose = setup_mongoose;
    }
    
    if (setup_path) {
        path = setup_path;
        UserModel = require(path.join( process.cwd(), '/models/user')).getModel();
        //console.log('usermodel', UserModel);
    }
    
    return module.exports;
};

module.exports.getUserByFacebookId = (facebookId) => {
    checkInitialization();
    
   return UserModel.findOne({ facebookId: facebookId }).exec();
        //.findOne({ facebookId: facebookId })
};