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

app.set('views', path.join( __dirname + '/../', 'ui'));
//console.log(app.get('views'));

app.set('view engine', 'html');
app.engine('html', require('hogan-express'));


app.use(express.static(path.join(__dirname + '/../', 'ui')));
app.use(cookieParser());
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.IP || config.host);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

require('./routes/routes.js')(express, app, passport, config);

server.listen(app.get('port'), () => {
   console.log('server started on ', app.get('host') + ':' + app.get('port')); 
});