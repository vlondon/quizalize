var React = require('react');
var assign = require('object-assign');
var AppActions = require('createQuizApp/actions/AppActions');
var QuizStore = require('createQuizApp/stores/QuizStore');
var AppStore = require('createQuizApp/stores/AppStore');
var TopicStore = require('createQuizApp/stores/TopicStore');
var CQViewAppColourPicker = require('createQuizApp/components/views/CQViewAppColourPicker');
var appPicture;

var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');
var CQViewCreateAppTemplate = require('./CQViewCreateAppTemplate');

var TransactionStore = require('createQuizApp/stores/TransactionStore');
var priceFormat = require('createQuizApp/utils/priceFormat');

var CQViewCreateApp = React.createClass({

    propTypes: {
        appId: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            imageData: null,
            selectedQuizzes: [],
            prices: TransactionStore.getPrices(),
            quizzes: QuizStore.getQuizzes(),
            canSave: false,
            app: this._getApp()
        };
    },

    componentDidMount: function() {
        AppStore.addChangeListener(this.onChange);
        TopicStore.addChangeListener(this.onChange);
        QuizStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        AppStore.removeChangeListener(this.onChange);
        TopicStore.removeChangeListener(this.onChange);
        QuizStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    _getApp: function(props){
        props = props || this.props;
        var app = AppStore.getAppById(props.appId);
        if (app === undefined) {
            app = {
                meta: {
                    name: undefined,
                    description: undefined,
                    iconURL: undefined,
                    price: 0
                },
                payload: {
                    quizzes: [],
                    categories: []
                }
            };
        }
        return app;
    },



    getState: function(){
        var app = this.state.app;
        if (this.props.appId) {
            app = this._getApp();
        }
        var quizzes = QuizStore.getQuizzes();
        //var apps = AppStore.getApps();
        if (quizzes){
            quizzes.sort((a, b)=> a.timestamp > b.timestamp ? -1 : 1 );
        }
        var selectedQuizzes = app.payload.quizzes;
        return { app, quizzes, selectedQuizzes};
    },

    componentWillReceiveProps: function(nextProps) {
        var app = assign({}, this.state.app);
        if (nextProps.appId) {
            app = this._getApp();
        }

        //app.meta.quizzes = nextProps.selectedQuizzes;
        // var categories = nextProps.selectedQuizzes.map(q => {
        //     var quizzes = QuizStore.getQuizzes();
        //     var quiz = quizzes.filter(qu => qu.uuid === q)[0];
        //     return quiz.meta.categoryId;
        // });

        // app.meta.categories = categories.join(',');
        // app.meta.quizzes = app.meta.quizzes.join(',');

        this.setState({app});
    },

    handleChange: function(field, event) {
        console.log('field, ', field, event);
        var app = assign({}, this.state.app);
        app.meta[field] = event.target.value;

        var csave = false;
        if (field === 'name') {
            csave = event.target.value && event.target.value.length > 0 && this.state.selectedQuizzes && this.state.selectedQuizzes.length > 0;
        }

        this.setState({app, canSave: csave});
    },

    handleSave: function(){
        this.setState({canSave: false});
        this.state.app.payload.quizzes = this.state.selectedQuizzes;
        AppActions.saveNewApp(this.state.app, appPicture);
    },
    // when a file is passed to the input field, retrieve the contents as a
    // base64-encoded data URI and save it to the component's state
    handleAppPicture: function(ev){
        appPicture = ev.target.files[0];
        this.setState({imageData: appPicture});
    },

    handleSelect: function(selectedQuizzes){
        var csave = this.state.app.meta.name && this.state.app.meta.name.length > 0 && selectedQuizzes && selectedQuizzes.length > 0;
        this.setState({selectedQuizzes, canSave: csave});
    },

    render: function() {
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
                            onChange={this.handleAppPicture}/>

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
                            {this.state.prices.map(price=> {
                                return (
                                    <option value={price}>{priceFormat(price)}</option>
                                );
                            })}
                        </select>

                    </div>


                    <h4>2. Quizzes</h4>


                    <CQViewQuizList
                        quizzes={this.state.quizzes}
                        onSelect={this.handleSelect}
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

});

module.exports = CQViewCreateApp;
