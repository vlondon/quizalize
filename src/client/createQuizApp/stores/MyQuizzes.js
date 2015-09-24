/* @flow */
import Store from './Store';
import Immutable, {Record} from 'immutable';


class MyQuizzes extends Store {
    constructor(){
        super();
        // this.state = new meRecord();
    }
}

var quizStoreInstance = new MyQuizzes();
export default quizStoreInstance
