import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import ViewDeck from '../Components/Decks/ViewDeck.jsx';
import DeckEditor from '../Components/Decks/DeckEditor.jsx';
import AlertPanel from '../Components/Site/AlertPanel.jsx';

import * as actions from '../redux/actions';

function InnerEditDeck({ deckId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const apiError = useSelector((s) => s.api.message);
    const deck = useSelector((s) => s.cards.selectedDeck);
    const deckSaved = useSelector((s) => s.cards.deckSaved);
    const loading = useSelector((s) => s.api.loading);

    useEffect(() => {
        if (deckId) {
            dispatch(actions.loadDeck(deckId));
        } else if (deck) {
            dispatch(actions.setUrl('/decks/edit/' + deck._id));
            dispatch(actions.loadDeck(deck._id));
        }
    }, [deckId, deck, dispatch]);

    useEffect(() => {
        if (deckSaved) {
            navigate('/decks');
        }
    }, [deckSaved, navigate]);

    const onSaveDeck = useCallback(
        (d) => {
            dispatch(actions.saveDeck(d));
        },
        [dispatch]
    );

    let content;

    if (loading) {
        content = <div>Loading decks from the server...</div>;
    } else if (apiError) {
        content = <AlertPanel type='error' message={apiError} />;
    } else if (!deck) {
        content = <AlertPanel message='The specified deck was not found' type='error' />;
    } else {
        content = (
            <div className='full-height'>
                <Row>
                    <Col lg={6} className='full-height'>
                        <div className='lobby-card'>
                            <div className='lobby-header'>Deck Editor</div>
                            <DeckEditor mode='Save' onDeckSave={onSaveDeck} />
                        </div>
                    </Col>
                    <Col lg={6}>{<ViewDeck deck={deck} editMode={true} />}</Col>
                </Row>
            </div>
        );
    }

    return content;
}

InnerEditDeck.displayName = 'InnerEditDeck';

export default InnerEditDeck;
