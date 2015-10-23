import React from 'react';

import {TransactionStore} from './../../../stores';

var prices = TransactionStore.getPrices();

var removeUndefinedProps = function(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] === undefined) {
            delete obj[prop];
        }
    }
    return obj;
};

var convertToBoolean =  function(defaultSettings, field) {
    if (defaultSettings[field]) {
        defaultSettings[field] = defaultSettings[field] === "true" || defaultSettings[field];
    }
};

var CQCreateMore = React.createClass({

    getDefaultProps: function() {
        return {
            settings: {}
        };
    },

    propTypes: {
        onSettings: React.PropTypes.func.isRequired,
        settings: React.PropTypes.object
    },

    getInitialState: function() {
        var defaultSettings =  {
            description: undefined,
            imageUrl: undefined,
            imageAttribution: undefined,
            live: false,
            featured: false,
            featureDate: undefined,
            numQuestions: undefined,
            random: false
        };
            // showanswers: false,
            // timer: true
        defaultSettings = Object.assign({}, defaultSettings, this.props.settings);
        convertToBoolean(defaultSettings, 'live');
        convertToBoolean(defaultSettings, 'featured');
        convertToBoolean(defaultSettings, 'random');
        return defaultSettings;

    },

    handleChange: function(property, type, event) {

        type = type || 'text';

        var newState = Object.assign({}, this.state);

        if (type === 'text'){
            newState[property] = (property === 'price') ? Number(event.target.value) :  event.target.value;
        } else {
            newState[property] = event.target.checked;
        }

        this.setState(newState);
        this.props.onSettings(removeUndefinedProps(newState));
    },

    render: function() {
        return (
            <div className="row well">
                <h2>More Settings</h2>
                <p>You can choose the default settings for your quiz here. You and teachers you share your quiz with can override these when they assign a quiz to a class. You can change these at any time by clicking on the settings button when editing your quiz.</p>
                <div className="well">
                    <div className="form-group">
                        <div className="col-xs-12">
                            <h3>Additional Quiz Details</h3>
                        </div>


                        <label className="control-label col-sm-9">
                            <h4>Price<a data-toggle="popover" title="Number of questions in quiz" data-content="You may want to create a pool of 50 questions and only ask 10 questions per quiz" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="0" className="left-space glyphicon glyphicon-question-sign"></a></h4>
                        </label>
                        <div ng-style="margin-top: 13px" className="col-xs-3">
                            <select
                                value={this.state.numQuestions}
                                onChange={this.handleChange.bind(this, 'price', 'text')}>
                                {prices.map(function(price, index){
                                    return (
                                        <option value={price} key={index}>{price}</option>
                                    );
                                })}
                            </select>
                        </div>


                        <label className="control-label col-sm-9">
                            <h4>Description<a data-toggle="popover" title="Description" data-content="Enter a description so that players can understand why your quiz is about." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="0" className="left-space glyphicon glyphicon-question-sign"></a></h4>
                        </label>
                        <div ng-style="margin-top: 13px" className="col-xs-3">
                            <textarea
                                rows="5"
                                value={this.state.description}
                                onChange={this.handleChange.bind(this, 'description', 'text')}
                                className="autogrow"/>
                        </div>
                        <label className="control-label col-sm-9">
                            <h4>Quiz Image URL<a data-toggle="popover" title="Quiz Image URL" data-content="Provide a quiz image URL to represent your quiz" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="0" className="left-space glyphicon glyphicon-question-sign"></a></h4>
                        </label>
                        <div ng-style="margin-top: 13px" className="col-xs-3">
                            <input type="text"
                                value={this.state.imageUrl}
                                onChange={this.handleChange.bind(this, 'imageUrl', 'text')}/>
                        </div>
                        <label className="control-label col-sm-9">
                            <h4>Image Attribute<a data-toggle="popover" title="Image Attribute" data-content="Provide a reference of where this image was found" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="0" className="left-space glyphicon glyphicon-question-sign"></a></h4>
                        </label>
                        <div ng-style="margin-top: 13px" className="col-xs-3">
                            <input type="text"
                                value={this.state.imageAttribution}
                                onChange={this.handleChange.bind(this, 'imageAttribution', 'text')}/>
                        </div>
                        <label className="control-label col-sm-9">
                            <h4>Public<a data-toggle="popover" title="Public" data-content="Make this quiz public" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="0" className="left-space glyphicon glyphicon-question-sign"></a></h4>
                        </label>
                        <div ng-style="margin-top: 13px" className="col-xs-3">
                            <label ng-style="margin-top: 10px" className="switch">
                                <input type="checkbox"
                                    checked={this.state.live}
                                    onChange={this.handleChange.bind(this, 'live', 'checkbox')}
                                    className="switch-input"/>
                                <span data-on="Live" data-off="No" className="switch-label"></span>
                                <span className="switch-handle"></span>
                            </label>
                        </div>

                        <div ng-style="margin-top: 13px" className="col-xs-3">
                            <label className="switch">
                                <input type="checkbox"
                                    checked={this.state.featured}
                                    onChange={this.handleChange.bind(this, 'featured', 'checkbox')}
                                    className="switch-input"/>
                                    <span data-on="Yes" data-off="No" className="switch-label"></span>
                                    <span className="switch-handle"></span>
                            </label>
                        </div>

                        <label className="control-label col-sm-9">
                            <h4>Feature this quiz<a data-toggle="popover" title="Featured Quiz" data-content="Choose this public quiz as your featured quiz" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="0" className="left-space glyphicon glyphicon-question-sign"></a></h4>
                        </label>


                        <div ng-style="margin-top: 13px" className="col-xs-3">
                            <input type="date"
                                value={this.state.featureDate}
                                onChange={this.handleChange.bind(this, 'featureDate', 'text')}
                                />
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <h3>Quiz Playing Details</h3>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-9">
                            <h4>Number of questions to use when playing a quiz<a data-toggle="popover" title="Number of questions in quiz" data-content="You may want to create a pool of 50 questions and only ask 10 questions per quiz" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="0" className="left-space glyphicon glyphicon-question-sign"></a></h4>
                        </label>
                        <div ng-style="margin-top: 13px" className="col-xs-3">
                            <select
                                value={this.state.numQuestions}
                                onChange={this.handleChange.bind(this, 'numQuestions', 'text')}>
                                <option value="">All</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                        <label className="control-label col-sm-9">
                            <h4>Randomize question order when playing a quiz<a data-toggle="popover" title="Randomize question order" data-content="You can choose to randomize the order of the questions every time someone plays the quiz" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="0" className="left-space glyphicon glyphicon-question-sign"></a></h4>
                        </label>
                        <div ng-style="margin-top: 13px" className="col-xs-3">
                            <label className="switch">
                                <input type="checkbox"
                                    checked={this.state.random}
                                    onChange={this.handleChange.bind(this, 'random', 'checkbox')}
                                    className="switch-input"/>
                                <span data-on="Yes" data-off="No" className="switch-label"/>
                                <span className="switch-handle"/>
                            </label>
                        </div>
                        <label className="control-label col-sm-9" style={{display: 'none'}}>
                            <h4>Show Answers during play<a data-toggle="popover" title="Show quiz answers" data-content="Show quiz answers after each question and at the end of the quiz" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="0" className="left-space glyphicon glyphicon-question-sign"></a></h4>
                        </label>
                        <div ng-style="margin-top: 13px" className="col-xs-3" style={{display: 'none'}}>
                            <label className="switch">
                                <input type="checkbox"
                                    checked={this.state.showanswers}
                                    onChange={this.handleChange.bind(this, 'showanswers', 'checkbox')}
                                    className="switch-input"/>
                                <span data-on="Yes" data-off="No" className="switch-label"></span><span className="switch-handle">            </span>
                            </label>
                        </div>
                        <label className="control-label col-sm-9" style={{display: 'none'}}>
                            <h4>Enable Question Timer<a data-toggle="popover" title="Enable Question Timer" data-content="Display timer and score questions based on speed of answer" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="0" className="left-space glyphicon glyphicon-question-sign"></a></h4>
                        </label>
                        <div ng-style="margin-top: 13px" className="col-xs-3" style={{display: 'none'}}>
                            <label className="switch">
                                <input type="checkbox"
                                    checked={this.state.timer}
                                    onChange={this.handleChange.bind(this, 'timer', 'checkbox')}
                                    className="switch-input"/><span data-on="Yes" data-off="No" className="switch-label"></span><span className="switch-handle">            </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = CQCreateMore;
