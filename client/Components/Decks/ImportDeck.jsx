import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';

import Panel from '../Site/Panel';
import ApiStatus from '../Site/ApiStatus';
import { Decks } from '../../redux/types';
import { clearApiStatus, navigate, importDeck } from '../../redux/actions';

const ImportDeck = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiState = useSelector((state) => {
        const retState = state.api[Decks.ImportDeck];

        if (retState && retState.success) {
            retState.message = t('Deck added successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.ImportDeck));
                dispatch(navigate('/decks'));
            }, 1000);
        }

        return retState;
    });

    const schema = yup.object({
        deckLink: yup
            .string()
            .required(t('You must specify the deck link'))
            .notOneOf(
                ['https://ashes.live/decks/share/00000000-0000-0000-0000-000000000000'],
                'The URL you entered is invalid.  Please check it and try again.'
            )
            .matches(
                /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
                'The URL you entered is invalid.  Please check it and try again.'
            )
    });

    const initialValues = {
        deckLink: ''
    };

    const onSubmit = (values) => {
        const regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
        let uuid = values.deckLink.match(regex);

        dispatch(importDeck({ uuid: uuid[0] }));
    };

    return (
        <div>
            <Col md={{ span: 8, offset: 2 }} className='profile full-height'>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Decks.ImportDeck))}
                />
                <Panel title={t('Import Deck')}>
                    <p>
                        Enter the deck share link from the&nbsp;
                        <a href='https://ashes.live' target='_blank' rel='noopener noreferrer'>
                            ashes.live website.
                        </a>
                    </p>
                    <p>
                        Locate and view a deck on ashes.live, then click the &apos;Share...&apos;
                        button. You can copy the url displayed in the &apos;Share and export&apos;
                        overlay.
                    </p>
                    <p>The URL looks like this: </p>
                    <p>
                        <code>
                            https://ashes.live/decks/share/00000000-0000-0000-0000-000000000000
                        </code>
                    </p>
                    <Formik
                        validationSchema={schema}
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                    >
                        {(formProps) => (
                            <Form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    formProps.handleSubmit(event);
                                }}
                            >
                                <Form.Row>
                                    <Form.Group as={Col} xs='9' controlId='formGridDeckLink'>
                                        <Form.Label>{t('Deck Link')}</Form.Label>
                                        <Form.Control
                                            name='deckLink'
                                            type='text'
                                            placeholder={t('Enter the deck link')}
                                            value={formProps.values.deckLink}
                                            onChange={formProps.handleChange}
                                            onBlur={formProps.handleBlur}
                                            isInvalid={
                                                formProps.touched.deckLink &&
                                                !!formProps.errors.deckLink
                                            }
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {formProps.errors.deckLink}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Col className='text-center'>
                                    <Button variant='secondary' type='submit'>
                                        {t('Import')}
                                        &nbsp;
                                        {apiState && apiState.loading && (
                                            <FontAwesomeIcon icon={faCircleNotch} spin />
                                        )}
                                    </Button>
                                </Col>
                            </Form>
                        )}
                    </Formik>
                </Panel>
            </Col>
        </div>
    );
};

ImportDeck.displayName = 'ImportDeck';

export default ImportDeck;
