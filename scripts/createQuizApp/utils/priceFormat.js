/* @flow */
import TransactionStore from './../stores/TransactionStore';
export default function(price : number, currency : string = '£', country : string = 'uk'){

    if (!price) { return 'Free'; }

    var intPrice = Number(price);

    var localPrice = TransactionStore.getPriceInCurrency(intPrice, country);
    return currency + localPrice.toFixed(2);

}
