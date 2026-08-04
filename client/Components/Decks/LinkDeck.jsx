import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Button, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';

import Panel from '../Site/Panel';
import ApiStatus from '../Site/ApiStatus';
import { Decks } from '../../redux/types';
import { clearApiStatus, linkDeck } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';
import DeckHeader from './DeckHeader';

const LinkDeck = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const deck = useSelector((state) => state.cards.selectedDeck);

    const apiState = useSelector((state) => {
        const retState = state.api[Decks.LinkDeck];

        if (retState && retState.success) {
            retState.message = t('Deck linked successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.LinkDeck));
                navigate('/decks');
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
        const isAshesDb = values.deckLink.includes('ashesdb.plaidhatgames.com');
        dispatch(linkDeck(deck._id, uuid[0], isAshesDb));
    };

    return (
        <div>
            <Col md={{ span: 8, offset: 2 }} className='profile full-height'>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Decks.LinkDeck))}
                />
                <Panel title='Link Deck'>
                    <DeckHeader
                        deck={deck} />
                    <h2 className='lobby-header'>Link this deck</h2>
                    <p>
                        You can link to a deck from{' '}
                        <a href='https://ashes.live' target='_blank' rel='noopener noreferrer'>
                            ashes.live
                        </a>{' '}
                        or the{' '}
                        <a
                            href='https://ashesdb.plaidhatgames.com/'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            PHG Ashes Deckbuilder site.
                        </a>    On either site, view the deck page, then click the &apos;Share...&apos;
                        button. You can copy the url displayed in the &apos;Share and export&apos;
                        overlay. The URL looks like this: </p>
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
                                <Row>
                                    <Col sm={9}>
                                        <Form.Group className='mb-3' controlId='formGridDeckLink'>
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
                                    </Col>
                                </Row>

                                <Row>
                                    <Col className='text-center'>
                                        <Button variant='secondary' type='submit'>
                                            Link Deck
                                            &nbsp;
                                            {apiState && apiState.loading && (
                                                <FontAwesomeIcon icon={faCircleNotch} spin />
                                            )}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Panel>
            </Col>
        </div>
    );
};

LinkDeck.displayName = 'LinkDeck';

export default LinkDeck;
