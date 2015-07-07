var React = require('react');


var AppActions = require('createQuizApp/actions/AppActions');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');


var CQViewAppGrid = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        apps: React.PropTypes.array,
        editMode: React.PropTypes.bool,
        onClick: React.PropTypes.fund
    },

    getDefaultProps: function() {
        return {
            apps: [],
            editMode: false,
            onClick: function(){}
        };
    },

    handleDelete: function(app, event){
        event.preventDefault();
        event.stopPropagation();

        swal({
            title: 'Confirm Delete',
            text: 'Are you sure you want to permanently delete this app?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }, function(isConfirmed){
            if (isConfirmed){
                AppActions.deleteApp(app);
            }
        });
    },

    handleClick: function(app){
        this.props.onClick(app);
    },

    render: function() {



        var deleteButton = function(){};

        if (this.props.editMode){
            deleteButton = (app) =>{
                return (
                    <button className="btn btn-danger" onClick={this.handleDelete.bind(this, app)}>
                        Delete
                    </button>
                );
            };
        }

        return (
            <ul className={`cq-appgrid  ${this.props.className}`}>
                {this.props.apps.map( app => {
                    return (
                        <li className="cq-appgrid__app" key={app.uuid} onClick={this.handleClick.bind(this, app)}>
                            <CQQuizIcon className="cq-appgrid__appicon" name={app.meta.name} image={app.meta.iconURL}/>

                            <div className="cq-appgrid__appdetails">
                                <div className="cq-appgrid__appname">{app.meta.name}</div>
                            </div>
                            {deleteButton(app)}
                        </li>
                    );
                })}
            </ul>
        );
    }

});

module.exports = CQViewAppGrid;
