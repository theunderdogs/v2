module.exports = function(path, passport, FacebookStrategy, config, mongoose, _, permissionMap) {
    
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
        profileFields: ['id', 'displayName', 'photos']
    }, (accessToken, refreshToken, profile, done) => {
        //check if the user exists in mongoDB
        console.log(profile.id, profile.displayName);
        
        UserModel.findOne({'facebookId': profile.id}, (err, user) => {
            if(user){
                //console.log(permissionMap)
                
                // var userPermissions =  _.filter(permissionMap, (r) => { 
                //     if(user.isAdmin) return true
                //     else if(user.role) return r.name === user.role.name;     
                //     else return false
                //  });
                 
                //  console.log(userPermissions)
                
                done(null, { user, profile});
            } else {
                console.log('No user present');
            }
        })
    }));
}