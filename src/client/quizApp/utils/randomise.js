var iterations = 0;

var isEqual = function(arr1, arr2) {
    var equals;

    equals = arr1.filter((val, index)=> arr2[index] === val);

    return equals.length === arr1.length;

};


var randomise = function(array, returnOriginal = false) {

    iterations++;

    if (iterations > 10){
        iterations = 0;
        return array;
    }

    var originalArray = array.slice();

    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    if (isEqual(originalArray, array) && returnOriginal === false){
        return randomise(originalArray, returnOriginal);
    } else {
        iterations = 0;
        return array;
    }

};

module.exports = randomise;
