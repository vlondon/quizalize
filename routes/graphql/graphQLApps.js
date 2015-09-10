var zzish = require("../../zzish");

var Apps = {

    getUserApps: (profileId) =>{
        console.log('queriyng apps', profileId);
        return new Promise((resolve, reject)=>{

            //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);
            var now = Date.now();
            var lastCentury = now - 100 * 365 * 7 * 24 * 60 * 60 * 1000;
            var mongoQuery = {
                $gt: lastCentury
            };

            zzish.searchContent(profileId, 'app', {updated: mongoQuery}, (err, resp)=>{
                console.log('app query got', err, resp);
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
