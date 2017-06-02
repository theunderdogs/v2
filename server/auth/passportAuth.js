module.exports = function(path, passport, FacebookStrategy, config, mongoose, _, cacheBuilder) {
    
    var UserModel = require(path.join( process.cwd(), '/models/model')).getModel('user');
    
    passport.serializeUser((userData, done) => {
        //console.log('serializeUser', userData);
        done(null, userData);
        //done(null, user.id);
    });
    
    passport.deserializeUser((userData, done) => {
        //userModel.findById(id, (err, user) => {
        //    done(err, user);
        //});
        //console.log('deserializeUser', userData);
        done(null, userData);
    });
    
    passport.use(new FacebookStrategy({
        clientID: config.fb.appID,
        clientSecret: config.fb.appSecret,
        callbackURL: config.fb.callbackURL,
        profileFields: ['id', 'displayName', 'photos']  //you can comment this like to get the full profile object
    }, (accessToken, refreshToken, profile, done) => {
        //check if the user exists in mongoDB
        //console.log(profile);
        
        UserModel.findOne({'facebookId': profile.id})
            .populate('role')
            .exec()
            .then((user) => {
                if(user){
                //console.log(cacheBuilder.permissionMap)
                    //  console.log(userPermissions)
                    if(user.isAdmin)
                        done(null, { user, profile });
                
                    else {
                        var userPermissions =  _.filter(cacheBuilder.permissionMap, (r) => { 
                            return r.name === user.role.name;     
                         })[0];
                     
                        done(null, {user, profile, userPermissions }) 
                    }
                } else {
                    console.log('No user present');
                }
            })
            .catch((err) => {
                console.log('Login failed')
            })
    }));
}