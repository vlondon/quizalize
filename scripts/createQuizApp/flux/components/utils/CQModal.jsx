var React = require('react');

var CQModal = React.createClass({

    getInitialState: function() {
        return {
            isVisible: false
        };

    },

    componentDidMount: function() {
        // setTimeout(()=>{
        //     this.setState({isVisible: true});
        // }, 2000);
    },

    render: function() {

        var className = this.state.isVisible ? 'modal fade in' : 'modal fade';
        var display = this.state.isVisible ? 'block' : 'none';
        return (
            <div tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" id="myModal" className={className}
                style={{display}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <input type="hidden" value="" id="modalUuid"/>
                            <button data-dismiss="modal" aria-label="Close" className="close"><span aria-hidden="true">&times;</span></button>
                            <h4 id="modalTitle" className="modal-title"></h4>
                        </div>
                        <div className="modal-body">
                            <p id="modalMessage"></p>
                        </div>
                        <div className="modal-footer">
                            <button data-dismiss="modal" id="closeButton" className="btn btn-default">Close</button>
                            <button id="confirmButton" data-dismiss="modal" ng-click="nctrl.confirmed()" className="btn btn-primary">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = CQModal;
