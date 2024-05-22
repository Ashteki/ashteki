import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './CardsPage.scss';
import CardGallery from '../Components/Profile/CardGallery';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

const CardsPage = () => {
    const allCards = useSelector((state) => state.cards.cards);
    const [deckType, setDeckType] = useState('player');
    const cardList = Object.values(allCards).filter(
        (c) =>
            (c.deckType || 'player') === deckType &&
            !c.stub.includes('ultimate') &&
            !c.stub.includes('behaviour')
    ); //.sort((a, b) => a.type + a.stub > b.type + b.stub ? 1 : -1);
    return (
        <div className='full-height'>
            <div className='lobby-card'>
                <div className='lobby-header'>All Cards</div>
                <div className='cards-filter'>
                    <ToggleButtonGroup name="radio" value={deckType}>
                        <ToggleButton
                            key={'rad-0'}
                            id={`radio-0`}
                            type="radio"
                            value='player'
                            onChange={(e) => setDeckType('player')}
                            className='mini'
                        >
                            Player cards                    </ToggleButton>
                        <ToggleButton
                            key={'rad-1'}
                            id={`radio-1`}
                            type="radio"
                            value='chimera'
                            onChange={(e) => setDeckType('chimera')}
                            className='mini'
                        >
                            Chimera Cards
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div className='card-browser'>
                    <CardGallery cards={cardList} />
                </div>
            </div>
        </div>
    );
};

CardsPage.displayName = 'Decks';

export default CardsPage;
