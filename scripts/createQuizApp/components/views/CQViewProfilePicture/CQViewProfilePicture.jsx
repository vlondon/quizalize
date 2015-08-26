var React = require('react');
var kolor = require('kolor');

var colours = [
    '#E16EC3',
    '#D4434A',
    '#DB2432',
    '#EF8465',
    '#F48868',
    '#ED6327',
    '#D28D4A',
    '#85A543',
    '#61D4CA',
    '#1F8DCC',
    '#2C71E8',
    '#1253CD',
    '#7739E7',
    '#964EEF',
    '#7C31DE',
    '#AB3FC5',
    '#B422CA'
];



var CQViewProfilePicture = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        name: React.PropTypes.string,
        picture: React.PropTypes.string
    },


    getDefaultProps: function() {
        return {
            width: 150,
            height: 150,
            className: ''
        };
    },

    getInitialState: function() {
        return this.getImage();
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getImage(nextProps));
    },

    getImage: function(props){
        props = props || this.props;
        var picture = props.picture;
        var width = parseInt(props.width, 10);
        var height = parseInt(props.height, 10);
        return {picture, width, height};

    },
    render: function() {
        var randomIndex, image;
        if (this.props.name){
            var n = this.props.name.toLowerCase();
            randomIndex = (n.charCodeAt(0) + 5 ) % colours.length;

        } else {
            randomIndex = Math.floor(Math.random() * colours.length);
        }

        var color = kolor(colours[randomIndex]);

        var style = {
            backgroundImage: `linear-gradient(${color.fadeOut(0.5)}, ${color.lighten(-0.2).fadeOut(0.5)})`,
            width: this.state.width,
            height: this.state.height
        };


        if (this.state.picture){
            style.backgroundImage = `url(${this.state.picture})`;
        } else {
            image = (<i className="zz-ic_quizalize cq-viewprofilepicture__placeholder"/>);
        }


        return (
            <div className={`cq-viewprofilepicture ${this.props.className} height-${this.state.height}`} style={style}>
                {image}
            </div>
        );
    }

});

module.exports = CQViewProfilePicture;
