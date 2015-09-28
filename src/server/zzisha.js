var zzish = require("zzishsdk");
var config = require('./config');
var logger = require('./logger');

logger.info("Loading Zzish with ", config.zzishInitAdmin);

// load aws config
function getZzishParam() {
    try {
        return JSON.parse(config.zzishInitAdmin);
    }
    catch (err) {
        return config.zzishInitAdmin;
    }
}
zzish.init(getZzishParam());

module.exports = zzish;
