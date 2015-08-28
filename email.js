//aws instance
var awssdk = require('./awssdk');
//general zzish config
var config = require('./config.js');
var logger = require('./logger');
var fs = require('fs');

exports.pingDevelopers = function(){
	if (config.webUrl === "https://www.zzish.com/") {
		exports.sendEmail("team@quizalize.com", ["developers@zzish.com"], "Quizalize Restarted", "Please test me");
	}
};

/* * * * * * * Generic Send Email * * * * * * */
exports.sendEmail = function(from, toArray, subject, body){
	exports.sendActualEmail(from, toArray, subject, body, body);
};

exports.sendActualEmail = function(from, toArray, subject, html, text) {
	//"var emailCheck = process.env.sendEmail;
	var sendEmail = function(to){

		var emailCheck = true;
		if (config.aws_enabled && emailCheck) {
			// load AWS SES
			var ses = new awssdk.SES();

			var dest = { ToAddresses: [to] };
			if (config.webUrl === "https://www.zzish.com/") {
				dest.BccAddresses = ['team@quizalize.com'];
			}
			else if (config.webUrl === "https://test.zzish.com/") {
				dest.CcAddresses = ['frabusiello@gmail.com'];
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
								Data: text
							},
							Html: {
								Data: html
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
	toArray.forEach(sendEmail);
};


function parseData(input, params) {
	for (var i in params) {
		var patt = new RegExp("%" + i + "%", "g" );
		input = input.replace(patt, params[i]);
	}
	return input;
}


exports.sendEmailTemplate = function(from, email, subject, doc, params, htmlParams) {
	fs.stat(__dirname + '/emails/html/' + doc + ".txt", function(err) {
		if (!err) {
			fs.readFile(__dirname + '/emails/html/' + doc + ".txt", 'utf-8', function(err1, contents) {
				var htmlText = contents;
				fs.readFile(__dirname + '/emails/text/' + doc + ".txt", 'utf-8', function(err2, contents2) {
					var txtText = contents2;
					if (!htmlParams) htmlParams = params;

					exports.sendActualEmail(from, email, subject, parseData(htmlText, htmlParams), parseData(txtText, params));
				});
			});
		} else {
			fs.readFile(__dirname + '/emails/text/' + doc + ".txt", 'utf-8', function(err1, contents) {
				exports.sendActualEmail(from, email, subject, parseData(contents, params), parseData(contents, params));
			});
		}
	});
};

exports.sendDocumentEmail = function(req, res) {
	var doc = req.body.doc;
	var email = req.body.email;
	var from = req.body.from;
	var params = req.body.params;
	var htmlParams =  req.body.htmlParams || params;
	var subject = req.body.subject;

	exports.sendEmailTemplate(from, email, subject, doc, params, htmlParams);
};
