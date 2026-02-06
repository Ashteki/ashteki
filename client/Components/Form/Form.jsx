import React, { useEffect, useState, useCallback, useRef } from 'react';
import $ from 'jquery';

import Input from './Input.jsx';

import formFields from './formFields.json';

import { withTranslation } from 'react-i18next';

function Form({ name, onSubmit, apiLoading, buttonClass, buttonText, t, children }) {
    const [formState, setFormState] = useState({});
    const validatorRef = useRef(null);

    useEffect(() => {
        $.validator.unobtrusive.parse('form');
        validatorRef.current = $('form').validate();

        return () => {
            if (validatorRef.current) {
                validatorRef.current.destroy();
            }
        };
    }, []);

    const handleChange = useCallback((field, event) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: event.target.value
        }));
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();

        if (!$('form').valid()) {
            return;
        }

        if (onSubmit) {
            onSubmit(formState);
        }
    }, [formState, onSubmit]);

    const translateValidationProps = useCallback((field) => {
        let validationAttributes = {};

        if (field.validationProperties) {
            for (let key of Object.keys(field.validationProperties)) {
                if (
                    key === 'data-val-required' ||
                    key === 'data-val-length' ||
                    key === 'data-val-equalto' ||
                    key === 'data-val-regex'
                ) {
                    validationAttributes[key] = t(field.validationProperties[key]);
                } else {
                    validationAttributes[key] = field.validationProperties[key];
                }
            }
        }

        return validationAttributes;
    }, [t]);

    const fieldsToRender = formFields[name].map((field) => {
        return (
            <Input
                key={field.name}
                name={field.name}
                label={t(field.label)}
                placeholder={t(field.placeholder)}
                validationAttributes={translateValidationProps(field)}
                fieldClass={field.fieldClass}
                labelClass={field.labelClass}
                type={field.inputType}
                onChange={(event) => handleChange(field.name, event)}
                value={formState[field.name] || ''}
            />
        );
    });

    return (
        <form className='form form-horizontal' onSubmit={handleSubmit}>
            {fieldsToRender}
            {children}
            <div className='form-group'>
                <div className={buttonClass || 'col-sm-offset-4 col-sm-3'}>
                    <button
                        type='submit'
                        className='btn btn-primary'
                        disabled={apiLoading}
                    >
                        {t(buttonText) || t('Submit')}{' '}
                        {apiLoading ? (
                            <span className='spinner button-spinner' />
                        ) : null}
                    </button>
                </div>
            </div>
        </form>
    );
}

Form.displayName = 'Form';

export default withTranslation()(Form);
