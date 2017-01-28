'use strict';

var mongoose;
var UserModel,
    RoleModel,
    PermissionModel;

module.exports = function (setup_mongoose) {
    if (setup_mongoose) {
        mongoose = setup_mongoose;
    }
    
    /* user */
    
    var userSchema = new mongoose.Schema({
        //profileID: String,
        //fullname: String,
        //profilePic: String,
        facebookId: { 
            type: String,
            required: [true, 'facebookId is not set']
        },
        isAdmin: {
            type: Boolean,
            required: [true, 'isAdmin is not set']
        },
        enable: {
            type: Boolean,
            required: [true, 'status is not set']
        },
        dateAdded: { type: Date, default: Date.now },
        role: {
            type: mongoose.Schema.ObjectId//,
            //required: [true, 'role is not set']
        }
    });
    
    userSchema.index({ facebookId: 1/*, isAdmin: -1*/ }, { unique: true }); // schema level
    
    userSchema.virtual('getDetails').get(function () {
      return this.facebookId + ' ' + this.status;
    });
    
    UserModel = mongoose.model('user', userSchema);
    
    /* role */
    
    var roleSchema = new mongoose.Schema({
        name: String,
        permissions: [ 
            { item: { 
                    type: mongoose.Schema.ObjectId , 
                    ref: 'permission' 
                }, 
              value: mongoose.Schema.Types.Mixed 
            } ],
        enable: Boolean,
        dateAdded: { type: Date, default: Date.now },
    });
    
    roleSchema.index({ name: 1/*, isAdmin: -1*/ }, { unique: true }); // schema level
    
    RoleModel = mongoose.model('role', roleSchema);
    
    /* permission */
    
    var permissionSchema = new mongoose.Schema({
        name: String,
        description: String,
        acceptedValues: [mongoose.Schema.Types.Mixed],
        dateAdded: { type: Date, default: Date.now },
    });
    
    permissionSchema.index({ name: 1/*, isAdmin: -1*/ }, { unique: true }); // schema level
    
    PermissionModel = mongoose.model('permission', permissionSchema);
    /*
    //populate master data
    return new PermissionModel({
          name: 'ADDUSER',
    	  description: 'Can add user?', 
    	  acceptedValues: [true,false]
    })
    .save()
    .then((doc)=> {
        var role = new RoleModel({
            name : 'MANAGER', 
        	permissions : [{
        		item: doc._id,
        		value: true
        	}],
        	enable: true
        });
        
        return role.save();
    })
    .then((role) => {
        return UserModel.insertMany([{ 
        	facebookId : '10158081909300057', 
        	isAdmin: true,
        	enable: true
        },{ 
        	facebookId : '5555', 
        	isAdmin: false,
        	role: role._id,
        	enable: true 
        }])
    })
    .then((users) => {
       // console.log(users)        
    })
    .catch((error) => {
        console.log('oh boy: ' + error);
    });
    */
}

module.exports.getModel = (name) => {
    if (!mongoose) {
        throw new Error("Can't use constructor until mongoose is properly initalized");
    }
    
    switch (name) {
      case 'user':
        return UserModel;
        //break;
      case 'role':
        return RoleModel;
        //break;
      case 'permission':
        return PermissionModel;
        //break;
      default:
        console.log('Model not found');
        break;
    }
    
    //return UserModel;
}