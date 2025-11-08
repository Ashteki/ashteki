import React from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { gameFormats } from '../../util';
import './GameFormats.scss';
import GameFormatInfo from './GameFormatInfo';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

const GameFormats = ({ formProps }) => {
    const showSolo = useSelector((state) => state.lobby.newGameType === 'chimera');

    let formats = [...gameFormats];
    if (!showSolo) {
        formats = formats.filter((f) => f.name !== 'solo');
    }
    return (
        <>
            <Row>
                <h3> Format</h3>
                <Form.Group >
                    {formats.map((format) => {
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
            </Row>
            <Row>
                <Col>
                    <GameFormatInfo gameType={formProps.values.gameFormat} />
                </Col>
            </Row>

        </>
    );
};

export default GameFormats;
