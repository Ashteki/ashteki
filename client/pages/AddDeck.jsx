import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import DeckEditor from '../Components/Decks/DeckEditor';
import AlertPanel from '../Components/Site/AlertPanel';
import { Col, Row } from 'react-bootstrap';
import DeckSummary from '../Components/Decks/DeckSummary';
import DeckHeader from '../Components/Decks/DeckHeader';
import { addChimeraDeck, addDeck, saveDeck } from '../redux/actions';
import { useNavigate } from 'react-router-dom';

export function AddDeckPage({ isChimera }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const apiError = useSelector(state => state.api.message);
    const deck = useSelector(state => state.cards.selectedDeck);
    const deckSaved = useSelector(state => state.cards.deckSaved);
    const loading = useSelector(state => state.api.loading);

    useEffect(() => {
        if (deckSaved) {
            navigate('/decks');
        }
    }, [deckSaved, navigate]);

    const onAddDeck = (deck) => {
        dispatch(saveDeck(deck));
    };

    if (loading) {
        return <div>Loading decks from the server...</div>;
    } else if (apiError) {
        return <AlertPanel type='error' message={apiError} />;
    } else {

        return (
            <div className='full-height'>
                <Row>
                    <Col lg={6} className='full-height'>
                        <div className='lobby-card'>
                            <div className='lobby-header'>Deck Editor</div>

                            <DeckEditor deck={deck} isChimera={isChimera} onDeckSave={onAddDeck} />
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
}

AddDeckPage.displayName = 'AddDeck';

export default AddDeckPage;
