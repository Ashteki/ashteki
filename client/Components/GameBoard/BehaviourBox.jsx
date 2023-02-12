import React from 'react';
import Counter from './Counter';

const BehaviourBox = ({ value }) => {
    return (
        <div className='behaviour-box'>
            <Counter name='behaviour' showValue={true} value={value} />
        </div>
    );
};

export default BehaviourBox;
