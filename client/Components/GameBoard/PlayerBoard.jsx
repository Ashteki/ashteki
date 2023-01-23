import React from 'react';
import classNames from 'classnames';

import Card from './Card';

import './PlayerBoard.scss';

const PlayerBoard = ({
    active,
    attack,
    cardsInPlay,
    phoenixborn,
    cardSize,
    manualMode,
    onCardClick,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    playerId,
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

    const getCard = (uuid) => {
        return phoenixborn.uuid === uuid ? phoenixborn : cardsInPlay.find((c) => c.uuid === uuid);
    };

    const renderRow = (row) => {
        const results = [];
        // render attack cards or gaps
        if (attack)
            // should we display the attackers or defenders?
            // is this player (top or bottom) the attacker?
            attack.battles.forEach((b) => {
                if (attack.attackingPlayer === playerId) {
                    // just display the attackers
                    const attackerCard = getCard(b.attacker);
                    results.push(renderCard(attackerCard));
                } else {
                    // work out defender or blank
                    const guardCard = getCard(b.guard);
                    const targetCard = getCard(b.target);
                    let defCard = guardCard;
                    if (!guardCard && !b.guard) {
                        defCard = targetCard;
                    }

                    if (defCard && defCard !== phoenixborn) results.push(renderCard(defCard));
                    else results.push(renderCardGap());
                }
            });

        // render the remaining cards not involved in the attack
        let rowCards = row.filter((c) => !attackInvolvesCard(c));
        const renderedCards = rowCards.map((card) => renderCard(card));
        return results.concat(renderedCards);
    };

    const renderCardGap = () => {
        const sizeClass = {
            [cardSize]: cardSize !== 'normal'
        };
        let cardClass = classNames('game-card', 'vertical', sizeClass);

        return (
            <div className={'card-wrapper'}>
                <div className='card-frame'>
                    <div className={cardClass} />
                </div>
            </div>
        );
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

    return (
        <div className={className}>
            <div className='card-row' style={style}>
                {renderRow(cardsInPlay)}
            </div>
        </div>
    );
};

export default PlayerBoard;
