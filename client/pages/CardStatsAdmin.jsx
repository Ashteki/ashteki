import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Form, Button, Spinner, Row } from 'react-bootstrap';
import * as yup from 'yup';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { Formik } from 'formik';
import { loadCardStats } from '../redux/actions';

const schema = yup.object({
    cardName: yup.string().required('Card name must be specified'),
    includeSolo: yup.bool()
});

const CardStatsAdmin = () => {
    const dispatch = useDispatch();
    const cardStats = useSelector((state) => state.stats.cardStats);
    const apiState = useSelector((state) => state.api.REQUEST_CARDSTATS);

    const initialValues = {
        cardName: '',
        includeSolo: false
    };

    return (
        <Col>
            <ApiStatus state={apiState} />
            <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                    dispatch(loadCardStats(values.cardName, values.includeSolo));
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
                        <Panel title='Card Play Statistics'>
                            <Row>
                                <Form.Group as={Col} md='6' controlId='formCardName'>
                                    <Form.Label>Card Name</Form.Label>
                                    <Form.Control
                                        name='cardName'
                                        type='text'
                                        placeholder='Enter a card name'
                                        value={formProps.values.cardName}
                                        onChange={formProps.handleChange}
                                        onBlur={formProps.handleBlur}
                                        isInvalid={
                                            formProps.touched.cardName &&
                                            !!formProps.errors.cardName
                                        }
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formProps.errors.cardName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} md='6' controlId='formIncludeSolo'>
                                    <Form.Check
                                        name='includeSolo'
                                        type='checkbox'
                                        label='Include solo games'
                                        checked={formProps.values.includeSolo}
                                        onChange={formProps.handleChange}
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Button type='submit' variant='primary'>
                                        Get Stats&nbsp;
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
                        {cardStats && cardStats.success && (
                            <Panel title={`Statistics for "${cardStats.card}"`}>
                                <Row>
                                    <Col>
                                        <p>Total games played: {cardStats.totalGames}</p>
                                        <p>Games played by winner: {cardStats.winnerPlays}</p>
                                        <p>Games played by loser: {cardStats.loserPlays}</p>
                                        <p>Total plays: {cardStats.totalPlays}</p>
                                        <p>Other plays: {cardStats.otherPlays}</p>
                                        {cardStats.otherChatMessages && cardStats.otherChatMessages.length > 0 && (
                                            <div>
                                                <p>Other chat messages:</p>
                                                <ul>
                                                    {cardStats.otherChatMessages.map((msg, index) => (
                                                        <li key={index}>{msg}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <p>Win percentage: {cardStats.totalGames > 0 ? Math.round((cardStats.winnerPlays / cardStats.totalGames) * 100) : 0}%</p>
                                    </Col>
                                </Row>
                            </Panel>
                        )}
                    </Form>
                )}
            </Formik>
        </Col>
    );
};

export default CardStatsAdmin;