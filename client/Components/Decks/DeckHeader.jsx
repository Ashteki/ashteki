import React from 'react';
import DeckStatus from './DeckStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegHeart } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import { setFavourite } from '../../redux/actions';
import Zoomable from './Zoomable';

const DeckHeader = ({ deck, showCopy, onCopy }) => {
    const dispatch = useDispatch();

    const handleFavouriteClick = () => {
        dispatch(setFavourite(deck, !deck.favourite));
    };
    const handleCopyClick = () => {
        if (onCopy) {
            onCopy();
        }
    };

    return (
        <div className='deck-header'>
            <div className={`decklist-entry-image ${deck.listClass || deck?.phoenixborn[0]?.id}`}></div>
            <div>
                <div className='deck-title'>{deck?.name}</div>
                <div>
                    <Zoomable card={deck?.phoenixborn[0].card}>
                        {deck?.phoenixborn[0]?.card.name}
                    </Zoomable>
                </div>
                <div className='deck-header-buttons'>
                    {showCopy && (
                        <button className='btn btn-primary def' onClick={handleCopyClick}>
                            <FontAwesomeIcon icon={faCopy} /> Copy
                        </button>
                    )}
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
                </div>
            </div>
        </div>
    );
};

export default DeckHeader;
