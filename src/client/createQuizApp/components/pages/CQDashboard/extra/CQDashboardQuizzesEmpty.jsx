/* @flow */
var React = require('react');
var CQLink = require('./../../../../components/utils/CQLink');
var CQDashboardQuizzesEmpty = React.createClass({

    render: function() : any {
        return (
            <div className="cq-dashboard__empty">
                <h3>Oh no!</h3>
                    <p>It looks like you don't have any quiz yet.
                    <br/>
                    <CQLink href="/quiz/create">
                        Why don't you create a new one?
                    </CQLink>
                </p>
            </div>
        );
    }

});

module.exports = CQDashboardQuizzesEmpty;
