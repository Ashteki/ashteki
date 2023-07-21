import React from 'react';
import classNames from 'classnames';

import Card from './Card';
import './PlayerBoard.scss';

const PlayerBoard = ({
    active,
    attack,
    cardsInPlay,
    cardSize,
    manualMode,
    onCardClick,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    rowDirection,
    side
}) => {
    const attackInvolvesCard = (card) => {
        if (!attack) return false;

        return attack.battles.some(
            (b) =>
                b.attacker === card.uuid ||
                (b.target === card.uuid && !b.guard) ||
                b.guard === card.uuid
        );
    };

    const renderRow = (row) => {
        if (!row) {
            return null;
        }

        const results = [];
        // render the cards not involved in an attack
        let rowCards = row.filter((c) => !attackInvolvesCard(c));
        const renderedCards = rowCards.map((card) => renderCard(card));
        return results.concat(renderedCards);
    };

    const renderCard = (card) => {
        if (!card) return;
        return (
            <Card
                key={card.uuid}
                canDrag={manualMode}
                card={card}
                disableMouseOver={card.facedown && !card.code}
                onClick={onCardClick}
                onMenuItemClick={onMenuItemClick}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
                size={cardSize}
                source='play area'
                side={side}
            />
        );
    };

    let className = classNames('player-board', {
        'our-side': rowDirection === 'default',
        'active-player': active
    });

    let maxUpgrades = Math.max(...cardsInPlay.map((c) => (c.upgrades ? c.upgrades.length : 0)));
    let topMargin = maxUpgrades * 15;
    let style = { marginTop: topMargin + 'px' };
    let allCardsInBoard = cardsInPlay;
    return (
        <div className={className}>
            <div className='card-row' style={style}>
                {renderRow(allCardsInBoard)}
            </div>
        </div>
    );
};

export default PlayerBoard;
