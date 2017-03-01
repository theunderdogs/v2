//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

module.exports = function(express, app, passport, config, mongoose, formidable, bodyParser, _, fs, util, os){
    
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
    
    router.get('/index', (req, res, next) => {
        //console.log('index route hit');
        res.render('home', { host: config.host, 
            year: new Date().getFullYear() 
        });
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
        //console.log(req.body);
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
    
    router.get('/getEmailLists', securePages, (req, res, next) => {
       userApi.getEmailLists()
       .then((lists) => {
           res.json(lists);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.get('/getEmailListById/:id', securePages, (req, res, next) => {
       userApi.getEmailListById(req.params.id)
       .then((list) => {
           res.json(list);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.post('/saveEmailList', securePages, jsonParser ,(req, res, next) => {
        console.log(req.user.user);
        req.body.createdBy = req.user.user._id;
        console.log(req.body);
        userApi.saveEmailList(req.body)
        .then(() => {
           res.json(true);
        }, (err) => {
           res.status(500).send(err); 
        });
    });
    
    router.post('/file/post', securePages, (req, res, next) => {
        var form = new formidable.IncomingForm();
        var tmpFile, nfile, fname;
        
        function generateFilename(filename) {
            var ext_regex = /(?:\.([^.]+))?$/;
            var ext = ext_regex.exec(filename)[1];
            var date = new Date().getTime();
            var charBank = 'abcdefghijklmnopqrstuvwxyz';
            var fstring = '';
            for(var i = 0; i < 15; i++){
                fstring += charBank[parseInt(Math.random()*26)];
            }
            return (fstring += date + '.' + ext);
        }
        
        form.parse(req, function(err, fields, files) {
          tmpFile = files.file.path;
          fname = generateFilename(files.file.name);
          //nfile = os.tmpDir() + '/' + fname;
          nfile = process.cwd() + '/token/' + fname;
          console.log(nfile);
          
          res.writeHead(200, {'content-type': 'text/plain'});
          //res.write('received upload:\n\n');
          //res.end(util.inspect({fields: fields, files: files}));
          res.end(JSON.stringify({path: files.file.path, size: files.file.size, name: files.file.name}));
          //res.end();
        });
    
        form.on('end', function(){
            fs.rename(tmpFile, nfile, function(){
                
            })
        });
    });
    
    router.get('/getSendersEmails', securePages, (req, res, next) => {
       res.json(config.gmail.map( credentials => ({ user: credentials.user, from: credentials.from }) )  );
    });
    
    router.post('/sendEmail', securePages, jsonParser ,(req, res, next) => {
        console.log(req.body);
        
        
        
        var send = require('gmail-send')({
          user: req.body.from,               // Your GMail account used to send emails
          pass: req.body.password,             // Application-specific password
          to:   req.body.list,      // Send back to yourself
          // from:   '"User" <user@gmail.com>'  // from: by default equals to user
          // replyTo:'user@gmail.com'           // replyTo: by default undefined
          subject: req.body.subject,
          text:    'hey'//req.body.bodyhtml
          // html:    '<b>html text text</b>'
        })();
            
        res.json(true);
        // send({}, function(err, resj){ 
        //     if(err)    
        //         res.status(500).send(err);
        //     else 
        //         res.json(true);
        // });    
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