var React = require('react');
var assign = require('object-assign');

var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');
var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');
var QuizStore = require('createQuizApp/stores/QuizStore');

var priceFormat = require('createQuizApp/utils/priceFormat');

var CQViewCreateAppTemplate = React.createClass({

    propTypes: {
        icon: React.PropTypes.object,
        app: React.PropTypes.object
    },


    getInitialState: function() {
        return {
            appInfo: {
                meta: {

                },
                extra: {
                    quizzes: []
                }
            }
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var appInfo = assign({}, this.state.appInfo, nextProps.app);
        var quizzes = nextProps.quizzes.map(qId => QuizStore.getQuizMeta(qId));
        this.setState({ appInfo, quizzes });
    },

    render: function() {
        var style = {
            background: this.state.appInfo.meta.colour
        };

        var buySentence = Number(this.state.appInfo.meta.price) === 0 ? 'Use for free' : `Get it for ${priceFormat(this.state.appInfo.meta.price)}`;
        return (

            <div style={style} className="cq-apptemplate">
                <div className="cq-app">
                    <CQQuizIcon
                        className="cq-app__icon"
                        name={this.state.appInfo.meta.name}
                        image={this.state.appInfo.meta.iconURL}
                        imageData={this.props.icon}/>

                    <div className="cq-app__info">
                        <h2>{this.state.appInfo.meta.name}</h2>
                        <div className="cq-app__price">{priceFormat(this.state.appInfo.meta.price)}</div>
                        <button className="cq-app__button" onClick={this.handleBuy}>
                            {buySentence}
                        </button>

                    </div>
                    <div className="cq-app__description">
                        <p>{this.state.appInfo.meta.description}</p>
                    </div>

                    <div className="cq-app__quizlist">
                        <CQViewQuizList
                            isQuizInteractive={true}
                            onQuizClick={this.handleDetails}
                            quizzes={this.state.quizzes}
                            sortBy="category">
                            <span className='cq-app__buttonextra' onClick={this.handlePreview}>
                                Preview
                            </span>
                            <span></span>
                        </CQViewQuizList>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = CQViewCreateAppTemplate;
