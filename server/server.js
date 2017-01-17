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


app.set('port', process.env.PORT || 3000);
app.set('host', process.env.IP || config.host);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

require('./routes/routes.js')(express, app, passport, config);

server.listen(app.get('port'), () => {
   console.log('server started on ', app.get('host') + ':' + app.get('port')); 
});

// const http = require('http');

// http.createServer((req, res) => {
//     res.writeHead(200, {'Content-type': 'text/html'});
//     res.end('<h1>New Repo</h1>')
// })
// .listen(process.env.PORT, () => console.log('server started'));