var zzish = require("../../zzish");

var Apps = {

    getUserApps: (profileId, me) =>{

        return new Promise((resolve, reject)=>{
            var isOwnApps = me;

            //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);
            var now = Date.now();
            var lastCentury = now - 100 * 365 * 7 * 24 * 60 * 60 * 1000;
            var mongoQuery = {
                updated: {
                    $gt: lastCentury,
                }
            };

            if (isOwnApps !== true){
                mongoQuery.published = 'published';
            }

            console.log('queriyng apps', mongoQuery, isOwnApps, isOwnApps);

            zzish.searchContent(profileId, 'app', mongoQuery, (err, resp)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(resp);
                }
            });
        });
    },
    getApp: (appId) => {
        return new Promise((resolve, reject)=>{
            zzish.getPublicContent('app', appId, (err, resp) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp);
                }
            });
        });
    }
};

export default Apps;
