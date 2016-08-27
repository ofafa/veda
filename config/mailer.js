/**
 * Created by s955281 on 8/26/16.
 */
var mailer = require('nodemailer');
var transporter = mailer.createTransport({
    service: 'Gmail',
    auth:{
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PWD
    }

});

function sendVerificationMail(email, token){
    var medium = 'email';
    var url = process.env.HOST + "/signup/validate?token=" + token +"&medium=" + medium;
    var options = {
        from: 'no-reply@gmail.com',
        to: email,
        subject: 'Welcome to Ayuveda! Please confirm your email',
        html: '<p>Thank you for registering our service, please press the button below to complete your registration process. \n</p>'
            + '<form method="post"><a href="' + url + '">' + 'Confirm</a></form>'
            + '<p>If you are unable to do so, copy and paste the following link into your browser:</p>' + url
    };
    transporter.sendMail(options, function(err, info){
        if(err) console.log('Send verification mail err: ' + err);
        else console.log('Verification mail sent to ' + email + ':' + info.response);
    });
}

module.exports = sendVerificationMail;