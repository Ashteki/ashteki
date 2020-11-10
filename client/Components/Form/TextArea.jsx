import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row } from 'react-bootstrap';

class TextArea extends React.Component {
    render() {
        return (
            <Form.Group as={Row}>
                <Form.Label column sm='3' htmlFor={this.props.name}>
                    {this.props.label}
                </Form.Label>
                <Col className={this.props.fieldClass}>
                    <textarea
                        ref={this.props.name}
                        rows={this.props.rows}
                        className='form-control'
                        id={this.props.name}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        onBlur={this.props.onBlur}
                    />
                    {this.props.validationMessage ? (
                        <span className='help-block'>{this.props.validationMessage} </span>
                    ) : null}
                </Col>
                {this.props.children}
            </Form.Group>
        );
    }
}

TextArea.displayName = 'TextArea';
TextArea.propTypes = {
    children: PropTypes.object,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    rows: PropTypes.string,
    validationMessage: PropTypes.string,
    value: PropTypes.string
};

export default TextArea;
