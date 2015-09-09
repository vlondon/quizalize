var localIntercom;
var getIntercom = function(args, obj){
    if (localIntercom === undefined){
        localIntercom = window.Intercom;
    }
    console.log('calling intercom with ', localIntercom, args, obj);
    localIntercom(args, obj);
    if (args === 'shutdown') {
        localIntercom = function(){
            console.log('intercom noop');

        };
    };
};
export default getIntercom;
