module.exports = function(express, app, passport, config){
    
    var router = express.Router();
    var securePages = (req, res, next) => {
        if(req.isAuthenticated()){
            next();
        } else {
            res.redirect('/')
        }
    };
    
    router.get('/', (res, req, next) => {
        res.render('index');
    });
    
    router.get('/auth/facebook', passport.authenticate('facebook'));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/chatrooms',
        failureRedirect: '/'
    }))
    
    router.get('/chatrooms', securePages, (req, res, next) => {
        res.render('chatrooms', {title: 'Chatrooms', user: req.user})
    });
    
    router.get('/setcolor', (req, res, next) => {
        req.session.favColor = 'Red';
        res.send('Setting favourite color!');
    });
    
    router.get('/getcolor', (req, res, next) => {
        res.send('Favourite color: ' + (req.session.favColor === undefined? 'Not found': req.session.favColor ));
    });
    
    router.get('/test', (req, res, next) => {
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end('<h1>Express route</h1>');
    });
    
    router.get('/logout', (req, res, next) => {
        req.logout();
        res.redirect('/');
    });
    
    app.use('/', router);
}