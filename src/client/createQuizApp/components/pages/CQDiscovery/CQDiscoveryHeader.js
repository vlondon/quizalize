import React from 'react';
// TODO Francesco check the copy
let CQDiscoveryHeader = (props) => {

    let header;
    if (props.showHeader) {
        header = (<div className="cq-discovery__header__offer">
            Offer - Free Upgrade
        </div>);
    }
    return (
        <div className="cq-discovery__header">
            {header}
            <div className="cq-discovery__education__brand">
                <img src={require('./../../../../assets/cq_discovery__logo.svg')} alt=""/>
            </div>
            <div className="cq-discovery__header__banner">
                Get Quizalize Premium <br/>
                Free for 1 year
            </div>

            <p>
                Our partners Discovery Education are offering a year’s
                use of Quizalize Unlimited completely free for one year.
                Create and use an unlimited number of quizzes, with unlimited classes,
                and get access to our advanced data analysis tools.
            </p>

            <a href="http://www.zzish.com" className="cq-discovery__header__cta">
                Take the survey
                <small>
                    to get Quizalize Unlimited, free
                </small>
            </a>
        </div>
    );
};

export default CQDiscoveryHeader;
