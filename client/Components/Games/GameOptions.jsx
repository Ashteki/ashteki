import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Form, Col } from 'react-bootstrap';
import { getStandardControlProps } from '../../util';
import TimeLimitIcon from '../../assets/img/Timelimit.png';

const GameOptions = ({ formProps }) => {
    const { t } = useTranslation();

    const options = [
        { name: 'allowSpectators', label: t('Allow spectators') },
        { name: 'showHand', label: t('Show hands to spectators') },
        { name: 'muteSpectators', label: t('Mute spectators') },
        { name: 'useGameTimeLimit', label: 'Use a time limit (mins) with sudden death rules' }
        // { name: 'trackElo', label: t('Track Elo ratings') }
    ];

    let clockType = [
        { name: 'timer', label: t('Shared') },
        { name: 'chess', label: t('Chess Clock') }
    ];

    const defaultTime = {
        timer: '50',
        chess: '15',
        hourglass: '15',
        byoyomi: '0'
    };

    const onClockChange = (value, setFieldValue) => {
        setFieldValue("clockType", value);
        setFieldValue("gameTimeLimit", defaultTime[value]);
    }

    return (
        <>
            <Form.Group>
                <Form.Row>
                    <Col xs={12} className='font-weight-bold'>
                        <Trans>Options</Trans>
                    </Col>
                    {options.map((option) => (
                        <Col key={option.name} lg='4'>
                            <Form.Check
                                type='switch'
                                id={option.name}
                                label={option.label}
                                inline
                                onChange={formProps.handleChange}
                                value='true'
                                checked={formProps.values[option.name]}
                            ></Form.Check>
                        </Col>
                    ))}
                </Form.Row>
            </Form.Group>
            {formProps.values.useGameTimeLimit && (
                <Form.Row>
                    <Form.Group >

                        <Form.Label>                <span>
                            <img
                                src={TimeLimitIcon}
                                className='game-list-icon'
                                alt={'Time limit used'}
                            />
                        </span>&nbsp;
                            {t('Time Limit')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('Enter time limit')}
                            {...getStandardControlProps(formProps, 'gameTimeLimit')}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {formProps.errors.gameTimeLimit}
                        </Form.Control.Feedback>

                        {clockType.map((type) => (
                            <Form.Check
                                name='clockType'
                                key={type.name}
                                type='radio'
                                id={type.name}
                                label={type.label}
                                inline
                                onChange={(e) => {
                                    formProps.handleChange(e);
                                    onClockChange(type.name, formProps.setFieldValue);
                                }}
                                value={type.name}
                                checked={formProps.values.clockType === type.name}
                            ></Form.Check>
                        ))}

                    </Form.Group>
                </Form.Row>
            )}
        </>
    );
};

export default GameOptions;
