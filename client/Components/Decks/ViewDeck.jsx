import React from 'react';
import DeckSummary from './DeckSummary';
import { deleteDeck, clearApiStatus, resyncDeck, duplicateDeck } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import ApiStatus from '../Site/ApiStatus';
import { Decks } from '../../redux/types';
import './ViewDeck.scss';
import DeckHeader from './DeckHeader';
import { useNavigate } from 'react-router-dom';

/**
 * @typedef ViewDeckProps
 * @property {import('./DeckList').Deck} deck The currently selected deck
 */

/**
 * @param {ViewDeckProps} props
 */
const ViewDeck = ({ deck, editMode, allowEdit, onDuplicate }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDeleteClick = () => {
        if (confirm('Are you sure you want to delete this deck?')) {
            dispatch(deleteDeck(deck));
        }
    };
    const handleEditClick = () => {
        navigate('/decks/edit');
    };
    const handleDuplicateClick = () => {
        dispatch(duplicateDeck(deck));
        onDuplicate && onDuplicate();
    };

    const apiState = useSelector((state) => {
        const retState = state.api[Decks.ResyncDeck];

        if (retState && retState.success) {
            retState.message = 'Deck updated successfully';

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.ResyncDeck));
            }, 1000);
        }

        return retState;
    });

    return (
        <>
            <ApiStatus
                state={apiState}
                onClose={() => dispatch(clearApiStatus(Decks.ResyncDeck))}
            />

            <div className='lobby-card'>
                <DeckHeader
                    deck={deck}
                    allowEdit={allowEdit}
                    editMode={editMode}
                    onEdit={handleEditClick}
                    onCopy={handleDuplicateClick}
                    onDelete={handleDeleteClick}
                />


                <DeckSummary deck={deck} editMode={editMode} />
            </div>
        </>
    );
};

export default ViewDeck;
