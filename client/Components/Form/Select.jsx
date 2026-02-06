import React, { useCallback } from 'react';
import _ from 'underscore';

function Select({ name, label, labelClass, fieldClass, value, onChange, onBlur, blankOption, options, validationMessage, button, valueKey, nameKey }) {
    const handleChange = useCallback((event) => {
        let selectedValue = _.find(options, (option) => {
            return option[valueKey || 'value'] === event.target.value;
        });

        onChange(selectedValue);
    }, [options, onChange, valueKey]);

    var selectOptions = [];

    if (blankOption) {
        var blankValue = blankOption[valueKey || 'value'];
        var blankName = blankOption[nameKey || 'name'];

        selectOptions.push(
            <option key='default' value={blankValue}>
                {blankName}
            </option>
        );
    }

    if (options) {
        options.forEach((option) => {
            var optionValue = option[valueKey || 'value'];
            var optionName = option[nameKey || 'name'];

            selectOptions.push(
                <option key={optionValue} value={optionValue}>
                    {optionName}
                </option>
            );
        });
    }

    var selectStyle = {};
    if (button) {
        selectStyle = {
            display: 'inline-block',
            width: '67%'
        };
    }

    return (
        <div className='form-group'>
            <label
                htmlFor={name}
                className={labelClass + ' control-label'}
            >
                {label}
            </label>
            <div className={fieldClass}>
                <select
                    ref={name}
                    style={selectStyle}
                    className='form-control'
                    id={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                >
                    {selectOptions}
                </select>
                {validationMessage ? (
                    <span className='help-block'>{validationMessage} </span>
                ) : null}
                {button ? (
                    <button
                        className='btn btn-default select-button'
                        onClick={button.onClick}
                    >
                        {button.text}
                    </button>
                ) : null}
            </div>
        </div>
    );
}

Select.displayName = 'Select';
};

export default Select;
