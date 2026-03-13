import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import ViewDeck from '../Components/Decks/ViewDeck.jsx';
import DeckEditor from '../Components/Decks/DeckEditor.jsx';
import AlertPanel from '../Components/Site/AlertPanel.jsx';
import { loadDeck, saveDeck, } from '../redux/actions';

function EditDeck({ deckId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const apiError = useSelector(state => state.api.message);
    const deck = useSelector(state => state.cards.selectedDeck);
    const isChimera = deck.mode === 'chimera';
    const deckSaved = useSelector(state => state.cards.deckSaved);
    const loading = useSelector(state => state.api.loading);

    useEffect(() => {
        if (deckId) {
            dispatch(loadDeck(deckId));
        }
    }, [deckId, dispatch]);

    useEffect(() => {
        if (deckSaved) {
            navigate('/decks');
        }
    }, [deckSaved, navigate]);

    const onSaveDeck = (deckToSave) => {
        dispatch(saveDeck(deckToSave));
    };

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
                            <DeckEditor mode='Save' onDeckSave={onSaveDeck} isChimera={isChimera} />
                        </div>
                    </Col>
                    <Col lg={6}>{<ViewDeck deck={deck} editMode={true} />}</Col>
                </Row>
            </div>
        );
    }

    return content;
}
EditDeck.displayName = 'EditDeck';

export default EditDeck;
