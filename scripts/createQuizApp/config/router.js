var director = require('director');

var router = new director.Router();

router.category = (function(){
    var _category;
    return function(category){
        _category = category || _category;
        return _category;
    };
})();

module.exports = router;
