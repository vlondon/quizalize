var aws = require('aws-sdk');
var config = require('./config');
var logger = require('./logger');

logger.info("Loading AWS with ", config.aws_config);

// load aws config
aws.config = new aws.Config(config.aws_config);

module.exports = aws;
