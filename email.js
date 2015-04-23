//aws instance
var awssdk = require('./awssdk');
//general zzish config
var config = require('./config.js');

exports.pingDevelopers = function(){
	if (config.webUrl=="https://www.zzish.com/") {
		exports.sendEmail("team@zzish.com",["developers@zzish.com"],"QUizalize Restarted","Please test me");
	}
}

/* * * * * * * Generic Send Email * * * * * * */
exports.sendEmail = function(from,toArray,subject,body){
	if (config.log) console.log("Sending" + from + " to =>" + toArray + "with subject" + subject + " and message" + body);
	if (config.aws_enabled) {
		// load AWS SES
		var ses = new awssdk.SES;

		// this sends the email
		ses.sendEmail( 
			{ 
				Source: from, 
				Destination: { ToAddresses: toArray },
				Message: {
					Subject: {
						Data: subject
					},
					Body: {
						Text: {
							Data: body
						}
					}
				}
			}
		, function(err, data) {		
			if(err) { 
				if (config.log) console.log('Error sending email: ' + err);
			} else {
				if (config.log) console.log('Email sent:');
				if (config.log) console.log(data);
			}
		});
	}
	else {
		if (config.log) console.log("Email not enabled");
	}
}