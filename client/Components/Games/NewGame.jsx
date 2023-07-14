import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

import Panel from '../Site/Panel';
import GameFormats from './GameFormats';

// import GameOptions from './GameOptions';
// import GameTypes from './GameTypes';
import { getStandardControlProps } from '../../util';
import { cancelNewGame, sendSocketMessage } from '../../redux/actions';
import TimeLimitIcon from '../../assets/img/Timelimit.png';

import './NewGame.scss';

const GameNameMaxLength = 64;

/**
 * @typedef NewGameProps
 * @property {any} [tournament] Whether or not we're operating under the tournament UI
 * @property {import("../../typedefs").GameType} [defaultGameType] The default game type to use
 * @property {number} [defaultTimeLimit] The default time limit to use
 * @property {boolean} [defaultPrivate] Whether or not the game defaults to private
 * @property {function(string): string} [getParticipantName] A function to get the participant name of a participant in a tournament
 * @property {any[]} [matches] A list of tournament matches
 * @property {function(boolean): void} [onClosed] A callback to be called when the window is closed
 */

/**
 * @param {NewGameProps} props
 */
const NewGame = ({
    tournament,
    defaultGameType,
    defaultPrivate,
    defaultTimeLimit,
    getParticipantName,
    matches,
    onClosed
}) => {
    const lobbySocket = useSelector((state) => state.lobby.socket);
    const username = useSelector((state) => state.account.user?.username);
    const showSolo = useSelector((state) => state.account.user?.permissions.isAdmin);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const schema = yup.object({
        name: yup
            .string()
            .required(t('You must specify a name for the game'))
            .max(
                GameNameMaxLength,
                t(`Game name must be less than ${GameNameMaxLength} characters`)
            ),
        password: yup.string().optional(),
        label: yup.string().optional(),
        gameTimeLimit: yup
            .number()
            .min(1, t('Games must be at least 10 minutes long'))
            .max(120, t('Games must be less than 2 hours')),
        gameType: yup.string().required()
    });

    const initialValues = {
        name: `${username}'s game`,
        password: '',
        label: '',
        allowSpectators: true,
        gameType: defaultGameType || 'casual',
        gameFormat: 'constructed',
        useGameTimeLimit: !!defaultTimeLimit,
        gameTimeLimit: defaultTimeLimit || 50,
        clockType: 'timer',
        gamePrivate: defaultPrivate,
        ranked: false,
        solo: false
    };

    const options = [
        { name: 'ranked', label: 'Ranked (affects Elo rating)' },
        { name: 'allowSpectators', label: t('Allow spectators') },
        { name: 'useGameTimeLimit', label: 'Use a time limit (mins) with sudden death rules' },
        { name: 'showHand', label: t('Show hands to spectators') },
        { name: 'openHands', label: 'Play with open hands' }
    ];
    if (showSolo) {
        options.push({ name: 'solo', label: 'Play solo' });
    }

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
        setFieldValue('clockType', value);
        setFieldValue('gameTimeLimit', defaultTime[value]);
    };

    const onOptionChange = (option, value, setFieldValue) => {
        // setFieldValue("clockType", value);
        // setFieldValue("gameTimeLimit", defaultTime[value]);
    };

    const handlePresetChange = (value, setFieldValue) => {
        // update the values to the presets for this game type
        switch (value) {
            case 'FFL':
                setFieldValue('ranked', false);
                setFieldValue('useGameTimeLimit', false);

                break;

            case 'PHX':
                setFieldValue('ranked', true);
                setFieldValue('useGameTimeLimit', true);
                setFieldValue('gameTimeLimit', 50);
                setFieldValue('gameFormat', 'constructed');

                break;

            default:
                break;
        }
        setFieldValue('label', value);
    };

    if (!lobbySocket) {
        return (
            <div>
                <Trans>
                    The connection to the lobby has been lost, waiting for it to be restored. If
                    this message persists, please refresh the page.
                </Trans>
            </div>
        );
    }

    return (
        <Panel title={t('New game')}>
            <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                    if (tournament) {
                        for (let match of matches) {
                            dispatch(
                                sendSocketMessage('newgame', {
                                    ...values,
                                    name: `${getParticipantName(
                                        match.player1_id
                                    )} vs ${getParticipantName(match.player2_id)}`,
                                    tournament: true
                                })
                            );

                            onClosed(true);
                        }
                    } else {
                        dispatch(sendSocketMessage('newgame', values));
                    }
                }}
                initialValues={initialValues}
            >
                {(formProps) => (
                    <Form
                        onSubmit={(event) => {
                            event.preventDefault();
                            formProps.handleSubmit(event);
                        }}
                    >
                        {
                            <>
                                {!tournament && (
                                    <Form.Row>
                                        <Form.Group as={Col} lg='8' controlId='formGridGameName'>
                                            <Form.Label>{t('Name')}</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder={t('Game Name')}
                                                maxLength={GameNameMaxLength}
                                                {...getStandardControlProps(formProps, 'name')}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {formProps.errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <div className='col-md-4 inline'>
                                            <Form.Label>League Presets</Form.Label>
                                            <select
                                                className='form-control'
                                                // value={this.state.selectedTerm}
                                                onChange={(e) => {
                                                    handlePresetChange(
                                                        e.target.value,
                                                        formProps.setFieldValue
                                                    );
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <option value=''></option>
                                                <option value='FFL'>First Five League</option>
                                                <option value='PHX'>Phoenix League</option>
                                            </select>
                                        </div>
                                    </Form.Row>
                                )}
                                <GameFormats formProps={formProps} />
                                <Form.Group>
                                    <Form.Row>
                                        <Col xs={12} className='font-weight-bold'>
                                            <Trans>Options</Trans>
                                        </Col>
                                        {options.map((option) => (
                                            <Col key={option.name} lg='6'>
                                                <Form.Check
                                                    type='switch'
                                                    id={option.name}
                                                    label={option.label}
                                                    // inline
                                                    onChange={(e) => {
                                                        formProps.handleChange(e);
                                                        onOptionChange(
                                                            option.name,
                                                            e.value,
                                                            formProps.setFieldValue
                                                        );
                                                    }}
                                                    value='true'
                                                    checked={formProps.values[option.name]}
                                                ></Form.Check>
                                            </Col>
                                        ))}
                                    </Form.Row>
                                </Form.Group>
                                {formProps.values.useGameTimeLimit && (
                                    <Form.Row>
                                        <Form.Group>
                                            <Form.Label>
                                                <span>
                                                    <img
                                                        src={TimeLimitIcon}
                                                        className='game-list-icon'
                                                        alt={'Time limit used'}
                                                    />
                                                </span>
                                                &nbsp;
                                                {t('Time Limit')}
                                            </Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder={t('Enter time limit')}
                                                {...getStandardControlProps(
                                                    formProps,
                                                    'gameTimeLimit'
                                                )}
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
                                                        onClockChange(
                                                            type.name,
                                                            formProps.setFieldValue
                                                        );
                                                    }}
                                                    value={type.name}
                                                    checked={
                                                        formProps.values.clockType === type.name
                                                    }
                                                ></Form.Check>
                                            ))}
                                        </Form.Group>
                                    </Form.Row>
                                )}
                            </>
                        }
                        {/* {!tournament && <GameTypes formProps={formProps} />} */}
                        {
                            <Row>
                                <Form.Group as={Col} sm={6}>
                                    <Form.Label>{t('Password')}</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder={t('Enter a password')}
                                        autoComplete='off'
                                        {...getStandardControlProps(formProps, 'password')}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} sm={6}>
                                    <Form.Label>{t('Label (for tournaments)')}</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder={t('Enter a label')}
                                        {...getStandardControlProps(formProps, 'label')}
                                    />
                                </Form.Group>
                            </Row>
                        }
                        <div className='text-center newgame-buttons'>
                            <Button variant='success' type='submit'>
                                <Trans>Create</Trans>
                            </Button>
                            <Button
                                variant='primary'
                                onClick={() => {
                                    dispatch(cancelNewGame());
                                    if (onClosed) {
                                        onClosed(false);
                                    }
                                }}
                            >
                                <Trans>Cancel</Trans>
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Panel>
    );
};

NewGame.displayName = 'NewGame';
export default NewGame;
