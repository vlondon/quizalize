
angular.module('createQuizApp').filter('orderObjectBy', function () {
    var getNestedObject= function(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    };

    var isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var hashCode = function(str) {
        if (isNumber(str)) return parseFloat(str);
        var hash = 0, i, chr, len;
        if (str==undefined) return 0;
        if (str.length == 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;        
    }

    return function(items, fields) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            for (var i=0;i<fields.length;i++) {
                var field = fields[i];
                var multiplier = 1;
                if (field.indexOf("-")==0) {
                    multiplier = -1;
                    field = field.substring(1);
                }
                var x1 = getNestedObject(a,field);
                var x2 = getNestedObject(b,field);
                var x = hashCode(x1)*multiplier;
                var y = hashCode(x2)*multiplier;
                if (x>y) {
                    return 1;
                }
                else if (x<y) {
                    return -1;
                }
            }
            return 0;
        });
        return filtered;
    };
});