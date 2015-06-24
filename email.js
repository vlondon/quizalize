//aws instance
var awssdk = require('./awssdk');
//general zzish config
var config = require('./config.js');
var logger = require('./logger');

exports.pingDevelopers = function(){
	if (config.webUrl === "https://www.zzish.com/") {
		exports.sendEmail("team@zzish.com", ["developers@zzish.com"], "Quizalize Restarted", "Please test me");
	}
};

/* * * * * * * Generic Send Email * * * * * * */
exports.sendEmail = function(from, toArray, subject, body){
	logger.info("Sending" + from + " to =>" + toArray + "with subject" + subject + " and message" + body);
	if (config.aws_enabled) {
		// load AWS SES
		var ses = new awssdk.SES();

		var dest = { ToAddresses: toArray };
		if (process.env.vini === "true") {
			logger.info("Sending to Vini");
			dest.BccAddresses =  ['vini@zzish.com'];
		}

		// this sends the email
		ses.sendEmail(
			{
				Source: from,
				Destination: dest,
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
				logger.error('Error sending email: ' + err);
			} else {
				logger.info('Email sent:');
				logger.info(data);
			}
		});
	}
	else {
		logger.warn("Email not enabled");
	}
};
