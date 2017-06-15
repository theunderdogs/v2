'use strict';

var mongoose,
    UserModel,
    RoleModel,
    PermissionModel,
    EmailListModel,
    AboutModel,
    ActiveAboutModel,
    ContactTemplateModel,
    ActiveContactTemplateModel,
    FAQModel,
    FAQOrderModel;

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
            required: [true, 'created user is not set']
        },
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: [true, 'updated user is not set']
        },
        dateUpdated: { type: Date, default: Date.now },
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
    
    /* Contact template Model */
    
    let contactTemplateSchema = new mongoose.Schema({
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
            required: [true, 'created user is not set']
        },
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: [true, 'updated user is not set']
        },
        dateUpdated: { type: Date, default: Date.now },
        dateAdded: { type: Date, default: Date.now }
    });
    
    contactTemplateSchema.index({ name: 1 }, { unique: true }); // schema level
    
    ContactTemplateModel = mongoose.model('contactTemplate', contactTemplateSchema);
    
    /* Active Contact template Model */
    let activeContactTemplateSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Name of template is not set']
        },
        templateId: {
            type: mongoose.Schema.ObjectId,
            ref: 'contactTemplate',
            required: [true, 'Template id is not set']
        }
    });
    
    activeContactTemplateSchema.index({ name: 1 }, { unique: true }); // schema level
    
    ActiveContactTemplateModel = mongoose.model('activeContactTemplate', activeContactTemplateSchema);
    
    /* faq Model */
    
    let faqSchema = new mongoose.Schema({
        question: {
            type: String,
            required: [true, 'Question is required']
        },
        answer: {
            type: String,
            required: [true, 'Answer is required']
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: [true, 'created user is not set']
        },
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: [true, 'updated user is not set']
        },
        dateUpdated: { type: Date, default: Date.now },
        dateAdded: { type: Date, default: Date.now }
    });
    
    faqSchema.index({ question: 1 }, { unique: true }); // schema level
    
    FAQModel = mongoose.model('faq', faqSchema);
    
    /* faq order Model */
    let faqOrderSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Page name is not set']
        },
        questionOrder: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'faqSchema',
                required: [true, 'faq order is not set']
            }
        ]
    });
    
    faqOrderSchema.index({ name: 1 }, { unique: true }); // schema level
    
    FAQOrderModel = mongoose.model('faqOrder', faqOrderSchema);
    
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
            }),
            new PermissionModel({
                  name: 'CANCREATEROLE',
            	  description: 'Can user create new roles?', 
            	  acceptedValues: ['yes','no']
            }),
            new PermissionModel({
                  name: 'CANEDITROLE',
            	  description: 'Can user create new roles?', 
            	  acceptedValues: ['yes','no']
            }),
            new PermissionModel({
                  name: 'CANEDITUSER',
            	  description: 'Can user edit information about other users?', 
            	  acceptedValues: ['yes','no']
            }),
            new PermissionModel({
                  name: 'CANCREATEEMAILLIST',
            	  description: 'Can user create email list?', 
            	  acceptedValues: ['yes','no']
            }),
            new PermissionModel({
                  name: 'CANEDITABOUTUS',
            	  description: 'Can user edit \'About Us\' page?', 
            	  acceptedValues: ['yes','no']
            }), new PermissionModel({
                  name: 'CANEDITCONTACTINFO',
            	  description: 'Can user edit \'Contact Us\' widget on main page?', 
            	  acceptedValues: ['yes','no']
            }), new PermissionModel({
                  name: 'CANADDFAQ',
            	  description: 'Can user add question to \'FAQ\' page?', 
            	  acceptedValues: ['yes', 'no']
            }), new PermissionModel({
                  name: 'CANDELETEFAQ',
            	  description: 'Can user delete question on \'FAQ\' page?', 
            	  acceptedValues: ['yes', 'no']
            }), new PermissionModel({
                  name: 'CANEDITFAQ',
            	  description: 'Can user edit question on \'FAQ\' page?', 
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
      case 'contactTemplate':
        return ContactTemplateModel;
      case 'activeContactTemplate':
        return ActiveContactTemplateModel;
      case 'faq':
        return FAQModel;
      case 'faqOrder':
        return FAQOrderModel;
      default:
        console.log('Model not found');
        break;
    }
    
    //return UserModel;
}