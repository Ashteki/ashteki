import React from 'react';

import CardPile from './CardPile';
import Droppable from './Droppable';
import { useTranslation } from 'react-i18next';

const DrawDeck = (props) => {
    const { t } = useTranslation();

    const {
        // eslint-disable-next-line no-unused-vars
        cards,
        isMe,
        manualMode,
        onDragDrop,
        onPileClick,
        onShuffleClick,
        player,
        showDeck,
        spectating,
        cardCount,
        showChains
    } = props;

    let drawDeckPopupMenu = showDeck
        ? [{ text: 'Close and Shuffle', handler: () => onShuffleClick && onShuffleClick() }]
        : null;

    let hasCards = cardCount > 0;

    let drawDeck = (
        <CardPile
            {...props}
            className='draw'
            disablePopup={!hasCards && (spectating || !isMe)}
            hiddenTopCard={true}
            onPileClick={onPileClick}
            player={player}
            popupMenu={drawDeckPopupMenu}
            source='deck'
            title={t('Draw')}
            showChains={showChains}
        />
    );

    return isMe ? (
        <Droppable onDragDrop={onDragDrop} source='deck' manualMode={manualMode}>
            {drawDeck}
        </Droppable>
    ) : (
        drawDeck
    );
};

export default DrawDeck;
