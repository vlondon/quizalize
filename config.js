/*eslint camelcase: 0 */
var config = {};

//Logging on
config.log = true;

config.webUrl = process.env.WEB_URL;
config.zzishsdkurl = process.env.ZZISH_SDK_URL;

config.aws_enabled = true;
config.aws_config = {
	"accessKeyId": process.env.AWS_ACCESS_KEY,
	"secretAccessKey": process.env.AWS_SECRET,
	"region": process.env.AWS_REGION
};

//Zzish INit (Either QATOKEN OR an object with lots of params)
config.zzishInit = process.env.ZZISHINIT;

module.exports = config;
