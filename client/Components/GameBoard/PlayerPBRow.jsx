import React from 'react';
import { useTranslation } from 'react-i18next';
import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import Droppable from './Droppable';
import DrawDeck from './DrawDeck';
import Card from './Card';

import './PlayerRow.scss';

const PlayerPBRow = ({
    cardSize,
    discard,
    drawDeck,
    isMe,
    manualMode,
    onCardClick,
    onCardAltClick,
    onDieClick,
    onDragDrop,
    onMouseOver,
    onMouseOut,
    player,
    side,
    spells,
    spectating,
    onDrawPopupChange,
    onShuffleClick,
    onPileClick,
    showDeck,
    phoenixborn,
    onMenuItemClick
}) => {
    const { t } = useTranslation();

    const renderDroppablePile = (source, child) => {
        if (isMe) {
            return (
                <Droppable onDragDrop={onDragDrop} source={source} manualMode={manualMode}>
                    {child}
                </Droppable>
            );
        } else {
            return child;
        }
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
            focusDupes={true}
            manualMode={manualMode}
            maxCards={7}
            onCardClick={onCardClick}
            onDieClick={onDieClick}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            onMenuItemClick={onMenuItemClick}
            rotateHeader={true}
            showChains={true}
            source='spellboard'
            title={t('Spellboard')}
            cardSize={cardSize}
            side={side}
        />
    );

    let drawDeckToRender = (
        <DrawDeck
            cardCount={drawDeck.length}
            cards={drawDeck}
            isMe={isMe}
            manualMode={manualMode}
            onCardAltClick={onCardAltClick}
            onPileClick={onPileClick}
            onPopupChange={onDrawPopupChange}
            onShuffleClick={onShuffleClick}
            player={player}
            showDeck={showDeck}
            spectating={spectating}
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

    let identityCard = <div className='card-placeholder' />;
    if (phoenixborn) {
        identityCard = (
            <Card
                card={phoenixborn}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onMenuItemClick={onMenuItemClick}
                onClick={onCardClick}
                size={cardSize}
                side={side}
                source='play area'
            />
        );
    }

    return (
        <div className='player-home-row-container pt-1'>
            {renderDroppablePile('discard', discardToRender)}
            {renderDroppablePile('deck', drawDeckToRender)}
            {identityCard}
            {renderDroppablePile('spellboard', spellboard)}
        </div>
    );
};

export default PlayerPBRow;
