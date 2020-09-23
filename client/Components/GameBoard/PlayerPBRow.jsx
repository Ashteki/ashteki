import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import Droppable from './Droppable';
import { buildArchon, buildDeckList } from '../../archonMaker';
import IdentityDefault from '../../assets/img/idbacks/identity.jpg';
import { setCardBack } from '../../redux/actions';
import DrawDeck from './DrawDeck';
import IdentityCard from './IdentityCard';
import spellback from '../../assets/img/cardback-spell.png';

import './PlayerRow.scss';

const PlayerPBRow = ({
    cardSize,
    deckData,
    discard,
    drawDeck,
    hideDeckLists,
    isMe,
    gameFormat,
    language,
    manualMode,
    numDeckCards,
    onCardClick,
    onDragDrop,
    onMouseOver,
    onMouseOut,
    player,
    side,
    spells,
    spectating,
    onDrawPopupChange,
    onShuffleClick,
    showDeck
}) => {
    const { t } = useTranslation();
    const [deckListUrl, setDeckListUrl] = useState(IdentityDefault);
    const cards = useSelector((state) => state.cards.cards);
    const deckDataCopy = { ...deckData };

    useEffect(() => {
        let noDeckLists = false;

        if ((gameFormat === 'sealed' && !isMe) || hideDeckLists) {
            deckDataCopy.name = '';
            noDeckLists = true;
        }

        buildArchon(deckData).then((cardBackUrl) => {
            setCardBack(player, cardBackUrl);
        });
        if (noDeckLists) {
            setDeckListUrl(IdentityDefault);
        } else {
            buildDeckList(deckDataCopy, language, t, cards)
                .then((deckListUrl) => {
                    setDeckListUrl(deckListUrl);
                })
                .catch(() => {
                    setDeckListUrl(IdentityDefault);
                });
        }
    }, [cards, deckData, gameFormat, hideDeckLists, isMe, language, player, t]);

    const renderDroppablePile = (source, child) => {
        return isMe ? (
            <Droppable onDragDrop={onDragDrop} source={source} manualMode={manualMode}>
                {child}
            </Droppable>
        ) : (
            child
        );
    };

    let cardPileProps = {
        manualMode: manualMode,
        onCardClick: onCardClick,
        onDragDrop: onDragDrop,
        onMouseOut: onMouseOut,
        onMouseOver: onMouseOver,
        popupLocation: side,
        size: cardSize
    };

    let spellboard = (
        <SquishableCardPanel
            cards={spells}
            className='panel hand'
            groupVisibleCards
            cardBackUrl={spellback}
            manualMode={manualMode}
            maxCards={6}
            onCardClick={onCardClick}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            source='play area'
            title={t('Spellboard')}
            cardSize={cardSize}
        />
    );

    let drawDeckToRender = (
        <DrawDeck
            cardCount={numDeckCards}
            cards={drawDeck}
            isMe={isMe}
            manualMode={manualMode}
            numDeckCards={numDeckCards}
            onPopupChange={onDrawPopupChange}
            onShuffleClick={onShuffleClick}
            showDeck={showDeck}
            spectating={spectating}
            cardBackUrl={spellback}
            {...cardPileProps}
        />
    );

    let discardToRender = (
        <CardPile
            className='discard'
            title={t('Discard')}
            source='discard'
            cards={discard}
            {...cardPileProps}
        />
    );

    let identity = (
        <IdentityCard
            className='identity'
            deckListUrl={deckListUrl}
            size={cardSize}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
        />
    );

    return (
        <div className='player-home-row-container pt-1'>
            {renderDroppablePile('discard', discardToRender)}
            {renderDroppablePile('deck', drawDeckToRender)}
            {identity}
            {renderDroppablePile('spellboard', spellboard)}
        </div>
    );
};

export default PlayerPBRow;
