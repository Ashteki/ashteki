import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Form, Button, Spinner, Row } from 'react-bootstrap';
import moment from 'moment';
import * as yup from 'yup';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Admin } from '../redux/types';
import { clearApiStatus, loadAlts, findUserAlts, saveUserAlts } from '../redux/actions';

import './UserAdmin.scss';
import { useState } from 'react';
import CardGallery from '../Components/Profile/CardGallery';
import CardImage from '../Components/GameBoard/CardImage';

const UserAltAdmin = () => {
    // currentUser is the user we're messing about with
    const currentUser = useSelector((state) => state.admin.currentUser);
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
    const [userAlts, setUserAlts] = useState(currentUser?.altArts);
    const allAlts = useSelector((state) => state.cards.alts);
    const [selectedAlt, setSelectedAlt] = useState(null);

    useEffect(() => {
        if (currentUser) {
            setUserAlts(currentUser.altArts);
        }
    }, [currentUser]);

    useEffect(() => {
        dispatch(loadAlts());
    }, [dispatch]);

    const initialValues = {
        username: ''
    };

    const schema = yup.object({
        username: yup.string().required('Username must be specified')
    });


    const altCards = [];
    for (const [key, value] of Object.entries(userAlts || [])) {
        altCards.push(...value.map((v) => ({ id: key, alt: v, imageStub: v })));
    }

    const onAltClick = (stub, alt) => {
        const tempAlts = Object.assign({}, userAlts);
        const altIndex = tempAlts[stub].indexOf(alt);
        if (altIndex >= 0) {
            if (confirm('Remove this alt?')) {
                tempAlts[stub].splice(altIndex, 1);
            }
        }
        setUserAlts(tempAlts);
    };

    const handleSelectedAltChange = (event) => {
        const newAlt = allAlts.find((a) => a.alt === event.target.value);
        setSelectedAlt(newAlt);
    };

    const addAltClick = (event) => {
        event.preventDefault();
        if (!selectedAlt) {
            return;
        }

        const tempAlts = Object.assign({}, userAlts);

        if (tempAlts[selectedAlt.stub]) {
            if (!tempAlts[selectedAlt.stub].includes(selectedAlt.alt)) {
                tempAlts[selectedAlt.stub].push(selectedAlt.alt);
            }
        } else {
            tempAlts[selectedAlt.stub] = [selectedAlt.alt];
        }
        setUserAlts(tempAlts);
    };

    return (
        <Col>
            <ApiStatus state={apiState} onClose={() => dispatch(clearApiStatus(Admin.FindUser))} />
            <ApiStatus
                state={apiSaveState}
                onClose={() => dispatch(clearApiStatus(Admin.SaveUser))}
            />
            <Formik
                validationSchema={schema}
                onSubmit={async (values) => {
                    dispatch(findUserAlts(values.username));
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
                                    <div className='lobby-header'>Alt Arts</div>
                                    <Row>
                                        <Col md={3}>
                                            <dt>Username:</dt>
                                        </Col>
                                        <Col md={9}>
                                            <dd>{currentUser.username}</dd>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <dt>Registered:</dt>
                                        </Col>
                                        <Col md={9}>
                                            <dd>
                                                {moment(currentUser.registered).format(
                                                    'YYYY-MM-DD HH:MM'
                                                )}
                                            </dd>
                                        </Col>
                                    </Row>
                                    <div>
                                        <div style={{ display: 'flex' }}>
                                            <select className='form-control col-md-6' onChange={handleSelectedAltChange}>
                                                <option value={null} />
                                                {allAlts.map((a) => (
                                                    <option key={a.alt} value={a.alt}>
                                                        {a.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button className='btn btn-primary def' onClick={addAltClick} >Add</button>
                                        </div>
                                        <div className='admin-card' >
                                            {selectedAlt && <CardImage card={selectedAlt} />}
                                        </div>
                                        <h3>Currently held alts</h3>
                                        <div className='user-alts'>
                                            <CardGallery cards={altCards} onAltClick={onAltClick} />
                                        </div>
                                    </div>

                                </Panel>

                                <div className='text-center'>
                                    <Button
                                        type='button'
                                        variant='primary'
                                        onClick={() => {
                                            currentUser.altArts = userAlts;

                                            dispatch(saveUserAlts(currentUser));
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

UserAltAdmin.displayName = 'UserAdmin';

export default UserAltAdmin;
