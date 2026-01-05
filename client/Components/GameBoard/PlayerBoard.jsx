import React from 'react';
import classNames from 'classnames';

import Card from './Card';
import './PlayerBoard.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const PlayerBoard = ({
    active,
    attack,
    cardsInPlay,
    cardSize,
    manualMode,
    onCardClick,
    onDieClick,
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

    let className = classNames('player-board', {
        'our-side': rowDirection === 'default',
        'active-player': active
    });

    let maxUpgrades = Math.max(...cardsInPlay.map((c) => (c.upgrades ? c.upgrades.length : 0)));
    let topMargin = maxUpgrades * 15;
    let style = { marginTop: topMargin + 'px' };
    return (
        <div className={className}>
            <TransitionGroup component='div' className='card-row' style={style}>
                {cardsInPlay &&
                    cardsInPlay
                        .filter((c) => !attackInvolvesCard(c))
                        .map((card) => (
                            <CSSTransition key={card.uuid} timeout={300} classNames='cardTran'>
                                <Card
                                    canDrag={manualMode}
                                    card={card}
                                    disableMouseOver={card.facedown && !card.code}
                                    onDieClick={onDieClick}
                                    onClick={onCardClick}
                                    onMenuItemClick={onMenuItemClick}
                                    onMouseOut={onMouseOut}
                                    onMouseOver={onMouseOver}
                                    size={cardSize}
                                    source='play area'
                                    side={side}
                                />
                            </CSSTransition>
                        ))}
            </TransitionGroup>
        </div>
    );
};

export default PlayerBoard;
