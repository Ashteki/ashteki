import React from 'react';
import './AbilityTargetting.scss';

const BehaviourPromptControl = ({ behaviour }) => {
    const sideDetails = behaviour.text.side ? (
        <div>
            <b className='phg-side-action'> :</b> {behaviour.text.side}
        </div>
    ) : null;

    const mainDetails = (
        <div>
            <b className='phg-main-action'> :</b> {behaviour.text.main}
        </div>
    );


    return (
        <div className='prompt-control-behaviour'>
            <h3>Behaviour: {behaviour.value}</h3>
            {behaviour.text.mainFirst && mainDetails}
            {sideDetails}
            {!behaviour.text.mainFirst && mainDetails}
        </div>
    );
};

export default BehaviourPromptControl;
