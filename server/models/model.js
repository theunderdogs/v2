'use strict';

var mongoose,
    UserModel,
    RoleModel,
    PermissionModel,
    EmailListModel,
    AboutModel,
    ActiveAboutModel;

module.exports = function (setup_mongoose) {
    if (setup_mongoose) {
        mongoose = setup_mongoose;
    }
    
    /* user */
    
    let userSchema = new mongoose.Schema({
        //profileID: String,
        //fullname: String,
        //profilePic: String,
        facebookId: { 
            type: String,
            required: [true, 'facebookId is not set']
        }, 
        realName: { 
            type: String,
            required: [true, 'realName is not set']
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
            type: mongoose.Schema.ObjectId,
            ref: 'role'//,
            //required: [true, 'role is not set']
        }
    });
    
    userSchema.index({ facebookId: 1/*, isAdmin: -1*/ }, { unique: true }); // schema level
    
    userSchema.virtual('getDetails').get(function () {
      return this.facebookId + ' ' + this.status;
    });
    
    UserModel = mongoose.model('user', userSchema);
    
    /* role */
    
    let roleSchema = new mongoose.Schema({
        name: { 
            type: String,
            required: [true, 'Role name is not set']
        },
        permissions: [ 
            { item: { 
                    type: mongoose.Schema.ObjectId , 
                    ref: 'permission' 
                }, 
              value: mongoose.Schema.Types.Mixed 
            } ],
        enable: { 
            type: Boolean,
            required: [true, 'status for role is not set']
        },
        dateAdded: { type: Date, default: Date.now },
    });
    
    roleSchema.index({ name: 1/*, isAdmin: -1*/ }, { unique: true }); // schema level
    
    RoleModel = mongoose.model('role', roleSchema);
    
    /* permission */
    
    let permissionSchema = new mongoose.Schema({
        name: { 
            type: String,
            required: [true, 'Name for permission is not set']
        },
        description: { 
            type: String,
            required: [true, 'Description for permission is not set']
        },
        acceptedValues: { 
            type: [mongoose.Schema.Types.Mixed],
            required: [true, 'Accepted values is not set']
        },
        dateAdded: { type: Date, default: Date.now },
    });
    
    permissionSchema.index({ name: 1/*, isAdmin: -1*/ }, { unique: true }); // schema level
    
    PermissionModel = mongoose.model('permission', permissionSchema);
    
    /* email list */
    
    let emailListSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Name for email list is not set']
        },
        list: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: [true, 'user is not set']
        },
        dateAdded: { type: Date, default: Date.now }
    });
    
    emailListSchema.index({ name: 1 }, { unique: true }); // schema level
    
    EmailListModel = mongoose.model('emailList', emailListSchema);
    
    /* About Us Model */
    
    let aboutSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Name for this version is required']
        },
        content: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: [true, 'user is not set']
        },
        // active: { 
        //     type: Boolean,
        //     default: false,
        //     required: [true, 'status for role is not set']
        // },
        dateAdded: { type: Date, default: Date.now }
    });
    
    aboutSchema.index({ name: 1 }, { unique: true }); // schema level
    
    AboutModel = mongoose.model('about', aboutSchema);
    
    /* Active About Us Model */
    let activeAboutSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Name of page is not set']
        },
        aboutId: {
            type: mongoose.Schema.ObjectId,
            ref: 'about',
            required: [true, 'about is not set']
        }
    });
    
    activeAboutSchema.index({ name: 1 }, { unique: true }); // schema level
    
    ActiveAboutModel = mongoose.model('activeAbout', activeAboutSchema);
    
    /*
    //populate master data
    return PermissionModel.insertMany([
            new PermissionModel({
                  name: 'ADDUSER',
            	  description: 'Is the user allowed to add another user?', 
            	  acceptedValues: ['yes','no']
            }), new PermissionModel({
                  name: 'ADDPET',
            	  description: 'Is the user allowed to add pet?', 
            	  acceptedValues: ['yes','no']
            }), new PermissionModel({
                  name: 'CANEMAIL',
            	  description: 'Can user mass email using email list?', 
            	  acceptedValues: ['yes', 'no']
            }), new PermissionModel({
                  name: 'CANEDITEMAILLIST',
            	  description: 'Can user edit email list?', 
            	  acceptedValues: ['yes', 'no']
            })
        ]) 
    .then((docs)=> {
        //console.log(docs);
        let id;
        docs.forEach((doc) => {
            if(doc.name == 'ADDUSER') {
                id = doc._id;
            }
        });
        
        var role = new RoleModel({
            name : 'MANAGER', 
        	permissions : [{
        		item: id,
        		value: 'yes'
        	}],
        	enable: true
        });
        
        return role.save()
        .then(() => {
            return role;
        });
    })
    .then((role) => {
        //console.log('role', role);
        return UserModel.insertMany([{ 
            realName : 'Kiran Deore', 
        	facebookId : '10158081909300057', 
        	isAdmin: true,
        	enable: true
        },{ 
            realName : 'Meike Parker', 
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
      case 'role':
        return RoleModel;
      case 'permission':
        return PermissionModel;
      case 'emailList':
        return EmailListModel;
      case 'about':
        return AboutModel;
      case 'activeAbout':
        return ActiveAboutModel;
      default:
        console.log('Model not found');
        break;
    }
    
    //return UserModel;
}