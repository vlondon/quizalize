var React = require('react');
var kolor = require('kolor');
import imageUrlParser from './../../utils/imageUrlParser';

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


var CQQuizIcon = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        name: React.PropTypes.string,
        image: React.PropTypes.string,
        imageData: React.PropTypes.object,
        children: React.PropTypes.element
    },

    getInitialState: function() {
        return this.getImage();
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.imageData){
            this.setState({imageData: nextProps.imageData});
        } else {
            this.setState(this.getImage(nextProps));
        }
    },

    getImage: function(props){
        props = props || this.props;

        var image = imageUrlParser(props.image);

        return {image};

    },

    resetLocalImage: function(){
        var image = undefined;
        var imageData = undefined;
        this.setState({image, imageData});
    },

    render: function() {
        var randomIndex, image;
        if (this.props.name){
            var n = this.props.name.toLowerCase();
            randomIndex = (n.charCodeAt(0) + 5 ) % colours.length;

        } else {
            randomIndex = 0;
        }



        var color = kolor(colours[randomIndex]);
        var style = {
            backgroundImage: `linear-gradient(${color.fadeOut(0.5)}, ${color.lighten(-0.2).fadeOut(0.5)})`
        };

        var detectYoutubeThumbnail = function(img){
            return img.indexOf("youtube") === -1 ? img : '//img.youtube.com/vi/' + img.split('/')[4] + "/0.jpg";
        };

        if (this.state.imageData) {
            //image = (<img src={this.state.imageData}/>);
            style.backgroundImage = `url(${this.state.imageData})`;
            console.info('this.props.imageData', this.props.imageData);
        } else if (this.state.image){
            style.backgroundImage = `url(${detectYoutubeThumbnail(this.state.image)})`;
        } else if (this.props.children) {
            image = this.props.children;

        } else {
            image = (<img src="/img/ui-create/icon_base.png" alt="" width="100%" height="100%"/>);
        }



        return (
            <div className={this.props.className} style={style}>
                {image}
            </div>
        );
    }

});

module.exports = CQQuizIcon;
