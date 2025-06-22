import React from 'react';
import AbilityTargeting from './AbilityTargeting';
import OptionsSelect from './OptionsSelect';
import BehaviourPromptControl from './BehaviourPromptControl';

function ActivePromptControls({ controls, buttons, onMouseOver, onMouseOut, onOptionSelected }) {
    return controls.map((control) => {
        switch (control.type) {
            case 'targeting':
                return (
                    <AbilityTargeting
                        key='targeting'
                        onMouseOut={onMouseOut}
                        onMouseOver={onMouseOver}
                        source={control.source}
                        targets={control.targets}
                        trigger={control.trigger}
                    />
                );
            case 'options-select':
                return (
                    <OptionsSelect
                        key='options-select'
                        options={buttons}
                        onOptionSelected={onOptionSelected}
                    />
                );
            case 'behaviour':
                return <BehaviourPromptControl key="behaviour" behaviour={control.behaviour} />;
            default:
                return null;
        }
    });
}

export default ActivePromptControls;