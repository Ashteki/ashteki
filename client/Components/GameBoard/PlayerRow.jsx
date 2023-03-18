import React from 'react';
import { useTranslation } from 'react-i18next';

import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import Droppable from './Droppable';
import DiceBox from './DiceBox';
import './PlayerRow.scss';
import { useSelector } from 'react-redux';

const PlayerRow = ({
    archives,
    cardSize,
    isMe,
    hand,
    leftMode,
    manualMode,
    onCardClick,
    onDragDrop,
    onMouseOut,
    onMouseOver,
    onMenuItemClick,
    side,
    dice,
    onDieClick,
    purgedPile
}) => {
    const { t } = useTranslation();

    const renderDroppablePile = (source, child) => {
        return isMe ? (
            <Droppable onDragDrop={onDragDrop} source={source} manualMode={manualMode}>
                {child}
            </Droppable>
        ) : (
            child
        );
    };

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

    let cardPileProps = {
        manualMode: manualMode,
        onCardClick: onCardClick,
        onDragDrop: onDragDrop,
        onMouseOut: onMouseOut,
        onMouseOver: onMouseOver,
        popupLocation: side,
        size: cardSize
    };

    let handToRender = (
        <SquishableCardPanel
            cards={hand}
            className='panel hand'
            groupVisibleCards
            manualMode={manualMode}
            maxCards={5}
            onCardClick={onCardClick}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            rotateHeader={true}
            source='hand'
            title={t('Hand')}
            cardSize={cardSize}
            side={side}
        />
    );

    let archivesToRender = (
        <CardPile
            className='archives'
            title={t('Conjurations')}
            source='archives'
            cards={archives}
            hiddenTopCard={true}
            {...cardPileProps}
        />
    );

    let purged = (
        <CardPile
            className='purged'
            title={t('Purged')}
            source='purged'
            cards={purgedPile}
            {...cardPileProps}
        />
    );

    return (
        <div className='player-home-row-container pt-1'>
            {leftMode && renderResources(dice)}
            {leftMode && renderDroppablePile('archives', archivesToRender)}
            {renderDroppablePile('hand', handToRender)}
            {!leftMode && renderDroppablePile('archives', archivesToRender)}
            {!leftMode && renderResources(dice)}
            {(purgedPile.length > 0 || manualMode) && renderDroppablePile('purged', purged)}
        </div>
    );
};

PlayerRow.displayName = 'PlayerRow';

export default PlayerRow;
