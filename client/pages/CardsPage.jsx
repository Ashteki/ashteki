import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './CardsPage.scss';
import CardGallery from '../Components/Profile/CardGallery';
import { Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

const CardsPage = () => {
    const allCards = useSelector((state) => state.cards.cards);
    const [deckType, setDeckType] = useState('player');
    const [searchText, setSearchText] = useState('');
    const cardList = Object.values(allCards).filter(
        (c) =>
            (c.deckType || 'player') === deckType &&
            !c.stub.includes('ultimate') &&
            !c.stub.includes('behaviour') &&
            (!searchText || c.name.toLowerCase().includes(searchText.toLowerCase()))
    );

    return (
        <div className='full-height'>
            <div className='lobby-card'>
                <div className='cards-filter'>
                    <ToggleButtonGroup name='radio' value={deckType}>
                        <ToggleButton
                            key={'rad-0'}
                            id={`radio-0`}
                            type='radio'
                            value='player'
                            onChange={() => setDeckType('player')}
                            className='mini def'
                        >
                            Player cards
                        </ToggleButton>
                        <ToggleButton
                            key={'rad-1'}
                            id={`radio-1`}
                            type='radio'
                            value='chimera'
                            onChange={() => setDeckType('chimera')}
                            className='mini def'
                        >
                            Chimera Cards
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Form.Control
                        id='search'
                        type='text'
                        placeholder='Search...'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
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
