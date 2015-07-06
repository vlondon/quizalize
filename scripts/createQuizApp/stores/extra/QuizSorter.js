/* @flow */
import type {Quiz} from './../QuizStore';
import TopicStore from './../TopicStore';

export default class QuizSorter {

    listOfQuizzes: Array<Quiz>;

    constructor(){
        // this.listOfQuizzes = args[0];
    }

    setQuizzes(quizzes: Array<Quiz>): Array<Quiz> {
        this.listOfQuizzes = quizzes;

        return this.listOfQuizzes;
    }

    sort(kind?:string): Array<Quiz>{

        var quizzes = this.listOfQuizzes;
        switch (kind) {
            case 'name':
                quizzes.sort((a, b) => a.meta.name > b.meta.name ? 1 : -1);
                break;

            case 'time':
                quizzes.sort((a, b) =>  a.meta.updated > b.meta.updated ? -1 : 1);
                break;

            case 'category':
            default:

                quizzes.sort((a, b) => {
                    if (a.meta.categoryId && b.meta.categoryId){
                        var topicA = TopicStore.getTopicById(a.meta.categoryId);
                        var topicB = TopicStore.getTopicById(b.meta.categoryId);

                        if (topicA) {
                            var A = topicA.name && topicA.name.toLowerCase();
                        }
                        if (topicB) {
                            var B = topicB.name && topicB.name.toLowerCase();
                        }

                        if (A && B && A === B) {
                            return a.meta.name > b.meta.name ? 1 : -1;
                        }

                        return A > B ? 1 : -1;
                    } else {
                        return a.meta.name > b.meta.name ? 1 : -1;
                    }
                });

                break;

        }

        return this.listOfQuizzes;
    }

    sortByCategory(){
        console.log('about to sort', this);
    }



}
