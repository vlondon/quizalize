
import QuizStore from './../QuizStore';

class App extends Object {

    constructor(properties){

        super(properties);
        Object.assign(this, properties);
        this.meta.quizzes = this.meta.quizzes.split(';').map(q => QuizStore.getQuiz(q));
        
    }

}

export default App;
