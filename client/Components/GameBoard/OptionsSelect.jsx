import React, { useState, useEffect, useCallback } from 'react';

import { withTranslation } from 'react-i18next';

function OptionsSelect({ options, onOptionSelected, t }) {
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (options && options.length > 0) {
            setSelectedOption('' + options[0].arg);
        } else {
            setSelectedOption(-1);
        }
    }, [options]);

    const handleChange = useCallback((event) => {
        setSelectedOption(event.target.value);
    }, []);

    const handleDoneClicked = useCallback((event) => {
        event.preventDefault();

        if (onOptionSelected) {
            onOptionSelected(selectedOption);
        }
    }, [selectedOption, onOptionSelected]);

    return (
        <div>
            <select className='form-control' onChange={handleChange}>
                {options.map((option) => (
                    <option
                        key={option.value}
                        selected={selectedOption === '' + option.arg}
                        value={option.arg}
                    >
                        {option.text}
                    </option>
                ))}
            </select>
            <button
                className='btn btn-default prompt-button btn-stretch option-button'
                onClick={handleDoneClicked}
            >
                Done{' '}
            </button>
        </div>
    );
}

OptionsSelect.displayName = 'OptionsSelect';

export default withTranslation()(OptionsSelect);
