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



var CQQuizIcon = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        name: React.PropTypes.string,
        image: React.PropTypes.string,
        children: React.PropTypes.element
    },

    getInitialState: function() {
        var image = this.props.image;

        if (this.props.image && this.props.image.indexOf('http') === -1) {
            image = 'https://s3-eu-west-1.amazonaws.com/zzish-upload-assets/' + this.props.image;
        }
        return this.getImage();
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getImage(nextProps));
    },

    getImage: function(props){
        props = props || this.props;

        var image = props.image;
        if (props.image && props.image.indexOf('http') === -1) {
            image = 'https://s3-eu-west-1.amazonaws.com/zzish-upload-assets/' + this.props.image;
        }

        return {image};

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
            backgroundImage: `linear-gradient(${color.fadeOut(0.5)}, ${color.lighten(-0.2).fadeOut(0.5)})`
        };

        var detectYoutubeThumbnail = function(img){
            console.log("imgmggmmg", img);
            return img.indexOf("youtube") === -1 ? img : 'http://img.youtube.com/vi/' + img.split('/')[4] + "/0.jpg";
        };
        if (this.state.image){
            style.backgroundImage = `url(${detectYoutubeThumbnail(this.state.image)})`;
        } else if (this.props.children) {
            image = this.props.children;
        } else {
            image = (<img src="/img/ui-create/icon_base.png" alt=""/>);
        }



        return (
            <div className={this.props.className} style={style}>
                {image}
            </div>
        );
    }

});

module.exports = CQQuizIcon;
