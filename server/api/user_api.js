//DBref for mongoose and mongodb
//http://stackoverflow.com/questions/41484249/want-to-get-object-of-reference-collection-by-id-in-mongobd-node-js

//new DBRef
//http://stackoverflow.com/questions/15923788/mongodb-construct-dbref-with-string-or-objectid

var mongoose, path, UserModel, RoleModel, PermissionModel, EmailListModel;
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
        EmailListModel = require(path.join( process.cwd(), '/models/model')).getModel('emailList');
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

module.exports.getPermissionsByRoleId = (roleId) => {
    checkInitialization();
    
    return RoleModel.findOne({ _id: roleId})
            .populate('permissions.item').exec();
};

module.exports.getPermissions = () => {
    checkInitialization();
    
    return PermissionModel.find().exec();
};

module.exports.saveRole = (role) => {
    checkInitialization();
    
    if(role._id){
      //update
      return RoleModel
            .findById(role._id)
            .then((r) => {
                r.name = role.name;
                r.enable = role.enable;
                r.permissions = role.permissions;
                
                return r.save();
            })
      
    } else {
      //save
      return RoleModel.create(role);
    }
};

module.exports.getUsers = () => {
    checkInitialization();
    
    return UserModel
            .find()
            .populate('role', 'name')
            .exec();
};

module.exports.saveUser = (user) => {
    checkInitialization();
    
    if(user._id){
      //update
      return UserModel
            .findById(user._id)
            .then((u) => {
                u.facebookId = user.facebookId;
                u.isAdmin = user.isAdmin;
                u.enable = user.enable;
                
                if(user.hasOwnProperty('role'))
                    u.role = user.role;
                
                return u.save();
            })
      
    } else {
      //save
      return UserModel.create(user);
    }
};

module.exports.getEmailLists = () => {
    checkInitialization();
    
    return EmailListModel
            .find()
            .populate('createdBy', 'realName')
            .exec();
};

module.exports.getEmailListById = (id) => {
    checkInitialization();
    
    return EmailListModel
            .findOne({ _id: id })
            .populate('createdBy')
            .exec();
};

module.exports.saveEmailList = (emailList) => {
    checkInitialization();
    
    if(emailList._id){
      //update
      return EmailListModel
            .findById(emailList._id)
            .then((e) => {
                e.name = emailList.name;
                e.list = emailList.list;
                
                return e.save();
            })
      
    } else {
      //save
      return EmailListModel.create(emailList);
    }
};