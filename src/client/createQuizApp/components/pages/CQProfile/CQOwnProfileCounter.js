/* @flow */
import React from 'react';
import CQLink from './../../../components/utils/CQLink';

let CQOwnProfileCounter = ({amount} : {amount: number}): any => {
    // TODO: Francesco to review the copy
    let copy;
    if (amount < 5){
        copy = `You can create ${5 - amount} more private quizzes`;
    } else {
        copy = `Your've reached the limit of 5 quizzes, please publish to the marketplace or get a premium account to create more`;
    }
    return (
        <span>
            <i className="fa fa-info-circle"/>{' '}
            {copy} <br/>
            <CQLink href="/quiz/premium">Upgrade to Premium to remove this limit</CQLink>
        </span>
    );
};

export default CQOwnProfileCounter;
