import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegHeart } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import { setFavourite } from '../../redux/actions';
import Zoomable from './Zoomable';
import DeckDice from './DeckDice';

const DeckHeader = ({ deck, onDieHover, allowFave }) => {
    const dispatch = useDispatch();

    const handleFavouriteClick = () => {
        dispatch(setFavourite(deck, !deck.favourite));
    };

    return (
        <div className='deck-header'>
            <div className={`decklist-entry-image ${deck?.listClass || deck?.phoenixborn[0]?.id}`}></div>
            <div>
                <div className='deck-title'>{deck?.name}</div>
                <div className='deck-pb-name'>
                    <Zoomable card={deck?.phoenixborn[0]?.card}>
                        {deck?.phoenixborn[0]?.card?.name}
                    </Zoomable>
                </div>
                <DeckDice
                    size='large'
                    deck={deck}
                    slotCount={deck.mode === 'chimera' ? 5 : 10}
                    // onDieClick={onDieClick}
                    onDieHover={onDieHover}
                />
                {deck?.behaviour && (
                    <div className='deck-pb-name'>
                        <Zoomable card={deck?.behaviour[0]?.card}>
                            {deck?.behaviour[0]?.card?.name}
                        </Zoomable>
                    </div>
                )}
                {deck?.ultimate && (
                    <div className='deck-pb-name'>
                        <Zoomable card={deck?.ultimate[0]?.card}>
                            {deck?.ultimate[0]?.card?.name}
                        </Zoomable>
                    </div>
                )}
                {allowFave && (
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
                )}
            </div>
        </div>
    );
};

export default DeckHeader;
