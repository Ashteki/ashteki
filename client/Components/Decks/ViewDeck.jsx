import React from 'react';
import { Trans } from 'react-i18next';
import { Button, ButtonGroup, Col, Dropdown, SplitButton } from 'react-bootstrap';

import ConfirmButton from '../Form/ConfirmButton';
import DeckSummary from './DeckSummary';
import { deleteDeck, navigate, clearApiStatus, resyncDeck } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import ApiStatus from '../Site/ApiStatus';
import { Decks } from '../../redux/types';
import './ViewDeck.scss';
import DeckHeader from './DeckHeader';
import { ashesLiveShareUrl } from '../../util';
import { toastr } from 'react-redux-toastr';

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
        updateButton = (
            <button className='btn btn-extra def' onClick={handleUpdateClick}>
                Update
            </button>
        );
    }

    const ashesLiveLink = ashesLiveShareUrl + deck.ashesLiveUuid;

    const writeLinkToClipboard = (event) => {
        event.preventDefault();
        navigator.clipboard
            .writeText(ashesLiveLink)
            .then(() => toastr.success('Copied url to clipboard'))
            .catch((err) => toastr.error(`Could not copy deck url: ${err}`));
    };
    return (
        <>
            <ApiStatus
                state={apiState}
                onClose={() => dispatch(clearApiStatus(Decks.ResyncDeck))}
            />

            <div className='lobby-card'>
                <DeckHeader deck={deck} />
                <div className='deck-buttons text-center'>
                    <button className='btn btn-primary def' onClick={handleEditClick}>
                        Edit
                    </button>

                    {deleteButton}
                    {/* {updateButton} */}
                    {deck.ashesLiveUuid && (
                        <Dropdown
                            variant='extra'
                            className='ashes-live def'
                            title='ashes.live'
                            as={ButtonGroup}
                        >
                            <Dropdown.Toggle
                                split
                                variant='extra'
                                className='def'
                                id='dropdown-basic'
                            >
                                <span className='phg-basic-magic'></span>&nbsp;
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href='#' onClick={handleUpdateClick}>
                                    Update
                                </Dropdown.Item>
                                <Dropdown.Item href={ashesLiveLink}>Go to ashes.live</Dropdown.Item>
                                <Dropdown.Item href='#' onClick={writeLinkToClipboard}>
                                    Copy ashes.live url
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>

                <DeckSummary deck={deck} />
            </div>
        </>
    );
};

export default ViewDeck;
