import React from 'react';

let CQOwnProfileCounter = ({amount})=>{
    // TODO: Francesco to review the copy
    let copy;
    if (amount > 0){
        copy = `You can create ${5 - amount} more private quizzes`;
    } else {
        copy = `Your've reached the limit of 5 quizzes, please publish to the marketplace or get a premium account to create more`;
    }
    return (<span>{copy}</span>);
};

export default CQOwnProfileCounter;
