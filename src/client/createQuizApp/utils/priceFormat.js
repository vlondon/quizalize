/* @flow */
import { TransactionStore } from './../stores';
export default function(price : mixed, currency : string = '£', country : string = 'uk') : string {

    if (!price) { return 'Free'; }

    var numPrice = Number(price);

    var localPrice = TransactionStore.getPriceInCurrency(numPrice, country);
    return currency + localPrice.toFixed(2);

}
