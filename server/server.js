'use strict';
var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

var env = process.env.NODE_ENV || 'development';

app.set('views', path.join( __dirname + '/../', 'ui'));
//console.log(app.get('views'));

app.set('view engine', 'html');
app.engine('html', require('hogan-express'));


app.use(express.static(path.join(__dirname + '/../', 'ui')));
app.use(cookieParser());
app.set('port', config.port || process.env.PORT);
app.set('host', config.host || process.env.IP);

if(env === 'development'){
    app.use(session({ secret: config.sessionSecret, resave: true, saveUninitialized: true }))
} else {
    app.use(session({
        secret: config.sessionSecret,
        store: new ConnectMongo({
            //url: config.dbURL,
            mongooseConnection: mongoose.connections[0],
            stringify: true,
            resave: true,
            saveUninitialized: true
        })
    }))
}

var server = require('http').createServer(app);
var io = require('socket.io')(server);

require('./auth/passportAuth.js')(path, passport, FacebookStrategy, config, mongoose);
require('./routes/routes.js')(express, app, passport, config);

server.listen(app.get('port'), () => {
   console.log('server started on ', app.get('host') + ':' + app.get('port')); 
});