var localIntercom;

var getIntercom = function(args, obj){

    localIntercom = window.Intercom;

    localIntercom(args, obj);
    if (args === 'shutdown') {
        localIntercom = function(){
            console.log('intercom noop');
        };
    };
};

export default getIntercom;
