//DBref for mongoose and mongodb
//http://stackoverflow.com/questions/41484249/want-to-get-object-of-reference-collection-by-id-in-mongobd-node-js

//new DBRef
//http://stackoverflow.com/questions/15923788/mongodb-construct-dbref-with-string-or-objectid

var mongoose, 
path, 
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
        AboutModel = require(path.join( process.cwd(), '/models/model')).getModel('about');
        ActiveAboutModel = require(path.join( process.cwd(), '/models/model')).getModel('activeAbout');
        ContactTemplateModel = require(path.join( process.cwd(), '/models/model')).getModel('contactTemplate');
        ActiveContactTemplateModel = require(path.join( process.cwd(), '/models/model')).getModel('activeContactTemplate');
        FAQModel = require(path.join( process.cwd(), '/models/model')).getModel('faq');
        FAQOrderModel = require(path.join( process.cwd(), '/models/model')).getModel('faqOrder');
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

module.exports.getAbouts = () => {
    checkInitialization();
    
    return AboutModel
            .find()
            .populate('createdBy')
            .populate('updatedBy')
            .exec();
};

module.exports.getAboutById = (id) => {
    checkInitialization();
    
    return AboutModel
            .findOne({ _id: id })
            //.populate('createdBy')
            .exec();
};

module.exports.saveAboutus = (about) => {
    checkInitialization();
    
    var p;
    
    if(about._id){
     //update    
      p = AboutModel.findByIdAndUpdate(
          about._id,
          {$set: {
                name: about.name,
                content: about.content,
                updatedBy: about.updatedBy,
                dateUpdated: Date.Now
            }
          },
          {new: true});
    } else {
      //save
      p = AboutModel.create({
          name: about.name,
          content: about.content,
          createdBy: about.createdBy,
          updatedBy: about.updatedBy
      });
    }
    
    return Promise.all([p, module.exports.getActiveAboutById() ])
            .then((results) => {
                var _about = results[0], activeAbout = results[1];
                
                if(activeAbout && _about._id.equals(activeAbout.aboutId) && !about.active){
                    //delete the table
                    return ActiveAboutModel.remove({ name: 'AboutUsPage' });
                } else if(about.active) {
                  return ActiveAboutModel.findOneAndUpdate({
                            name: 'AboutUsPage'
                        }, {
                            $set: { aboutId: _about._id  }
                        }, {upsert: true, 'new': true});
                }
            }, (err) => {
              return Promise.reject(err);
          })
};

module.exports.getActiveAboutById = () => {
    checkInitialization();
    
    return ActiveAboutModel
            .findOne({ name: 'AboutUsPage' })
            //.populate('createdBy')
            .exec();
};

module.exports.getActiveAboutToDisplay = () => {
    checkInitialization();

    return module.exports.getActiveAboutById()
            .then((activeAbout) => {
                if(activeAbout)
                    return module.exports.getAboutById(activeAbout.aboutId)
                else return null
            }, (err) => {
                return Promise.reject(err);
            });
};


module.exports.getContactTemplates = () => {
    checkInitialization();
    
    return ContactTemplateModel
            .find()
            .populate('createdBy')
            .populate('updatedBy')
            .exec();
};

module.exports.getContactTemplateById = (id) => {
    checkInitialization();
    
    return ContactTemplateModel
            .findOne({ _id: id })
            //.populate('createdBy')
            .exec();
};

module.exports.saveContactTemplate = (saveTemplate) => {
    checkInitialization();
    
    var p;
    
    if(saveTemplate._id){
     //update    
      p = ContactTemplateModel.findByIdAndUpdate(
          saveTemplate._id,
          {$set: {
                name: saveTemplate.name,
                content: saveTemplate.content,
                updatedBy: saveTemplate.updatedBy,
                dateUpdated: Date.Now
            }
          },
          {new: true});
    } else {
      //save
      p = ContactTemplateModel.create({
          name: saveTemplate.name,
          content: saveTemplate.content,
          createdBy: saveTemplate.createdBy,
          updatedBy: saveTemplate.updatedBy
      });
    }
    
    return Promise.all([p, module.exports.getActiveContactTemplate() ])
            .then((results) => {
                var _template = results[0], activeContactTemplate = results[1];
                
                if(activeContactTemplate && _template._id.equals(activeContactTemplate.templateId) && !saveTemplate.active){
                    //delete the table
                    return ActiveContactTemplateModel.remove({ name: 'ContactTemplate' });
                } else if(saveTemplate.active) {
                  return ActiveContactTemplateModel.findOneAndUpdate({
                            name: 'ContactTemplate'
                        }, {
                            $set: { templateId: _template._id  }
                        }, {upsert: true, 'new': true});
                }
            }, (err) => {
              return Promise.reject(err);
          })
};

module.exports.getActiveContactTemplate = () => {
    checkInitialization();
    
    return ActiveContactTemplateModel
            .findOne({ name: 'ContactTemplate' })
            .exec();
};

module.exports.getActiveContactTemplateToDisplay = () => {
    checkInitialization();

    return module.exports.getActiveContactTemplate()
            .then((activeTemplate) => {
                if(activeTemplate)
                    return module.exports.getContactTemplateById(activeTemplate.templateId)
                else return null
            }, (err) => {
                return Promise.reject(err);
            });
};


module.exports.getQuestions = () => {
    checkInitialization();
    
    return FAQModel
            .find()
            .populate('createdBy')
            .populate('updatedBy')
            .exec();
};

module.exports.getQuestionById = (id) => {
    checkInitialization();
    
    return FAQModel
            .findOne({ _id: id })
            //.populate('createdBy')
            //.populate('updatedBy')
            .exec();
};

module.exports.saveQuestion = (question) => {
    checkInitialization();
    
    if(question._id){
      //update
      return FAQModel.findOneAndUpdate({
                            id: question._id
                        }, {
                            $set: { question: question.question,
                                    answer: question.answer,
                                    updatedBy: question.updatedBy,
                                    dateUpdated: Date.Now
                            }
                        }, {upsert: false, 'new': true})
                        
    } else {
      //save
      return FAQModel.create(question);
    }
};

module.exports.getQuestionOrder = () => {
    checkInitialization();
    
    return FAQOrderModel
            .findOne({ name: 'QuestionOrder' })
            .exec();
};

module.exports.saveQuestionOrder = (qOrder) => {
    checkInitialization();
    
    return FAQOrderModel
            .findOneAndUpdate({
                    name: 'QuestionOrder'
                }, {
                    $set: { 
                        questionOrder: qOrder
                    }
                }, {upsert: true, 'new': true});
};