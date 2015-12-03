/* @flow */
import React from "react";
import { Record } from "immutable";
import {
    CQViewClassList,
    CQViewQuizMarketplaceOptions,
    CQPageTemplate,
    CQViewShareQuiz,
    CQViewQuizSettings,
    CQViewWizard
} from "./../../../components";


import {
    GroupStore,
    QuizStore
} from "./../../../stores";


const Settings = Record({
    maxAttempts: -1,
    numQuestions: -1,
    random: 0,
    repeatUntilCorrect: 0,
    showAnswers: 1,
    showTimer: 1,
    showResult: 1,
    playSounds: 0,
    seed: Math.floor((Math.random() * 100) + 1)
});

import type { QuizComplete } from "./../../../../../types";

type Props = {
    routeParams: { quizId: string };
    assign?: boolean;
    publish?: boolean;
    share?: boolean;
}

type State = {
    groups: Array<Object>;
    selectedClass: string;
    isMoreVisible: boolean;
    settings: Object;
    newClass: string;
}

export default class CQPublished extends React.Component {
    props: Props;

    static propTypes = {
        routeParams: React.PropTypes.object.isRequired,
        assign: React.PropTypes.bool,
        published: React.PropTypes.bool,
        share: React.PropTypes.bool
    };

    constructor(props : Props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.getState = this.getState.bind(this);
        this.getQuiz = this.getQuiz.bind(this);
        this.handleSettings = this.handleSettings.bind(this);


        this.state = this.getState();

    }

    componentDidMount() {
        QuizStore.addChangeListener(this.onChange);
        GroupStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        QuizStore.removeChangeListener(this.onChange);
        GroupStore.removeChangeListener(this.onChange);
    }

    getState() : State {

        var groups = GroupStore.getGroups();
        var selectedClass = (groups && groups.length > 0) ? groups[0].code : "new";
        var isMoreVisible = this.state ? this.state.isMoreVisible : false;

        var settings = this.state && this.state.settings ? this.state.settings : new Settings();
        var newClass = "";
        var newState = {
            groups,
            selectedClass,
            isMoreVisible,
            settings,
            newClass
        };

        return newState;

    }

    getQuiz (props? : Props) : ?QuizComplete {
        props = props || this.props;
        var quiz = props.routeParams.quizId ? QuizStore.getQuiz(props.routeParams.quizId) : undefined;
        return quiz;
    }

    onChange (){
        this.setState(this.getState());
    }



    handleSettings(settings: Settings){
        console.log("settings", settings.toObject());
        this.setState({settings},
            function(){
                console.log("settings state", this.state.settings.toObject());
            });
    }

    render() : any {

        var classList;
        var publishQuiz;
        var shareQuiz;

        console.log("settings", this.state.settings.toObject());
        classList = (
            <div>
                <CQViewClassList
                    settings={this.state.settings}
                    quizId={this.props.routeParams.quizId}/>
                <CQViewQuizSettings settings={this.state.settings} onChange={this.handleSettings}/>
            </div>
        );

        shareQuiz = <CQViewShareQuiz quizId={this.props.routeParams.quizId}/>;

        if (!this.state.settings.published && !this.state.settings.originalQuizId) {
            publishQuiz = (<CQViewQuizMarketplaceOptions quizId={this.props.routeParams.quizId}/>);
        }

        if (this.props.assign === true) {
            publishQuiz = undefined;
            shareQuiz = undefined;
        }

        if (this.props.published === true){
            classList = undefined;
            shareQuiz = undefined;
        }

        if (this.props.share) {
            publishQuiz = undefined;
            classList = undefined;
        }
        return (
            <CQPageTemplate className="cq-published">
                <CQViewWizard step={2}/>
                <div className="cq-published__header">

                </div>


                {classList}
                {publishQuiz}
                {shareQuiz}


            </CQPageTemplate>
        );
    }

}
