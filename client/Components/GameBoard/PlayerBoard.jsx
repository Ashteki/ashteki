import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from './Card';

import './PlayerBoard.scss';

class PlayerBoard extends React.Component {
    attackInvolvesCard(card) {
        let attack = this.props.attack;
        return attack.battles.some((b) => b.attacker === card.uuid || b.target === card.uuid);
    }
    renderRow(row) {
        let rowCards = row;
        if (this.props.attack) {
            rowCards = rowCards.sort((a, b) =>
                this.attackInvolvesCard(a) && !this.attackInvolvesCard(b) ? -1 : 1
            );
        }
        return rowCards.map((card) => (
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
                size={this.props.user.settings.cardSize}
                source='play area'
                side={this.props.side}
            />
        ));
    }

    render() {
        let className = classNames('player-board', {
            'our-side': this.props.rowDirection === 'default'
        });

        return (
            <div className={className}>
                <div className='card-row'>{this.renderRow(this.props.cardsInPlay)}</div>
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
    user: PropTypes.object
};

export default PlayerBoard;
