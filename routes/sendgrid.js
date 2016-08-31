var sendgrid = require('sendgrid');

var helper = sendgrid.mail;

function sendVerificationEmail(receiver, token, callback){
    var medium = 'email';
    var url = process.env.HOST + "/signup/validate?token=" + token +"&medium=" + medium;

    var from_email = new helper.Email('noreply@ayuveda.herokuapp.com');
    var to_email   = new helper.Email(receiver);
    var subject    = 'Welcome to Ayuveda! Please activate your account!';
    var content    = new helper.Content('text/html', 'Hello, please try this <a href=' + url + '>link' + '</a>');
    var mail       = new helper.Mail(from_email, subject, to_email, content);



    var sg = sendgrid(process.env.SENDGRID_API_KEY);
    var req = sg.emptyRequest({
        method: 'POST',
        path:   '/v3/mail/send',
        body:   mail.toJSON()
    });

    sg.API(req, function(err, res){
        console.log(res.statusCode);
        console.log(res.body);
        console.log(res.headers);
        callback(res.statusCode);
    })
}

module.exports = sendVerificationEmail;