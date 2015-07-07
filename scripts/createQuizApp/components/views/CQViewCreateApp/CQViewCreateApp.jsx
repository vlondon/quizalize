/* @flow */
import React from 'react';
import assign from 'object-assign';

import AppActions from './../../../actions/AppActions';
import QuizStore from './../../../stores/QuizStore';
import AppStore from './../../../stores/AppStore';
import type {AppComplete} from './../../../stores/AppStore';
import TopicStore from './../../../stores/TopicStore';
import CQViewAppColourPicker from './../../../components/views/CQViewAppColourPicker';

import CQViewQuizList from './../../../components/views/CQViewQuizList';
import CQViewCreateAppTemplate from './CQViewCreateAppTemplate';

import TransactionStore from './../../../stores/TransactionStore';
import priceFormat  from './../../../utils/priceFormat';

var appPicture: ?Object;

type Props = {
    appId: string;
}
type State = {
    app: AppComplete;
    quizzes: Array<Object>;
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
            canSave: false,
            app: this.getApp()
        };
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
        console.log('appInfoappInfoappInfo', props.appId);
        // if (props.appId === 'new')
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


        if (quizzes){
            quizzes.sort((a, b)=> a.timestamp > b.timestamp ? -1 : 1 );
        }

        var selectedQuizzes:Array<string> = app.payload.quizzes;

        return { app, quizzes, selectedQuizzes };

    }

    componentWillReceiveProps(nextProps:Props) {

        var app = assign({}, this.state.app);
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
        var app = assign({}, this.state.app);
        app.meta[field] = event.target.value;

        var csave = false;
        if (field === 'name') {
            csave = event.target.value && event.target.value.length > 0 && this.state.selectedQuizzes && this.state.selectedQuizzes.length > 0;
        }

        this.setState({app, canSave: csave});
    }

    handleSave(){
        this.setState({canSave: false});
        this.state.app.payload.quizzes = this.state.selectedQuizzes;
        if (appPicture) {
            AppActions.saveNewApp(this.state.app, appPicture);
        }
    }
    // when a file is passed to the input field, retrieve the contents as a
    // base64-encoded data URI and save it to the component's state
    handleAppPicture(ev:Object){

        var reader = new FileReader();
        reader.onload = (upload) =>{
            console.log('upload.target.result', upload.target.result);
            this.setState({
                imageData: upload.target.result
            });
        };

        var file = ev.target.files[0];
        reader.readAsDataURL(file);

    }

    handleSelect(selectedQuizzes: Array<Object>){
        console.log('this.state.app.meta.name', this.state.app);
        var csave = this.state.app.meta.name && this.state.app.meta.name.length > 0 && selectedQuizzes && selectedQuizzes.length > 0;
        this.setState({selectedQuizzes, canSave: csave});
    }

    render():Object {
        var prices;
        if (this.state.prices){
            prices = this.state.prices.map(price=> {
                return (
                    <option value={price}>{priceFormat(price)}</option>
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
                    />

                    <button
                        className="btn btn-default"
                        disabled={!this.state.canSave}
                        onClick={this.handleSave}>
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
