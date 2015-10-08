/* @flow */
import React, { PropTypes } from 'react';
import type {UserType} from './../../../../../types/UserType';
import TransactionActions from './../../../actions/TransactionActions';

import moment from 'moment';
type Props = {
    user: UserType;
};

class CQSettingsSubscriptions extends React.Component {

    props: Props;

    handleMonthlySubscription(){
        TransactionActions.buyMonthlySubscription();
    }

    render () : any {
        let selected = (id, className) => {
            if (this.props.user.attributes.accountType === id){
                console.log('this.props.user.attributes.accountType === id', this.props.user.attributes.accountType, id);
                return `${className} ${className}--selected`;
            }
            return className;
        };
        return (
            <div className="cq-settings__subsoptions">
                <div className={selected(0, "cq-settings__subsoptions__free")}>
                    <div className="cq-settings__subsoptions__price">
                        Free
                    </div>
                    Start using our product for free!
                </div>
                <div className={selected(1,"cq-settings__subsoptions__premium")} onClick={this.handleMonthlySubscription}>
                    <div className="cq-settings__subsoptions__price">
                        Premium

                        <small>$7.49 Per month</small>
                    </div>
                    <div>Unlock all the features</div>

                    <small><i>Valid until <br/>{moment(this.props.user.attributes.accountTypeExpiration).format("Do MMM YY")}</i></small>

                </div>
                <div className={selected(2, "cq-settings__subsoptions__school")}>
                    <div className="cq-settings__subsoptions__price">
                        Contact us
                    </div>

                    Unlock all the potential for all your teachers in your school
                </div>
            </div>
        );
    }
}

CQSettingsSubscriptions.propTypes = {
    user: PropTypes.object.isRequired
};

export default CQSettingsSubscriptions;
