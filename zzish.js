var zzish = require("zzishsdk");
var config = require('./config');
var logger = require('./logger');

logger.info("Loading Zzish with ", config.zzishInit);

// load aws config
function getZzishParam() {
    try {
        return JSON.parse(config.zzishInit);
    }
    catch (err) {
        return config.zzishInit;
    }
}
zzish.init(getZzishParam());

module.exports = zzish;
