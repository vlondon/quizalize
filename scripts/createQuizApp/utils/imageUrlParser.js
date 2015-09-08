var imageUrlParser = function(url){
    var CDNURL = 'https://d15tuytjqnsden.cloudfront.net/';

    if ((url && url.indexOf('http') === -1) && (url && url.indexOf('//') !== 0)) {
        console.log('adding url to', url, url && url.indexOf('//') !== 0);
        url = CDNURL + url;
    }

    return url;

};

export default imageUrlParser;
