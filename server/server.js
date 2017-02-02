'use strict';
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
    FacebookStrategy = require('passport-facebook').Strategy;

var env = process.env.NODE_ENV || 'development';

app.set('views', path.join( __dirname + '/../', 'ui_src'));
//console.log(app.get('views'));

app.set('view engine', 'html');
app.engine('html', require('hogan-express'));

app.use(express.static(path.join(__dirname + '/../', 'ui_src')));
app.use(cookieParser());
app.set('port', config.port || process.env.PORT);
app.set('host', config.host || process.env.IP);

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
	require( process.cwd() + '/api/' + filename)(mongoose, path);
});   

//populate master data


require('./auth/passportAuth.js')(path, passport, FacebookStrategy, config, mongoose);
require('./routes/routes.js')(express, app, passport, config, mongoose, formidable, bodyParser);

server.listen(app.get('port'), () => {
   console.log('server started on ', app.get('host') + ':' + app.get('port')); 
});