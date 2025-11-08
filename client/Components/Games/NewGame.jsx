import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

import GameFormats from './GameFormats';

// import GameOptions from './GameOptions';
import { getGameTypeLabel, getStandardControlProps } from '../../util';
import { cancelNewGame, sendSocketMessage } from '../../redux/actions';
import TimeLimitIcon from '../../assets/img/Timelimit.png';

import './NewGame.scss';
import PictureButton from '../Lobby/PictureButton';
import { PatreonStatus } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const GameNameMaxLength = 64;

/**
 * @typedef NewGameProps
 * @property {import("../../typedefs").GameType} [defaultGameType] The default game type to use
 * @property {number} [defaultTimeLimit] The default time limit to use
 * @property {boolean} [defaultPrivate] Whether or not the game defaults to private
 */

/**
 * @param {NewGameProps} props
 */
const NewGame = ({ defaultGameType, defaultPrivate, defaultTimeLimit, onClosed }) => {
    const lobbySocket = useSelector((state) => state.lobby.socket);
    const username = useSelector((state) => state.account.user?.username);
    const newGameType = useSelector((state) => state.lobby.newGameType);
    const user = useSelector((state) => state.account.user);
    const allowPremium = user?.patreon === PatreonStatus.Pledged || user?.permissions?.isSupporter;

    const dispatch = useDispatch();

    const schema = yup.object({
        name: yup
            .string()
            .required('You must specify a name for the game')
            .max(
                GameNameMaxLength,
                `Game name must be less than ${GameNameMaxLength} characters`
            ),
        password: yup.string().optional(),
        label: yup.string().optional(),
        gameTimeLimit: yup
            .number()
            .min(1, 'Games must be at least 10 minutes long')
            .max(120, 'Games must be less than 2 hours'),
        gameType: yup.string().required()
    });

    const initialValues = {
        name: `${username}'s game`,
        password: '',
        label: '',
        allowSpectators: true,
        gameType: defaultGameType || 'casual',
        newGameType: newGameType,
        gameFormat: newGameType === 'chimera' ? 'solo' : 'constructed',
        useGameTimeLimit: !!defaultTimeLimit,
        gameTimeLimit: defaultTimeLimit || 30,
        clockType: 'chess',
        gamePrivate: defaultPrivate,
        ranked: false,
        solo: newGameType === 'chimera',
        saveReplay: false
    };

    const options = [
        { name: 'ranked', label: 'Ranked (affects Elo rating)' },
        { name: 'allowSpectators', label: 'Allow spectators' },
        { name: 'useGameTimeLimit', label: 'Use a time limit (mins) with sudden death rules' },
        { name: 'showHand', label: 'Show hands to spectators' },
        { name: 'openHands', label: 'Play with open hands' }
    ];

    if (allowPremium) {
        options.push({ name: 'saveReplay', label: 'Save a replay' });
    }
    const soloOptions = [{ name: 'allowSpectators', label: 'Allow spectators' }];

    let clockType = [
        { name: 'chess', label: 'Chess Clock (each)' },
        { name: 'timer', label: 'Shared' }
    ];

    const defaultTime = {
        timer: '50',
        chess: '30',
        hourglass: '15',
        byoyomi: '0'
    };

    const onClockChange = (value, setFieldValue) => {
        setFieldValue('clockType', value);
        setFieldValue('gameTimeLimit', defaultTime[value]);
    };

    const handlePresetChange = (value, setFieldValue) => {
        // update the values to the presets for this game type
        switch (value) {
            case 'FFL':
                setFieldValue('ranked', false);
                setFieldValue('saveReplay', false);
                setFieldValue('useGameTimeLimit', false);

                break;

            case 'PHX':
                setFieldValue('ranked', true);
                setFieldValue('saveReplay', true);
                setFieldValue('useGameTimeLimit', true);
                setFieldValue('clockType', 'chess');
                setFieldValue('gameTimeLimit', 30);
                setFieldValue('gameFormat', 'constructed');

                break;

            default:
                break;
        }
        setFieldValue('label', value);
    };

    const getOptionToggle = (option, formProps) => {
        return (
            <Form.Check
                type='switch'
                id={option.name}
                label={option.label}
                disabled={option.disabled}
                // inline
                onChange={(e) => {
                    formProps.handleChange(e);
                    if (option.name === 'ranked') {
                        formProps.setFieldValue('saveReplay', e.target.checked);
                    }
                }}
                value='true'
                checked={formProps.values[option.name]}
            />
        );
    };

    if (!lobbySocket) {
        return (
            <div>
                The connection to the lobby has been lost, waiting for it to be restored. If
                this message persists, please refresh the page.
            </div>
        );
    }

    return (
        <div>
            <Formik
                enableReinitialize={true}
                validationSchema={schema}
                onSubmit={(values) => {
                    dispatch(sendSocketMessage('newgame', values));
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
                                <div className='newgame-header'>
                                    <PictureButton
                                        text={getGameTypeLabel(newGameType)}
                                        // header='Premium'
                                        disabled={true}
                                        imageClass={newGameType}
                                    />

                                    <Col>
                                        <Form.Group controlId='formGridGameName' className='mb-3'>
                                            <Form.Label>{'Name'}</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder={'Game Name'}
                                                maxLength={GameNameMaxLength}
                                                {...getStandardControlProps(formProps, 'name')}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {formProps.errors.name}
                                            </Form.Control.Feedback>

                                            {newGameType === 'chimera' &&
                                                soloOptions.map((option) =>
                                                    getOptionToggle(option, formProps)
                                                )}
                                            {newGameType === 'pvp' && (
                                                <div className='mt-3'>
                                                    <Form.Label>League Presets</Form.Label>
                                                    <Form.Select
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
                                                    </Form.Select>
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </div>
                                {newGameType === 'pvp' && (
                                    <>
                                        <GameFormats formProps={formProps} />
                                        <Form.Group className='mb-3'>
                                            <Row>
                                                <h3 >Options</h3>
                                                {options.map((option) => (
                                                    <Col key={option.name} lg='6'>
                                                        {getOptionToggle(option, formProps)}
                                                        {option.disabled && (
                                                            <span className='premium-lozenge sm'>
                                                                <FontAwesomeIcon icon={faLock} />
                                                                &nbsp;Premium
                                                            </span>
                                                        )}
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Form.Group>
                                    </>
                                )}
                                {formProps.values.useGameTimeLimit && (
                                    <Row>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>
                                                <span>
                                                    <img
                                                        src={TimeLimitIcon}
                                                        className='game-list-icon'
                                                        alt={'Time limit used'}
                                                    />
                                                </span>
                                                &nbsp;
                                                {'Time Limit'}
                                            </Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder={'Enter time limit'}
                                                {...getStandardControlProps(
                                                    formProps,
                                                    'gameTimeLimit'
                                                )}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {formProps.errors.gameTimeLimit}
                                            </Form.Control.Feedback>

                                            <div className='mt-3'>
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
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>
                                    </Row>
                                )}
                            </>
                        }
                        {newGameType === 'pvp' && (
                            <Row>
                                <Col sm={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>{'Password'}</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder={'Enter a password'}
                                            autoComplete='off'
                                            {...getStandardControlProps(formProps, 'password')}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>{'Label (for tournaments)'}</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder={'Enter a label'}
                                            {...getStandardControlProps(formProps, 'label')}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}
                        <div className='text-center newgame-buttons'>
                            <Button
                                variant='primary'
                                className='def'
                                onClick={() => {
                                    dispatch(cancelNewGame());
                                    if (onClosed) {
                                        onClosed(false);
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button variant='success' type='submit' className='def'>
                                Create
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

NewGame.displayName = 'NewGame';
export default NewGame;
