import React from 'react';
import DeckStatus from './DeckStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegHeart } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import { setFavourite } from '../../redux/actions';

const DeckHeader = ({ deck }) => {
    const dispatch = useDispatch();

    const handleFavouriteClick = () => {
        dispatch(setFavourite(deck, !deck.favourite));
    };

    return (
        <div className='deck-header'>
            <div className={`decklist-entry-image ${deck?.phoenixborn[0]?.id}`}></div>
            <div>
                <div className='deck-title'>{deck?.name}</div>
                <div>{deck?.phoenixborn[0]?.card.name}</div>
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
                    <DeckStatus status={deck?.status} />
                </div>
            </div>
        </div>
    );
};

export default DeckHeader;
