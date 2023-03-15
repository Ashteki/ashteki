import React from 'react';
import { useTranslation } from 'react-i18next';
import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import Droppable from './Droppable';
import DrawDeck from './DrawDeck';
import Card from './Card';

import './PlayerRow.scss';
import DiceBox from './DiceBox';

const PlayerPBRow = ({
    cardSize,
    discard,
    drawDeck,
    isMe,
    manualMode,
    numDeckCards,
    onCardClick,
    onCardAltClick,
    onDieClick,
    onDragDrop,
    onMouseOver,
    onMouseOut,
    player,
    showDice,
    side,
    spells,
    spectating,
    onDrawPopupChange,
    onShuffleClick,
    onPileClick,
    showDeck,
    showDeckPile,
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
            className='panel spellboard'
            groupVisibleCards
            focusDupes={true}
            manualMode={manualMode}
            // maxCards={7}
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
            cardCount={numDeckCards}
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
                onAltClick={onCardAltClick}
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
    let opponentSrText = side === 'top' ? <span className='sr-only'>Opponent&apos;s</span> : null;

    const renderResources = (dice) => {
        return (
            <div className='panel resources card-pile'>
                <h3 className='panel-header'>
                    {opponentSrText}
                    Dice
                </h3>
                <DiceBox
                    dice={dice}
                    size={cardSize}
                    onDieClick={onDieClick}
                    onMenuItemClick={onMenuItemClick}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                />
            </div>
        );
    };
    return (
        <div className='player-home-row-container pt-1'>
            {showDice && renderResources(player.dice)}
            {renderDroppablePile('discard', discardToRender)}
            {showDeckPile && renderDroppablePile('deck', drawDeckToRender)}
            {identityCard}
            {renderDroppablePile('spellboard', spellboard)}
        </div>
    );
};

export default PlayerPBRow;
