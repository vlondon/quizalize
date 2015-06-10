var React = require('react');

var TopicStore = require('createQuizApp/stores/TopicStore');

var CQPublicSort = React.createClass({

    propTypes: {
        className: React.PropTypes.string
    },

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        TopicStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        TopicStore.removeChangeListener(this.onChange);
    },

    onChange: function(){

        this.setState(this.getState());


    },

    getState: function(){
        var topics = TopicStore.getPublicTopics();
        return {topics};
    },

    render: function() {
        var root = [];
        var processCategory = function(categories, level = 0) {

            return (categories.map(category =>{
                var child;

                if (category.categories.length > 0) {
                    console.log('resccurson!!', category.categories);
                    child = processCategory(category.categories, level+1);
                }
                console.log('child', child);
                return (
                <li>
                    {category.name}
                    <ul>{child}</ul>

                </li>);
            }));


        };

        root = processCategory(this.state.topics);
        return (
            <div className={this.props.className}>
                <div className="cq-public__listblock">
                    <h2>Age</h2>
                    <ul>
                        <li>3-5</li>
                        <li>5-7</li>
                        <li>7-11</li>
                        <li>11-14</li>
                        <li>14-16</li>
                        <li>16+</li>
                    </ul>
                </div>

                <div className="cq-public__listblock">

                    <h2>Subject</h2>
                    <ul>
                        {root}

                    </ul>
                </div>


            </div>
        );
    }

});

module.exports = CQPublicSort;
