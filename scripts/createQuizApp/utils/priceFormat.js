module.exports = function(price, currency = '£'){
    if (!price) { return 'Free'; }
    price = Number(price);
    return currency + price.toFixed(2);
};
