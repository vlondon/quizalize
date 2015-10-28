/* @flow */
import React from 'react';

import AppActions from './../../../actions/AppActions';

import {
    QuizStore,
    AppStore,
    TopicStore,
    TransactionStore
} from './../../../stores';

import type {
    Quiz,
    AppComplete
} from './../../../../../types';

import {
    CQViewAppColourPicker,
    CQViewQuizList,
} from './../../../components';

import CQViewCreateAppTemplate from './CQViewCreateAppTemplate';

import {priceFormat}  from './../../../utils';

var appPicture: ?Object;

type Props = {
    appId: string;
}
type State = {
    app: AppComplete;
    quizzes: Array<Quiz>;
    selectedQuizzes: Array<string>;
    prices?: Array<number>;
    canSave?: boolean;
    imageData?: ?Object;
}

export default class CQViewCreateApp extends React.Component {

    props:Props;
    state:State;

    constructor(props:Props) {
        super(props);
        this.state =  {
            selectedQuizzes: [],
            prices: TransactionStore.getPrices(),
            quizzes: QuizStore.getPersonalQuizzes(),
            canSave: props.appId ? true : false,
            app: this.getApp()
        };
        console.log('this.state', this.state);

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        AppStore.addChangeListener(this.onChange);
        TopicStore.addChangeListener(this.onChange);
        QuizStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        AppStore.removeChangeListener(this.onChange);
        TopicStore.removeChangeListener(this.onChange);
        QuizStore.removeChangeListener(this.onChange);
    }

    onChange(){
        this.setState(this.getState());
    }

    getApp(props?: Props):AppComplete{
        props = props || this.props;


        var appInfo = AppStore.getAppInfo(props.appId);
        if (appInfo){
            return appInfo;
        } else {
            return AppStore.getNewApp();
        }
    }



    getState():State{

        var app = this.getApp();
        var quizzes = QuizStore.getPersonalQuizzes();
        var selectedQuizzes:Array<string> = app.payload.quizzes;

        return { app, quizzes, selectedQuizzes };

    }

    componentWillReceiveProps(nextProps:Props) {

        var app = Object.assign({}, this.state.app);
        if (nextProps.appId) {
            app = this.getApp();
        }

        // TODO: Not sure if this is needed anymore
        //app.meta.quizzes = nextProps.selectedQuizzes;
        // var categories = nextProps.selectedQuizzes.map(q => {
        //     var quizzes = QuizStore.getQuizzes();
        //     var quiz = quizzes.filter(qu => qu.uuid === q)[0];
        //     return quiz.meta.categoryId;
        // });

        // app.meta.categories = categories.join(',');
        // app.meta.quizzes = app.meta.quizzes.join(',');

        this.setState({app});
    }

    handleChange(field: string, event: Object) {
        console.log('field, ', field, event);
        var app = Object.assign({}, this.state.app);
        app.meta[field] = event.target.value;

        var csave = this.state.canSave;
        if (field === 'name') {
            csave = event.target.value && event.target.value.length > 0;
        }

        this.setState({app, canSave: csave});
    }

    handleSave(){
        this.setState({canSave: false});
        this.state.app.payload.quizzes = this.state.selectedQuizzes;
        AppActions.saveNewApp(this.state.app, appPicture);
    }
    // when a file is passed to the input field, retrieve the contents as a
    // base64-encoded data URI and save it to the component's state
    handleAppPicture(ev:Object){

        var reader = new FileReader();
        reader.onload = (upload) =>{
            this.setState({
                imageData: upload.target.result
            });
        };

        var file = ev.target.files[0];
        appPicture = file;
        reader.readAsDataURL(file);

    }

    handleSelect(selectedQuizzes: Array<Object>) {
        var csave = this.state.app.meta.name && this.state.app.meta.name.length > 0 && selectedQuizzes && selectedQuizzes.length > 0;
        this.setState({selectedQuizzes, canSave: csave});
    }

    render():any {
        var prices;
        if (this.state.prices){
            prices = this.state.prices.map(price=> {
                return (
                    <option key={price} value={price}>{priceFormat(price, '$', 'us')}</option>
                );
            });
        }
        return (
            <div className="cq-viewcreateapp">
                <div className="cq-viewcreateapp__left">
                    <h3>
                        Creating app
                    </h3>

                    <h4>1. App Details</h4>
                    <div className="cq-viewcreateapp__formelement form-group">

                        <label htmlFor="name">Name of your app</label>
                        <input type="text" id="name"
                            className="form-control"
                            onChange={this.handleChange.bind(this, 'name')}
                            value={this.state.app.meta.name}/>

                    </div>

                    <div className="cq-viewcreateapp__formelement form-group">
                        <label htmlFor="iconURL">Icon image</label>
                        <input type="file"
                            className="form-control"
                            ref="profilePicture"
                            accept="image/*"
                            onChange={this.handleAppPicture.bind(this)}/>

                    </div>

                    <div className="cq-viewcreateapp__formelement form-group">

                        <label htmlFor="name">Colour of your app</label>
                        <CQViewAppColourPicker onChange={this.handleChange.bind(this, 'colour')}/>


                    </div>



                    <div className="cq-viewcreateapp__formelement form-group">
                        <label htmlFor="description">Description</label>
                        <textarea type="text" id="description"
                            className="form-control"
                            rows="5"
                            onChange={this.handleChange.bind(this, 'description')}
                            value={this.state.app.meta.description}/>

                    </div>


                    <div className="cq-viewcreateapp__formelement form-group">

                        <label htmlFor="price">Price</label>
                        <select name="" id="price" className="form-control" onChange={this.handleChange.bind(this, 'price')}>
                            {prices}
                        </select>

                    </div>


                    <h4>2. Quizzes</h4>


                    <CQViewQuizList
                        quizzes={this.state.quizzes}
                        onSelect={this.handleSelect.bind(this)}
                        selectedQuizzes={this.state.selectedQuizzes}
                        selectMode={true}
                        sortOptions={false}
                        sortBy='time'
                    />

                    <button
                        className="btn btn-default"
                        disabled={!this.state.canSave}
                        onClick={this.handleSave.bind(this)}>
                        Save
                    </button>
                </div>
                <div className="cq-viewcreateapp__right">
                    <CQViewCreateAppTemplate
                        app={this.state.app}
                        icon={this.state.imageData}
                        quizzes={this.state.selectedQuizzes}/>
                </div>
            </div>
        );
    }
}

CQViewCreateApp.propTypes = {
    appId: React.PropTypes.string
};
