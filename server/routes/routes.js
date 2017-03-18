//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

module.exports = function(express, app, passport, config, mongoose, formidable, bodyParser, _, fs, util, os, nodemailer){
    //var nodemailer = require('nodemailer');
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
          
          //var ext = fname.split('.')[fname.split('.').length - 1];
          
          //nfile = os.tmpDir() + '/' + fname;
          nfile = process.cwd() + '/' + config.attachment_directory + '/' + fname;
          console.log(nfile);
          
          res.writeHead(200, {'content-type': 'text/plain'});
          //res.write('received upload:\n\n');
          //res.end(util.inspect({fields: fields, files: files}));
          res.end(JSON.stringify({path: nfile, size: files.file.size, name: files.file.name}));
          //res.end();
        });
    
        form.on('end', function(){
            // move the file
            fs.rename(tmpFile, nfile, function(){
                
            })
        });
    });
    
    router.get('/getSendersEmails', securePages, (req, res, next) => {
       res.json(config.gmail.map( credentials => ({ user: credentials.user, from: credentials.from }) )  );
    });
    
    router.post('/sendEmail', securePages, jsonParser ,(req, res, next) => {
        //console.log(req.body);
        
        var mail = _.filter(config.gmail, function(c) { 
            console.log(c.user, req.body.senderEmail);
            return c.user == req.body.senderEmail; 
         });
         
         console.log(mail);
         
        if(mail.length == 0)
            res.status(500).send('Sender\'s address was not found in system '); 
            
        // if(req.body.attachments.length > 0){
        //     req.body.attachments.forEach(function(attachment){
                
        //     });
        // }
        
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mail[0].user,
                pass: mail[0].pass
            }
        });
        
        // setup email data with unicode symbols
        var mailOptions = {
            from: req.body.senderName, // sender address
            to: req.body.list, // list of receivers
            subject: req.body.subject, // Subject line
            //text: 'Hello world ?', // plain text body
            html: req.body.bodyhtml, // html body
            attachments: req.body.attachments //[{   // file on disk as an attachment
            //     filename: 'testmail2.txt',
            //     path: __dirname + '/testmail2.js' // stream this file
            // }]
        };
        
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            console.log('error', error);
            console.log('info', info);
            if (error) {
                res.status(500).send('Something went wrong while sending email'); 
            }
            
            //res.json({ messageId: info.messageId, response: info.response });
            res.json(info);
        });
        
    });
    
    router.post('/saveAboutus', securePages, jsonParser ,(req, res, next) => {
        if(!req.body._id)
            req.body.createdBy = req.user.user._id;
        
        req.body.updatedBy = req.user.user._id;
        
        userApi.saveAboutus(req.body)
        .then(() => {
           res.json(true);
        }, (err) => {
           res.status(500).send(err); 
        });
    });
    
    router.get('/getAbouts', securePages, (req, res, next) => {
       userApi.getAbouts()
       .then((abouts) => {
           res.json(abouts);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.get('/getAboutById/:id', securePages, (req, res, next) => {
       userApi.getAboutById(req.params.id)
       .then((about) => {
           res.json(about);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.get('/getActiveAboutById', securePages, (req, res, next) => {
       userApi.getActiveAboutById()
       .then((about) => {
           res.json(about);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.get('/getActiveAboutToDisplay', (req, res, next) => {
       userApi.getActiveAboutToDisplay()
       .then((about) => {
           res.json(about);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.post('/saveContactTemplate', securePages, jsonParser ,(req, res, next) => {
        if(!req.body._id)
            req.body.createdBy = req.user.user._id;
        
        req.body.updatedBy = req.user.user._id;
            
        //console.log(req.body);
        userApi.saveContactTemplate(req.body)
        .then(() => {
           res.json(true);
        }, (err) => {
           res.status(500).send(err); 
        });
    });
    
    router.get('/getContactTemplates', securePages, (req, res, next) => {
       userApi.getContactTemplates()
       .then((templates) => {
           res.json(templates);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.get('/getContactTemplateById/:id', securePages, (req, res, next) => {
       userApi.getContactTemplateById(req.params.id)
       .then((template) => {
           res.json(template);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.get('/getActiveContactTemplate', securePages, (req, res, next) => {
       userApi.getActiveContactTemplate()
       .then((activeTemplate) => {
           res.json(activeTemplate);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.get('/getActiveContactTemplateToDisplay', (req, res, next) => {
       userApi.getActiveContactTemplateToDisplay()
       .then((templateToDisplay) => {
           res.json(templateToDisplay);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    //------------------------
    
    router.get('/getQuestions', securePages, (req, res, next) => {
        userApi.getQuestions()
        .then((questions) => {
			//res.send(200, roles);
			res.json(questions);
		}, (err) => {
			res.send(err);
		});
        //res.send('Setting favourite color!');
    });
    
    router.get('/getQuestionById/:id', securePages, (req, res, next) => {
       userApi.getQuestionById(req.params.id)
       .then((question) => {
           res.json(question);
       }, (err) => {
           res.status(500).send(err);
       })
    });
    
    router.post('/saveQuestion', securePages, jsonParser ,(req, res, next) => {
        if(!req.body._id)
            req.body.createdBy = req.user.user._id;
        
        req.body.updatedBy = req.user.user._id;
            
        //console.log(req.body);
        userApi.saveQuestion(req.body)
        .then(() => {
           res.json(true);
        }, (err) => {
           res.status(500).send(err); 
        });
    });
    
    router.get('/getQuestionOrder', securePages, (req, res, next) => {
        userApi.getQuestionOrder()
        .then((qOrder) => {
			//res.send(200, roles);
			res.json(qOrder);
		}, (err) => {
			res.send(err);
		});
        //res.send('Setting favourite color!');
    });
    
    router.get('/getQuestions', securePages, (req, res, next) => {
        userApi.getQuestions()
        .then((questions) => {
			//res.send(200, roles);
			res.json(questions);
		}, (err) => {
			res.send(err);
		});
        //res.send('Setting favourite color!');
    });
    
    
    router.post('/saveQuestionOrder', securePages, jsonParser ,(req, res, next) => {
        //console.log(req.body);
        userApi.saveQuestionOrder(req.body)
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