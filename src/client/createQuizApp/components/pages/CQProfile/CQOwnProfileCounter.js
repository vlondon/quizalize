/* @flow */
import React from 'react';
import { CQLink } from './../../../components';

let CQOwnProfileCounter = ({amount} : {amount: number}): any => {
    // TODO: Francesco to review the copy
    let copy;
    if (amount < 5){
        copy = `You can create ${5 - amount} more private quizzes`;
    } else {
        copy = `Your've reached the limit of 5 quizzes`;
    }
    return (
        <span>
            <i className="fa fa-info-circle"/>{' '}
            {copy} <br/>
        <CQLink href="/quiz/premium">Upgrade to Premium to have unlimited private quizzes</CQLink>
        </span>
    );
};

export default CQOwnProfileCounter;
