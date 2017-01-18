module.exports = function(path, passport, FacebookStrategy, config, mongoose) {
    
    //console.log('user--- ', path.join( process.cwd(), '/models/user'));
    
    var User = require(path.join( process.cwd(), '/models/user'))(mongoose);
    
    
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}