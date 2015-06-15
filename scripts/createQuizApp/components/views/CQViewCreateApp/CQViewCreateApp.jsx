var React = require('react');
var assign = require('object-assign');
var AppActions = require('createQuizApp/actions/AppActions');


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
                    quizzes: []
                }
            }
        };
    },

    componentWillReceiveProps: function(nextProps) {
        console.log('updating state', nextProps);
        var app = assign({}, this.state.app);
        app.payload.quizzes = nextProps.selectedQuizzes;
        this.setState({app});
    },

    handleChange: function(field, event) {
        console.log('field', field, event.target.value);
        var app = assign({}, this.state.app);
        app.meta[field] = event.target.value;


        this.setState({app});
    },

    handleSave: function(){
        console.log('about to save', this.state.app);
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
                Creating app

                <div className="cq-viewcreateapp__formelement">
                    <label htmlFor="name">Name of your app</label>
                    <input type="text" id="name"
                        onChange={this.handleChange.bind(this, 'name')}
                        value={this.state.app.meta.name}/>

                </div>

                <div className="cq-viewcreateapp__formelement">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description"
                        onChange={this.handleChange.bind(this, 'description')}
                        value={this.state.app.meta.description}/>

                </div>


                <div className="cq-viewcreateapp__formelement">
                    <label htmlFor="iconURL">Icon image</label>
                    <input type="file"
                        ref="profilePicture"
                        accept="image/*"
                        onChange={this.handleAppPicture}/>

                </div>

                n. of selected Quizzes {this.props.selectedQuizzes.length}

                <button className="btn btn-default" onClick={this.handleSave}>
                    Save
                </button>

            </div>
        );
    }

});

module.exports = CQViewCreateApp;
