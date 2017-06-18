'use strict';

//nvm alias default 7.5.0

//watch video for facebook standrd login for unlimited users
//https://developers.facebook.com/docs/marketing-api/access

console.log('Node Version: ' + process.version, 'Environment: ', process.env.NODE_ENV  || 'development')

var express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    formidable = require('formidable'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    FacebookStrategy = require('passport-facebook').Strategy,
    FacebookTokenStrategy = require('passport-facebook-token'),
    _ = require('lodash'),
    util = require('util'),
    os = require('os'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    cacheBuilder = require( process.cwd() + '/cache/cachebuilder')(_),
    env = process.env.NODE_ENV || 'development';

app.set('views', path.join( __dirname + '/../', 'ui_src'));
//console.log(app.get('views'));

app.set('view engine', 'html');
app.engine('html', require('hogan-express'));

app.use(express.static(path.join(__dirname + '/../', 'ui_src')));
app.use(cookieParser());
app.set('port', config.port || process.env.PORT);
app.set('host', config.host || process.env.IP);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', config.addHeaderToDomain);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,access_token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
}); 

mongoose.Promise = global.Promise;

//if(env === 'development'){
//    app.use(session({ secret: config.sessionSecret, resave: true, saveUninitialized: true }))
//} else {
    app.use(session({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true,
        store: new ConnectMongo({
            //url: config.dbURL,
            mongooseConnection: mongoose.connections[0],
            stringify: true
        })
    }))
//}

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(passport.initialize());
app.use(passport.session());

//initialize models
fs.readdirSync( process.cwd() + '/models').forEach(function(filename){
	console.log('Initializing:', path.join( process.cwd() + '/models/' + filename ));
	require( process.cwd() + '/models/' + filename)(mongoose);
});   

//initialize api
fs.readdirSync( process.cwd() + '/api').forEach(function(filename){
	console.log('Initializing:', path.join( process.cwd() + '/api/' + filename ));
	
	//master data is populated here
	require( process.cwd() + '/api/' + filename)(mongoose, path, _, nodemailer, smtpTransport); 
});   

//build cache 
//store.rolesPermissionMap = 
cacheBuilder.buildRolesPermissionMap()
// .then((res) => {
//     store.rolesPermissionMap = res;
// })
.then(() => {
    //console.log(store.rolesPermissionMap[0].permissions[0]);
    //console.log(store.rolesPermissionMap);
    //populate master data at this line
    
    
    require('./auth/passportAuth.js')(path, passport, FacebookStrategy, FacebookTokenStrategy, config, mongoose, _, cacheBuilder);
    require('./routes/routes.js')(express, app, passport, config, mongoose, formidable, bodyParser, _, fs, util, os, cacheBuilder);
    
    server.listen(app.get('port'), () => {
       console.log('server started on ', app.get('host') + ':' + app.get('port')); 
    });    
}); 

