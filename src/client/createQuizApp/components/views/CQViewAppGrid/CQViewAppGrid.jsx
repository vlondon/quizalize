var React = require('react');


var AppActions = require('createQuizApp/actions/AppActions');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');


var CQViewAppGrid = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        apps: React.PropTypes.array,
        editMode: React.PropTypes.bool,
        onClick: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            apps: [],
            editMode: false,
            onClick: function(){}
        };
    },

    handlePublish: function(app, event){
        event.preventDefault();
        event.stopPropagation();
        if (app.meta.quizzes.split(',').length > 1){
            if (app.meta.iconURL && app.meta.iconURL.length > 0){
                swal({
                    title: 'Submitted',
                    text: 'Your Collection has been submitted for approval. You will receive an email once it has been approved',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                    cancelButtonText: 'No'
                }, function(){
                    AppActions.publishApp(app);
                });
            }
            else {
                swal("No icon..", "Collections must have an icon to be published on the marketplace", "error");

            }
        }
        else {
            swal("Not enough quizzes..", "Collections must contain more than 1 quiz to be published on the marketplace. If you wish to publish the quiz you can click on 'Make public' on your profile", "error");
        }
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


        var publishButton = function(){};
        var deleteButton = function(){};
        var status = function(){};

        if (this.props.editMode){
            deleteButton = (app) =>{
                return (
                    <button className="cq-appgrid__button btn btn-danger btn-sm" onClick={this.handleDelete.bind(this, app)}>
                        Delete
                    </button>
                );
            };
            publishButton =  (app) =>{
                if (app.meta.published === 'published') {
                } else if (app.meta.published === 'pending') {
                }
                else {
                    return (
                        <button className="cq-appgrid__button btn btn-info btn-sm" onClick={this.handlePublish.bind(this, app)}>
                            Publish
                        </button>
                    );
                }
            };
            status = (app) =>{
                if (app.meta.published === "published") {
                    return (
                        <span>(Published)</span>
                    );
                }
                else if (app.meta.published === "Pending") {
                    return (
                        <span>(Pending)</span>
                    );
                }
            };
        }

        return (
            <ul className={`cq-appgrid  ${this.props.className}`}>
                {this.props.apps.map( app => {
                    return (
                        <li className="cq-appgrid__app" key={app.uuid} onClick={this.handleClick.bind(this, app)}>
                            <CQQuizIcon className="cq-appgrid__appicon" name={app.meta.name} image={app.meta.iconURL}/>

                            <div className="cq-appgrid__appdetails">
                                <div className="cq-appgrid__appname">{app.meta.name} {status(app)}</div>
                            </div>
                            {deleteButton(app)}
                            {publishButton(app)}
                        </li>
                    );
                })}
            </ul>
        );
    }

});

module.exports = CQViewAppGrid;
