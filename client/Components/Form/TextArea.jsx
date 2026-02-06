import React from 'react';
import { Form, Col, Row } from 'react-bootstrap';

function TextArea({ name, label, fieldClass, rows, placeholder, value, onChange, onBlur, validationMessage, children }) {
    return (
        <Form.Group as={Row}>
            <Form.Label column sm='3' htmlFor={name}>
                {label}
            </Form.Label>
            <Col className={fieldClass}>
                <textarea
                    ref={name}
                    rows={rows}
                    className='form-control'
                    id={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                {validationMessage ? (
                    <span className='help-block'>{validationMessage} </span>
                ) : null}
            </Col>
            {children}
        </Form.Group>
    );
}

TextArea.displayName = 'TextArea';

export default TextArea;
