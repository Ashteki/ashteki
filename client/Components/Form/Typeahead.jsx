import { Typeahead } from 'react-bootstrap-typeahead';
import React, { useRef } from 'react';

function InternalTypeahead({ label, name, labelClass, fieldClass, options, labelKey, emptyLabel, onChange, placeholder, autoFocus, dropup, minLength, onInputChange, submitFormOnEnter, onKeyDown, disabled, validationMessage, children, noGroup }) {
    const typeaheadRef = useRef(null);

    const clear = () => {
        typeaheadRef.current?.getInstance().clear();
    };

    // Expose clear method on ref if needed
    typeaheadRef.current = { clear };

    const labelElement = label ? (
        <label htmlFor={name} className={labelClass + ' control-label'}>
            {label}
        </label>
    ) : null;

    const control = (
        <div>
            {labelElement}
            <div className={fieldClass}>
                <Typeahead
                    ref={typeaheadRef}
                    options={options}
                    labelKey={labelKey}
                    emptyLabel={emptyLabel}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    dropup={dropup}
                    minLength={minLength}
                    onInputChange={onInputChange}
                    submitFormOnEnter={submitFormOnEnter}
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                />
                {validationMessage ? (
                    <span className='help-block'>{validationMessage} </span>
                ) : null}
            </div>
            {children}
        </div>
    );

    if (noGroup) {
        return control;
    }

    return <div className='form-group'>{control}</div>;
}

InternalTypeahead.displayName = 'Typeahead';

export default InternalTypeahead;
