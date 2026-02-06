import React, { useState, useCallback } from 'react';

import Typeahead from '../Form/Typeahead';

function TypeaheadLookup({ onValueSelected, values }) {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = useCallback((value) => {
        setSelectedValue(value[0]);
    }, []);

    const handleDoneClick = useCallback(() => {
        if (onValueSelected) {
            onValueSelected(selectedValue);
        }
    }, [onValueSelected, selectedValue]);

    return (
        <div>
            <Typeahead
                labelKey={'label'}
                options={values}
                dropup
                onChange={handleChange}
            />
            <button type='button' onClick={handleDoneClick} className='btn btn-primary'>
                Done
            </button>
        </div>
    );
}

TypeaheadLookup.displayName = 'TypeaheadLookup';

export default TypeaheadLookup;
