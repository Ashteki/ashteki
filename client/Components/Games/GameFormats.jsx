import React from 'react';
import { Trans } from 'react-i18next';
import { Form, Col } from 'react-bootstrap';
import { gameFormats } from '../../util';
import './GameFormats.scss';
import GameFormatInfo from './GameFormatInfo';
import classNames from 'classnames';

const GameFormats = ({ formProps }) => {
    return (
        <>
            <Form.Row>
                <Col xs={12} className='font-weight-bold'>
                    <Trans>Format</Trans>
                </Col>
                <Form.Group as={Col}>
                    {gameFormats.map((format) => {
                        const checkClasses = classNames('game-format', format.name);

                        return (
                            <Form.Check
                                className={checkClasses}
                                name='gameFormat'
                                key={format.name}
                                type='radio'
                                id={format.name}
                                label={format.label}
                                inline
                                onChange={formProps.handleChange}
                                value={format.name}
                                checked={formProps.values.gameFormat === format.name}
                            />
                        );
                    })}
                    <Form.Control.Feedback type='invalid'>
                        {formProps.errors.gameFormat}
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Col xs={12}>
                    <GameFormatInfo gameType={formProps.values.gameFormat} />
                </Col>
            </Form.Row>

        </>
    );
};

export default GameFormats;
