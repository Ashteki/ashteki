import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Form, Table, Button, Spinner, Row } from 'react-bootstrap';
import moment from 'moment';
import * as yup from 'yup';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Admin } from '../redux/types';
import { clearApiStatus, findUser, clearUserSessions, saveUser } from '../redux/actions';

import './UserAdmin.scss';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import CardGallery from '../Components/Profile/CardGallery';

const defaultPermissions = {
    canEditNews: false,
    canManageUsers: false,
    canManagePermissions: false,
    canManageGames: false,
    canManageNodes: false,
    canModerateChat: false,
    canVerifyDecks: false,
    canManageBanlist: false,
    canManageTournaments: false,
    isAdmin: false,
    isContributor: false,
    isSupporter: false,
    isWinner: false,
    isPreviousWinner: false
};

const permissions = [
    { name: 'canManageUsers', label: 'User Manager' },
    { name: 'canManagePermissions', label: 'Permissions Manager' },
    { name: 'canManageGames', label: 'Games Manager' },
    { name: 'canManageNodes', label: 'Node Manager' },
    { name: 'canModerateChat', label: 'Chat Moderator' },
    { name: 'canVerifyDecks', label: 'Deck Verifier' },
    { name: 'canManageBanlist', label: 'Banlist Manager' },
    { name: 'canManageTournaments', label: 'Tournaments Manager' },
    { name: 'isAdmin', label: 'Site Admin' },
    { name: 'isContributor', label: 'Contributor' },
    { name: 'isSupporter', label: 'Supporter' },
    { name: 'isWinner', label: 'Tournament Winner' },
    { name: 'isPreviousWinner', label: 'Previous Tournament Winner' },
    {
        name: 'keepsSupporterWithNoPatreon',
        label: "Don't remove supporter when patreon expires/unlinks"
    }
];

const UserAdmin = () => {
    // currentUser is the user we're messing about with
    const currentUser = useSelector((state) => state.admin.currentUser);
    // user is the active admin account that's doing the updates
    const user = useSelector((state) => state.account.user);
    const { t } = useTranslation();
    const apiState = useSelector((state) => {
        const retState = state.api[Admin.FindUser];

        if (retState && retState.status === 404) {
            retState.message = 'User was not found.';
        } else if (retState && retState.success) {
            retState.message = 'User details loaded';

            setTimeout(() => dispatch(clearApiStatus(Admin.FindUser)), 3000);
        }

        return retState;
    });
    const apiSaveState = useSelector((state) => {
        const retState = state.api[Admin.SaveUser];

        if (retState && retState.success) {
            retState.message = 'User details saved.';

            setTimeout(() => dispatch(clearApiStatus(Admin.SaveUser)), 5000);
        }

        return retState;
    });
    const dispatch = useDispatch();
    const [currentPermissions, setCurrentPermissions] = useState(
        currentUser?.permissions || defaultPermissions
    );
    const [userVerified, setUserVerified] = useState(currentUser?.verified);
    const [userDisabled, setUserDisabled] = useState(currentUser?.disabled);
    const [faveColor, setfaveColor] = useState(currentUser?.faveColor);

    useEffect(() => {
        if (currentUser) {
            setCurrentPermissions(currentUser.permissions);
            setUserDisabled(currentUser.disabled);
            setUserVerified(currentUser.verified);
            setfaveColor(currentUser.faveColor);
        }
    }, [currentUser]);

    const initialValues = {
        username: '',
        disabled: currentUser?.disabled,
        verified: currentUser?.verified,
        faveColor: currentUser?.faveColor
    };

    const schema = yup.object({
        username: yup.string().required('Username must be specified')
    });

    let permissionsCheckBoxes;

    if (currentUser) {
        permissionsCheckBoxes = permissions.map((permission) => {
            return (
                <Col key={`permissions.${permission.name}`} md='4'>
                    <Form.Check
                        type='switch'
                        id={`permissions.${permission.name}`}
                        label={permission.label}
                        inline
                        onChange={() => {
                            currentPermissions[permission.name] = !currentPermissions[
                                permission.name
                            ];
                            let newPermissions = Object.assign({}, currentPermissions);
                            setCurrentPermissions(newPermissions);
                        }}
                        value='true'
                        checked={currentPermissions[permission.name]}
                    ></Form.Check>
                </Col>
            );
        });
    }

    var allAlts = Object.values(currentUser?.altArts || []).reduce(function (prev, next) {
        return prev.concat(next);
    }, []);

    const altCards = allAlts.map((a) => ({ imageStub: a }));

    return (
        <Col sm={{ span: 8, offset: 2 }}>
            <ApiStatus state={apiState} onClose={() => dispatch(clearApiStatus(Admin.FindUser))} />
            <ApiStatus
                state={apiSaveState}
                onClose={() => dispatch(clearApiStatus(Admin.SaveUser))}
            />
            <Formik
                validationSchema={schema}
                onSubmit={async (values) => {
                    dispatch(findUser(values.username));
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
                        <Panel title='User administration'>
                            <Row>
                                <Form.Group as={Col} md='6' controlId='formUsername'>
                                    <Form.Label>{t('Username')}</Form.Label>
                                    <Form.Control
                                        name='username'
                                        type='text'
                                        placeholder={t('Enter a username')}
                                        value={formProps.values.username}
                                        onChange={formProps.handleChange}
                                        onBlur={formProps.handleBlur}
                                        isInvalid={
                                            formProps.touched.username &&
                                            !!formProps.errors.username
                                        }
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formProps.errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Button type='submit' variant='primary'>
                                        Submit&nbsp;
                                        {apiState?.loading && (
                                            <Spinner
                                                animation='border'
                                                size='sm'
                                                as={'span'}
                                                role='status'
                                                aria-hidden='true'
                                            />
                                        )}
                                    </Button>
                                </Col>
                            </Row>
                        </Panel>
                        {currentUser && (
                            <div >
                                <Panel>
                                    <Tabs>
                                        <TabList>
                                            <Tab>User Details</Tab>
                                            <Tab>Alt Arts</Tab>
                                            <Tab>Permissions</Tab>
                                            <Tab>Sessions</Tab>
                                        </TabList>
                                        <TabPanel>
                                            <dl>
                                                <Row>
                                                    <Col md={3}>
                                                        <dt>Username:</dt>
                                                    </Col>
                                                    <Col md={3}>
                                                        <dd>{currentUser.username}</dd>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={3}>
                                                        <dt>Email:</dt>
                                                    </Col>
                                                    <Col md={3}>
                                                        <dd>{currentUser.email}</dd>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={3}>
                                                        <dt>Registered:</dt>
                                                    </Col>
                                                    <Col md={3}>
                                                        <dd>
                                                            {moment(currentUser.registered).format(
                                                                'YYYY-MM-DD HH:MM'
                                                            )}
                                                        </dd>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={3}>
                                                        <dt>Favorite Color:</dt>
                                                    </Col>
                                                    <Col md={3}>
                                                        <HexColorPicker
                                                            color={faveColor}
                                                            onChange={setfaveColor}
                                                        />
                                                        ;
                                                        <Form.Control
                                                            name='favecolor'
                                                            type='text'
                                                            value={faveColor}
                                                            style={{ backgroundColor: faveColor }}
                                                            onChange={(event) =>
                                                                setfaveColor(event.target.value)
                                                            }
                                                        />
                                                        <Button onClick={() => setfaveColor('')}>Clear</Button>
                                                    </Col>
                                                </Row>
                                            </dl>

                                            <Form.Check
                                                type='switch'
                                                id='disabled'
                                                label={'Disabled'}
                                                inline
                                                onChange={() => setUserDisabled(!userDisabled)}
                                                value='true'
                                                checked={userDisabled}
                                            ></Form.Check>
                                            <Form.Check
                                                type='switch'
                                                id='verified'
                                                label={'Verified'}
                                                inline
                                                onChange={() => setUserVerified(!userVerified)}
                                                value='true'
                                                checked={userVerified}
                                            ></Form.Check>

                                        </TabPanel>

                                        <TabPanel>
                                            Alt Arts
                                            <Col lg={{ span: 12, offset: 0 }} className='user-alts'>
                                                <CardGallery cards={altCards} />
                                            </Col>

                                        </TabPanel>

                                        <TabPanel>
                                            {user?.permissions.canManagePermissions ? (
                                                <Panel title='Permissions'>
                                                    <Form.Group>
                                                        <Form.Row>{permissionsCheckBoxes}</Form.Row>
                                                    </Form.Group>
                                                </Panel>
                                            ) : null}
                                        </TabPanel>

                                        <TabPanel>
                                            <h3>Sessions</h3>
                                            {currentUser.tokens && (
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th>IP Address</th>
                                                            <th>Last Used</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentUser.tokens.map((token) => {
                                                            return (
                                                                <tr key={token.ip}>
                                                                    <td>{token.ip}</td>
                                                                    <td>
                                                                        {moment(token.lastUsed).format(
                                                                            'YYYY-MM-DD HH:MM'
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            )}
                                            <h3>Possibly Linked Accounts</h3>
                                            <ul className='list'>
                                                {currentUser.linkedAccounts?.map((name) => {
                                                    return (
                                                        <li key={name}>
                                                            <a
                                                                href='javascript:void(0)'
                                                                onClick={() => dispatch(findUser(name))}
                                                            >
                                                                {name}
                                                            </a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>


                                        </TabPanel>

                                    </Tabs>

                                </Panel>

                                <div className='text-center'>
                                    <Button
                                        type='button'
                                        className='btn btn-primary col-xs-3'
                                        onClick={() =>
                                            dispatch(clearUserSessions(currentUser.username))
                                        }
                                    >
                                        Clear sessions
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='primary'
                                        onClick={() => {
                                            currentUser.permissions = currentPermissions;
                                            currentUser.verified = userVerified;
                                            currentUser.disabled = userDisabled;
                                            currentUser.faveColor = faveColor;
                                            dispatch(saveUser(currentUser));
                                        }}
                                    >
                                        Save&nbsp;
                                        {apiSaveState?.loading && (
                                            <Spinner
                                                animation='border'
                                                size='sm'
                                                as={'span'}
                                                role='status'
                                                aria-hidden='true'
                                            />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </Col>
    );
};

UserAdmin.displayName = 'UserAdmin';

export default UserAdmin;
