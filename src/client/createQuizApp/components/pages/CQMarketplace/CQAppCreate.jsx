var React = require('react');


var CQAppGrid = React.createClass({



    getInitialState: function() {

        return {};
    },



    render: function() {

        return (
            <div className="cq-appcreate">
                <li className="cq-appgrid__app">
                    <div className="cq-appgrid__appicon" style={{backgroundImage: 'url(https://s3-eu-west-1.amazonaws.com/zzish-upload-assets/44ddfbd4-7bec-4691-8089-9bde07766111/id_02c32233-1f9f-4a53-b821-7d7f3baed00c.png)'}}/>
                    <div className="cq-appgrid__appdetails" >
                        <div className="cq-appgrid__appname">
                            KS3 Computing Sampler
                        </div>
                        <div className="cq-appgrid__appquizzes" >
                            5 Quizzes
                        </div>
                        <div className="cq-appgrid__appprice" >
                            Free
                        </div>

                    </div>

                </li>

            </div>
        );


    }

});

module.exports = CQAppGrid;
