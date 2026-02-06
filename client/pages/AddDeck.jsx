import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from '../redux/actions';
import DeckEditor from '../Components/Decks/DeckEditor';
import AlertPanel from '../Components/Site/AlertPanel';
import { Col, Row } from 'react-bootstrap';
// import ViewDeck from '../Components/Decks/ViewDeck.jsx';
import DeckSummary from '../Components/Decks/DeckSummary';
import DeckHeader from '../Components/Decks/DeckHeader';
import { useNavigate } from 'react-router-dom';

export function InnerAddDeck() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const apiError = useSelector((state) => state.api.message);
    const deck = useSelector((state) => state.cards.selectedDeck);
    const deckSaved = useSelector((state) => state.cards.deckSaved);
    const loading = useSelector((state) => state.api.loading);

    useEffect(() => {
        dispatch(actions.addDeck());
    }, [dispatch]);

    useEffect(() => {
        if (deckSaved) {
            navigate('/decks');
        }
    }, [deckSaved, navigate]);

    const onAddDeck = useCallback(
        (d) => {
            dispatch(actions.saveDeck(d));
        },
        [dispatch]
    );

    if (loading) {
        return <div>Loading decks from the server...</div>;
    } else if (apiError) {
        return <AlertPanel type='error' message={apiError} />;
    }

    return (
        <div className='full-height'>
            <Row>
                <Col lg={6} className='full-height'>
                    <div className='lobby-card'>
                        <div className='lobby-header'>Deck Editor</div>

                        <DeckEditor mode='Add' onDeckSave={onAddDeck} />
                    </div>
                </Col>
                <Col lg={6}>
                    <div className='lobby-card'>
                        <DeckHeader deck={deck} />
                        <DeckSummary deck={deck} />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

InnerAddDeck.displayName = 'InnerAddDeck';
InnerAddDeck.propTypes = {
    navigate: PropTypes.func
};

export default InnerAddDeck;
