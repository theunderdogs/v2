'use strict';
// console.log('* [example2] sending test email');
 
// var send = require('gmail-send')({
//   user: 'kirandeore@gmail.com',           // Your GMail account used to send emails 
//   pass: 'faucyikczdvutifw', //'yoaoladtpsbocbag',           // Application-specific password 
//   to:   'kirandeore@gmail.com',           // Send to yourself 
//   subject: 'ping',
//   text:    'gmail-send example 2'   // Plain text 
// })(); 

var  nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kirandeore@gmail.com',
        pass: 'faucyikczdvutifw'
    }
});

// setup email data with unicode symbols
var mailOptions = {
    from: '"Winner 👻" <theunderdogs@gmail.com>', // sender address
    to: 'pumpedupdevs@gmail.com, pumpedupbro@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});

// var lib = require('email')
//   , Email = lib.Email;
    
// lib.from = 'kirandeore@gmail.com'

// // no need to set the from property, already set
// var mail = new Email(
// { to: "pumpedupdevs@gmail.com"
// , subject: "Knock knock..."
// , body: "Who's there?"
// })
// mail.send()