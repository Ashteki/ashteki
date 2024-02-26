import React from 'react';
import { useSelector } from 'react-redux';

import './DeckList.scss';
import { PatreonStatus } from '../../types';
import DeckListItems from './DeckListItems';

const DeckList = ({ decks, onDeckSelected, showWinRate }) => {
    const user = useSelector((state) => state.account.user);
    const allowPremium = user?.patreon === PatreonStatus.Pledged || user?.permissions.isSupporter;

    const { selectedDeck } = useSelector((state) => ({
        selectedDeck: state.cards.selectedDeck
    }));

    return (
        <div className='deck-list'>
            <DeckListItems
                allowPremium={allowPremium}
                decks={decks}
                selectedDeck={selectedDeck}
                onDeckSelected={onDeckSelected}
                showWinRate={showWinRate}
            />
        </div>
    );
};

DeckList.displayName = 'DeckList';
export default DeckList;
