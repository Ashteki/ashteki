import React from 'react';
import './AbilityTargetting.scss';

const BehaviourPromptControl = ({ behaviour }) => {
    return (
        <div className='prompt-control-behaviour'>
            <h3>Behaviour: {behaviour.value}</h3>
            {behaviour.text.side && (
                <div>
                    <b className='phg-side-action'> :</b> {behaviour.text.side}
                </div>
            )}
            <div>
                <b className='phg-main-action'> :</b> {behaviour.text.main}
            </div>
        </div>
    );
};

export default BehaviourPromptControl;
