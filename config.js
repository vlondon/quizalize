var config = {};


//Logging on
config.log = true;

config.webUrl = process.env.WEB_URL;
config.zzishsdkurl = process.env.ZZISH_SDK_URL;

config.aws_enabled = true;
config.aws_config = {
	"accessKeyId" : process.env.AWS_ACCESS_KEY,
	"secretAccessKey": process.env.AWS_SECRET,
	"region": process.env.AWS_REGION
};

//App Token
config.quizAppToken = process.env.QATOKEN;

config.wso2 = process.env.WSO2_ENABLED;
config.local = process.env.LOCAL_ENABLED;

module.exports = config;