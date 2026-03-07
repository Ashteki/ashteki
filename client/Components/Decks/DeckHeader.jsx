import React from 'react';
import DeckStatus from './DeckStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faHeart, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegHeart } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import { resyncDeck, setFavourite } from '../../redux/actions';
import Zoomable from './Zoomable';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { ashesDbShareUrl, ashesLiveShareUrl } from '../../util';
import { toastr } from 'react-redux-toastr';


const DeckHeader = ({ deck, editMode, allowEdit, onEdit, onCopy, onDelete }) => {
    const dispatch = useDispatch();

    const handleFavouriteClick = () => {
        dispatch(setFavourite(deck, !deck.favourite));
    };
    const handleEditClick = () => {
        if (onEdit) {
            onEdit();
        }
    };
    const handleCopyClick = () => {
        if (onCopy) {
            onCopy();
        }
    };
    const handleDeleteClick = () => {
        if (onDelete) {
            onDelete();
        }
    };
    const handleUpdateClick = () => {
        dispatch(resyncDeck(deck));
    };

    const ashesLiveLink = (deck.ashesDb ? ashesDbShareUrl : ashesLiveShareUrl) + deck.ashesLiveUuid;
    const siteName = deck.ashesDb ? 'ashesdb' : 'ashes.live';

    const writeLinkToClipboard = (event) => {
        event.preventDefault();
        navigator.clipboard
            .writeText(ashesLiveLink)
            .then(() => toastr.success('Copied url to clipboard'))
            .catch((err) => toastr.error(`Could not copy deck url: ${err}`));
    };

    return (
        <div className='deck-header'>
            <div className={`decklist-entry-image ${deck?.listClass || deck?.phoenixborn[0]?.id}`}></div>
            <div>
                <div className='deck-title'>{deck?.name}</div>
                <div>
                    <Zoomable card={deck?.phoenixborn[0].card}>
                        {deck?.phoenixborn[0]?.card.name}
                    </Zoomable>
                </div>
                <div className='deck-header-buttons'>
                    <a href='#' className='fave-icon'>
                        {deck?.favourite ? (
                            <FontAwesomeIcon
                                icon={faHeart}
                                title='Remove from favourites'
                                onClick={handleFavouriteClick}
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faRegHeart}
                                title='Add to favourites'
                                onClick={handleFavouriteClick}
                            />
                        )}
                    </a>
                    {deck && <DeckStatus status={deck.status} />}
                    {deck && (
                        <Dropdown
                            title='edit'
                            className='deck-edit-dd'
                        >
                            <Dropdown.Toggle
                                variant='primary'
                                className='def deck-edit-btn'
                                id='dropdown-basic'
                            >
                                <FontAwesomeIcon icon={faPen} />&nbsp;
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href='#' onClick={handleEditClick}>
                                    <FontAwesomeIcon icon={faPen} /> Edit
                                </Dropdown.Item>
                                <Dropdown.Item href='#' onClick={handleCopyClick}>
                                    <FontAwesomeIcon icon={faCopy} /> Copy
                                </Dropdown.Item>
                                <Dropdown.Item href='#' onClick={handleDeleteClick}>
                                    <FontAwesomeIcon icon={faTrashCan} /> Delete
                                </Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                    {!editMode && allowEdit && (
                        <div className='deck-buttons text-center'>
                            {deck.ashesLiveUuid && (
                                <Dropdown
                                    variant='warning'
                                    className='ashes-live def'
                                    title={siteName}
                                >
                                    <Dropdown.Toggle
                                        split
                                        variant='warning'
                                        className='def'
                                        id='dropdown-basic'
                                    >
                                        <span className='phg-basic-magic'></span>&nbsp;
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href='#' onClick={handleUpdateClick}>
                                            Update
                                        </Dropdown.Item>
                                        <Dropdown.Item href={ashesLiveLink}>Go to {siteName}</Dropdown.Item>
                                        <Dropdown.Item href='#' onClick={writeLinkToClipboard}>
                                            Copy {siteName} url
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeckHeader;
