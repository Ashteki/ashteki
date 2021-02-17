import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from './Card';

import './PlayerBoard.scss';

class PlayerBoard extends React.Component {
    attackInvolvesCard(card) {
        let attack = this.props.attack;
        if (!attack) return false;

        return attack.battles.some(
            (b) =>
                b.attacker === card.uuid ||
                (b.target === card.uuid && !b.guard) ||
                b.guard === card.uuid
        );
    }

    getCard(uuid) {
        return this.props.cardsInPlay.find((c) => c.uuid === uuid);
    }

    renderRow(row) {
        const results = [];
        // render attack cards or gaps
        let attack = this.props.attack;
        if (attack)
            // should we display the attackers or defenders?
            // is this player (top or bottom) the attacker?
            attack.battles.map((b) => {
                if (attack.attackingPlayer === this.props.playerId) {
                    // just display the attackers
                    const attackerCard = this.getCard(b.attacker);
                    results.push(this.renderCard(attackerCard));
                } else {
                    // work out defender or blank
                    let defCard = this.getCard(b.guard) || this.getCard(b.target);
                    if (defCard) results.push(this.renderCard(defCard));
                    else results.push(this.renderCardGap());
                }
            });

        // render the remaining cards not involved in the attack
        let rowCards = row.filter((c) => !this.attackInvolvesCard(c));
        const renderedCards = rowCards.map((card) => this.renderCard(card));
        return results.concat(renderedCards);
    }

    renderCardGap() {
        const sizeClass = {
            [this.props.cardSize]: this.props.cardSize !== 'normal'
        };
        let cardClass = classNames('game-card', 'vertical', sizeClass);

        return (
            <div className={'card-wrapper'}>
                <div className='card-frame'>
                    <div className={cardClass} />
                </div>
            </div>
        );
    }

    renderCard(card) {
        if (!card) return;
        return (
            <Card
                key={card.uuid}
                cardBackUrl={this.props.cardBackUrl}
                canDrag={this.props.manualMode}
                card={card}
                disableMouseOver={card.facedown && !card.code}
                onClick={this.props.onCardClick}
                onMenuItemClick={this.props.onMenuItemClick}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                size={this.props.cardSize}
                source='play area'
                side={this.props.side}
            />
        );
    }

    render() {
        let className = classNames('player-board', {
            'our-side': this.props.rowDirection === 'default',
            'active-player': this.props.active
        });

        let maxUpgrades = Math.max(...this.props.cardsInPlay.map((c) => c.upgrades.length));
        let topMargin = maxUpgrades * 15;
        let style = { 'margin-top': topMargin + 'px' };
        return (
            <div className={className}>
                <div className='card-row' style={style}>
                    {this.renderRow(this.props.cardsInPlay)}
                </div>
            </div>
        );
    }
}

PlayerBoard.displayName = 'PlayerBoard';
PlayerBoard.propTypes = {
    cardBackUrl: PropTypes.string,
    cardsInPlay: PropTypes.array,
    manualMode: PropTypes.bool,
    onCardClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    rowDirection: PropTypes.oneOf(['default', 'reverse']),
    cardSize: PropTypes.string,
    playerId: PropTypes.string,
    active: PropTypes.bool
};

export default PlayerBoard;
