import React, { useState, useRef } from 'react';
import { Form, Button, Alert, Col, Row, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import RangeSlider from 'react-bootstrap-range-slider';
import Panel from '../Site/Panel';

import ProfileMain from './ProfileMain';
import ProfileBackground from './ProfileBackground';
import InGameSettings from './InGameSettings';
import ProfileCardSize from './ProfileCardSize';
import BlankBg from '../../assets/img/bgs/blank.png';
import AshesRebornBg from '../../assets/img/bgs/ashesreborn.png';
const { toBase64 } = require('../../util.js');
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';


import './Profile.scss';

/**
 * User profile settings
 * @typedef {Object} SettingsDetails
 * @property {string} background The game board background
 * @property {string} cardSize The size of the cards to display
 */

/**
 * User profile
 * @typedef {Object} ProfileDetails
 * @property {string} username The user new username
 * @property {string} email The user email address
 * @property {SettingsDetails} settings The user profile settings
 */

/**
 * The user's in game options
 * @typedef {Object} GameOptionsDetails
 * @property {boolean} orderForcedAbilities Whether or not to order forced abilities
 * @property {boolean} confirmOneClick Force a prompt for one click abilities
 */

/**
 * Existing Profile Details
 * @typedef {Object} ExistingProfileDetails
 * @property {string} username
 * @property {string} email The user email address
 * @property {SettingsDetails} settings The user profile settings
 * @property {GameOptionsDetails} gameOptions The user email address
 * @property {File} avatar The avatar
 */

/**
 * @typedef {Object} ProfileProps
 * @property {function(ProfileDetails): void} onSubmit The onSubmit callback
 * @property {User} user The user object
 * @property {boolean} isLoading Wheter or not the profile is loading from the server
 */

/**
 * @type {ExistingProfileDetails}
 */
const initialValues = {
    avatar: undefined,
    email: '',
    username: '',
    settings: {
        background: '',
        cardSize: ''
    },
    gameOptions: {
        confirmOneClick: false,
        orderForcedAbilities: false,
        leftPrompt: false,
        bluffTimer: 0,
        alertTimer: 5,
        alwaysGroupTactics: false
    }
};

/**
 * @param {ProfileProps} props
 */
const Profile = ({ onSubmit, isLoading }) => {
    const { t } = useTranslation();
    const user = useSelector((state) => state.account.user);
    const [localBackground, setBackground] = useState(user?.settings.background);
    const [localCardSize, setCardSize] = useState(user?.settings.cardSize);
    const [customBg, setCustomBg] = useState(null);
    const topRowRef = useRef(null);
    const [bluffTimer, setBluffTimer] = useState(user?.settings.optionSettings.bluffTimer || 0);
    let defaultAlertTimer = 5;
    if (user?.settings.optionSettings.alertTimer !== null) {
        defaultAlertTimer = user?.settings.optionSettings.alertTimer;
    }
    const [alertTimer, setAlertTimer] = useState(defaultAlertTimer);

    const backgrounds = [{ name: 'none', label: t('none'), imageUrl: BlankBg }];
    const cardSizes = [
        { name: 'small', label: t('small') },
        { name: 'normal', label: t('normal') },
        { name: 'large', label: t('large') },
        { name: 'x-large', label: t('extra-large') }
    ];

    backgrounds.push({
        name: 'ashesreborn',
        label: t('Ashes Reborn'),
        imageUrl: AshesRebornBg
    });

    if (!user) {
        return <Alert variant='danger'>You need to be logged in to view your profile.</Alert>;
    }

    initialValues.email = user.email;
    initialValues.username = user.username;
    if (user?.settings?.optionSettings) {
        initialValues.gameOptions = user.settings.optionSettings;
    }

    const schema = yup.object({
        avatar: yup
            .mixed()
            .test(
                'fileSize',
                t('Image must be less than 100KB in size'),
                (value) => !value || value.size <= 100 * 1024
            )
            .test(
                'fileType',
                t('Unsupported image format'),
                (value) =>
                    !value ||
                    ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'].includes(value.type)
            ),
        username: yup
            .string()
            .required(t('You must specify a username'))
            .min(3, t('Your username must be at least 3 characters long'))
            .max(15, t('Your username cannot be more than 15 charcters'))
            .matches(
                /^[A-Za-z0-9_-]+$/,
                t('Usernames must only use the characters a-z, 0-9, _ and -')
            ),
        email: yup
            .string()
            .email(t('Please enter a valid email address'))
            .required(t('You must specify an email address')),
        password: yup.string().min(6, t('Password must be at least 6 characters')),
        passwordAgain: yup
            .string()
            .oneOf([yup.ref('password'), null], t('The passwords you have entered do not match'))
    });

    return (
        <Formik
            validationSchema={schema}
            onSubmit={async (values) => {
                /**
                 * @type {ProfileDetails}
                 */
                const submitValues = {
                    avatar: values.avatar ? await toBase64(values.avatar) : null,
                    email: values.email,
                    username: values.username,
                    password: values.password,
                    settings: { optionSettings: values.gameOptions }
                };

                if (localBackground) {
                    submitValues.settings.background = localBackground;
                }

                if (localCardSize) {
                    submitValues.settings.cardSize = localCardSize;
                }

                if (customBg) {
                    submitValues.customBackground = customBg;
                }

                if (bluffTimer) {
                    submitValues.settings.optionSettings.bluffTimer = bluffTimer;
                }

                if (alertTimer) {
                    submitValues.settings.optionSettings.alertTimer = alertTimer;
                }

                onSubmit(submitValues);

                topRowRef?.current?.scrollIntoView(false);
            }}
            initialValues={initialValues}
        >
            {(formProps) => (
                <Form
                    className='profile-form'
                    onSubmit={(event) => {
                        event.preventDefault();
                        formProps.handleSubmit(event);
                    }}
                >
                    <Row ref={topRowRef}>
                        <Col sm='12'>
                            <ProfileMain formProps={formProps} user={user} />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm='12'>
                            <ProfileBackground
                                backgrounds={backgrounds}
                                selectedBackground={localBackground || user.settings.background}
                                customBackground={user.settings.customBackground}
                                onBackgroundSelected={async (name, file) => {
                                    if (name === 'custom') {
                                        let base64File = await toBase64(file);

                                        setCustomBg(base64File);
                                    }

                                    setBackground(name);
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm='6'>
                            <ProfileCardSize
                                cardSizes={cardSizes}
                                selectedCardSize={localCardSize || user.settings.cardSize}
                                onCardSizeSelected={(name) => setCardSize(name)}
                            />
                        </Col>
                        <Col sm='6'>
                            <InGameSettings formProps={formProps} user={user} />

                            <Panel title='Bluff timer'>
                                <RangeSlider
                                    min='0'
                                    max='10'
                                    tooltip='on'
                                    value={bluffTimer}
                                    onChange={(event) => setBluffTimer(event.target.value)}
                                />
                                <br />
                            </Panel>
                            <Panel title='Alert timer'>
                                <RangeSlider
                                    min='0'
                                    max='10'
                                    tooltip='on'
                                    value={alertTimer}
                                    onChange={(event) => setAlertTimer(event.target.value)}
                                />
                                <br />
                            </Panel>                        </Col>
                    </Row>
                    <div className='text-center profile-submit'>
                        <Button variant='primary' type='submit' disabled={isLoading}>
                            {isLoading ? (
                                <Spinner
                                    animation='border'
                                    size='sm'
                                    as={'span'}
                                    role='status'
                                    aria-hidden='true'
                                />
                            ) : null}
                            {t('Save')}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default Profile;
