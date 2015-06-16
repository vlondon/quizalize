var React = require('react');
var assign = require('object-assign');
var AppActions = require('createQuizApp/actions/AppActions');
var QuizStore = require('createQuizApp/stores/QuizStore');

var appPicture;

var CQViewCreateApp = React.createClass({

    propTypes: {
        selectedQuizzes: React.PropTypes.array
    },

    getInitialState: function() {
        return {
            imageData: null,
            app: {
                meta: {
                    name: undefined,
                    description: undefined,
                    iconURL: undefined
                },
                payload: {
                    quizzes: [],
                    categories: []
                }
            }
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var app = assign({}, this.state.app);
        app.payload.quizzes = nextProps.selectedQuizzes;
        var categories = nextProps.selectedQuizzes.map(q => {
            var quizzes = QuizStore.getQuizzes();
            var quiz = quizzes.filter(qu => qu.uuid === q)[0];

            return quiz._category.uuid;
        });

        app.meta.categories = categories.join(',');
        app.meta.quizzes = app.payload.quizzes.join(',');

        this.setState({app});
    },

    handleChange: function(field, event) {

        var app = assign({}, this.state.app);
        app.meta[field] = event.target.value;

        this.setState({app});
    },

    handleSave: function(){

        AppActions.saveNewApp(this.state.app, appPicture);
    },
    // when a file is passed to the input field, retrieve the contents as a
    // base64-encoded data URI and save it to the component's state
    handleAppPicture: function(ev){
        appPicture = ev.target.files[0];
    },

    render: function() {
        return (
            <div className="cq-viewcreateapp">
                <h3>
                    Creating app
                </h3>

                <div className="cq-viewcreateapp__formelement form-group">

                    <label htmlFor="name">Name of your app</label>
                    <input type="text" id="name"
                        className="form-control"
                        onChange={this.handleChange.bind(this, 'name')}
                        value={this.state.app.meta.name}/>

                </div>

                <div className="cq-viewcreateapp__formelement form-group">

                    <label htmlFor="name">Colour of your app (hex value, including hash)</label>
                    <input type="text" id="colour"
                        className="form-control"
                        onChange={this.handleChange.bind(this, 'colour')}
                        value={this.state.app.meta.colour}/>

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
                    <label htmlFor="iconURL">Icon image</label>
                    <input type="file"
                        className="form-control"
                        ref="profilePicture"
                        accept="image/*"
                        onChange={this.handleAppPicture}/>

                </div>



                <div className="cq-viewcreateapp__counter">

                    n. of selected Quizzes <b>{this.props.selectedQuizzes.length}</b>
                </div>

                <button className="btn btn-default" onClick={this.handleSave}>
                    Save
                </button>

            </div>
        );
    }

});

module.exports = CQViewCreateApp;
