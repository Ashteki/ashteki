import React from 'react';
import { Trans } from 'react-i18next';
import { ButtonGroup, Col } from 'react-bootstrap';

import ConfirmButton from '../Form/ConfirmButton';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';
import { deleteDeck, navigate, clearApiStatus, resyncDeck } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import ApiStatus from '../Site/ApiStatus';
import { Decks } from '../../redux/types';

/**
 * @typedef ViewDeckProps
 * @property {import('./DeckList').Deck} deck The currently selected deck
 */

/**
 * @param {ViewDeckProps} props
 */
const ViewDeck = ({ deck }) => {
    const dispatch = useDispatch();

    const handleDeleteClick = () => {
        dispatch(deleteDeck(deck));
    };
    const handleEditClick = () => {
        dispatch(navigate('/decks/edit'));
    };
    const handleUpdateClick = () => {
        dispatch(resyncDeck(deck));
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
    let deleteButton = null;
    if (deck._id) {
        deleteButton = (
            <ConfirmButton onClick={handleDeleteClick}>
                <Trans>Delete</Trans>
            </ConfirmButton>
        );
    }

    let updateButton = null;
    if (deck.ashesLiveUuid) {
        updateButton = <button className='btn btn-secondary' onClick={handleUpdateClick}>Update</button>;
    }

    return (<>
        <ApiStatus
            state={apiState}
            onClose={() => dispatch(clearApiStatus(Decks.ResyncDeck))}
        />

        <Panel title={deck?.name}>
            <Col xs={12} className='text-center'>
                <ButtonGroup>
                    <button className='btn btn-primary' onClick={handleEditClick}>
                        Edit
                    </button>

                    {deleteButton}
                    {updateButton}
                </ButtonGroup>
            </Col>
            <DeckSummary deck={deck} />
        </Panel>
    </>
    );
};

export default ViewDeck;
