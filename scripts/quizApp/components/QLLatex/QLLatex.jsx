var React = require('react');
var TeX = require('react-components/js/tex.jsx');


var detectLatex = function(string, regularExpression){

    var stripDollars = function(stringToStrip){

        if (stringToStrip[1] === '$'){
            stringToStrip = stringToStrip.slice(2, -2);
        } else {
            stringToStrip = stringToStrip.slice(1, -1);
        }

        return stringToStrip;

    };
    var result = [];
    console.log('regularExpression', regularExpression);

    var latexMatch = string.match(regularExpression);
    var stringWithoutLatex = string.split(regularExpression);

    if (latexMatch){

        stringWithoutLatex.forEach(function(s, index) {
            result.push({
                string: s,
                type: 'text'
            });
            if(latexMatch[index]) {
                result.push({
                    string: stripDollars(latexMatch[index]),
                    type: 'latex'
                });
            }
        });


    } else {
        result.push({
            string: string,
            type: 'string'
        });
    }

    console.log('result', string, result);

    return result;



};

var QLLatex = React.createClass({

    propTypes: {
        children: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        var patternToDected = /\$\$[\s\S]+?\$\$|\$[\s\S]+?\$/g;
        var content = detectLatex(this.props.children, patternToDected);

        return {
            content
        };
    },

    render: function() {

        var content = this.state.content.map(c => {
            if (c.type === 'latex') {
                return (<TeX>{c.string}</TeX>);
            } else {
                return (<span>{c.string}</span>);
            }
        });

        return (<string>
            {content}
        </string>);

    }

});

module.exports = QLLatex;
