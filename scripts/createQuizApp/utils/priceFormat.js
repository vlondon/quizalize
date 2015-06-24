module.exports = function(price, currency = '£'){
    price = Number(price);
    return currency + price.toFixed(2);
};
