var localIntercom;

var getIntercom = function(args, obj){

    localIntercom = window.Intercom;

    if (localIntercom) {
        localIntercom(args, obj);
        if (args === 'shutdown') {
            localIntercom = function(){
            };
        };
    }
};

export default getIntercom;
