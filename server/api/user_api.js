//DBref for mongoose and mongodb
//http://stackoverflow.com/questions/41484249/want-to-get-object-of-reference-collection-by-id-in-mongobd-node-js

//new DBRef
//http://stackoverflow.com/questions/15923788/mongodb-construct-dbref-with-string-or-objectid

var mongoose, path, UserModel, RoleModel, PermissionModel;
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
        UserModel = require(path.join( process.cwd(), '/models/model')).getModel('user');
        RoleModel = require(path.join( process.cwd(), '/models/model')).getModel('role');
        PermissionModel = require(path.join( process.cwd(), '/models/model')).getModel('permission');
        //console.log('usermodel', UserModel);
    }
    
    return module.exports;
};

module.exports.getUserByFacebookId = (facebookId) => {
    checkInitialization();
    
   return UserModel.findOne({ facebookId: facebookId }).exec();
        //.findOne({ facebookId: facebookId })
};

module.exports.getAllUsers = () => {
   checkInitialization();
    
   return UserModel.find().exec();
        //.findOne({ facebookId: facebookId })
};

module.exports.getRoles = () => {
    checkInitialization();
    
    return RoleModel.find().exec();
};

module.exports.calculatePermissions = () => {
    checkInitialization();
    
    return RoleModel.findOne()
            .populate('permissions.item')
            .exec()
            .then((docs) => {
                
                return docs;         
                
           });
    
    /*
    
    //save data using manual ref
    var per = new PermissionModel({
          name: 'ADDUSER',
    	  description: 'Can add user?', 
    	  acceptedValues: [true,false],
    	  dateAdded: new Date() 
    });
    
    return per.save()
    .then((doc)=> {
        var role = new RoleModel({
            name : 'MANAGER', 
        	permissions : [{
        		item: doc._id,
        		value: true
        	}], 
        	dateAdded: new Date() 
        });
        
        return role.save()
                .then((doc1) => {
                   return doc1; 
                });
    });
    
    //retrieve saved data
    return RoleModel.findOne()
    .populate('permissions.item')
    .exec();
    
    */
}