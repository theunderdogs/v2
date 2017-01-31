//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

module.exports = function(express, app, passport, config, mongoose, formidable, bodyParser){
    
    var router = express.Router();
    var jsonParser = bodyParser.json();
    var userApi =  require( process.cwd() + '/api/user_api');
    var securePages = (req, res, next) => {
        if(req.isAuthenticated()){
            next();
        } else {
            res.redirect('/login')
        }
    };
    
    router.get('/', securePages, (req, res, next) => {
        res.render('admin');
    });
    
    router.get('/login', (req, res, next) => {
        res.render('login', { host: config.host });
    });
    
    router.get('/admin', securePages, (req, res, next) => {
        res.render('admin', { host: config.host, 
            profilePic: encodeURI(req.user.profile.photos[0].value),  
            profileName: req.user.profile.displayName ,
            year: new Date().getFullYear() 
        });
    });
    
    router.get('/auth/facebook', passport.authenticate('facebook'));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/admin',
        failureRedirect: '/login'
    }))
    
    router.get('/getUserByFacebookId/:facebookid', securePages, (req, res, next) => {
        userApi.getUserByFacebookId(req.params.facebookid)
        .then((user) => {
			res.json(user);
		}, (err) => {
			res.status(400).send('err occured');
		});
        //res.send('Setting favourite color!');
    });
    
    router.get('/getroles', securePages, (req, res, next) => {
        userApi.getRoles()
        .then((roles) => {
			//res.send(200, roles);
			res.json(roles);
		}, (err) => {
			res.send(err);
		});
        //res.send('Setting favourite color!');
    });
    
    router.get('/getPermissionsByRoleId/:roleid', securePages, (req, res, next) => {
       userApi.getPermissionsByRoleId(req.params.roleid)
       .then((permissions) => {
           res.json(permissions);
       }, (err) => {
           res.status(400).send(err);
       })
    });
    
    router.get('/getPermissions', securePages, (req, res, next) => {
       userApi.getPermissions()
       .then((permissions) => {
           res.json(permissions);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.post('/saveRole', securePages, jsonParser ,(req, res, next) => {
        console.log(req.body);
        userApi.saveRole(req.body)
        .then(() => {
           res.json(true);
        }, (err) => {
           res.status(500).send(err); 
        });
    });
    
    router.post('/createRole', securePages, jsonParser ,(req, res, next) => {
        console.log(req.body);
        userApi.saveRole(req.body)
        .then(() => {
           res.json(true);
        }, (err) => {
           res.status(500).send(err); 
        });
    });
    
    router.get('/getUsers', securePages, (req, res, next) => {
       userApi.getUsers()
       .then((users) => {
           res.json(users);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.post('/saveUser', securePages, jsonParser ,(req, res, next) => {
        console.log(req.body);
        userApi.saveUser(req.body)
        .then(() => {
           res.json(true);
        }, (err) => {
           res.status(500).send(err); 
        });
    });
    
    router.get('/logout', (req, res, next) => {
        req.logout();
        res.redirect('/login');
    });
    
    /*
    router.get('/per', (req, res, next) => {
        userApi.calculatePermissions()
        .then((permissions) => {
			res.json(permissions);
		}, (err) => {
			res.status(500).send(err);
		});
        //res.send('Setting favourite color!');
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
    */
    
    app.use('/', router);
}