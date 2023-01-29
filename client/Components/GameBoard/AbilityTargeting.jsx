import React from 'react';
import PropTypes from 'prop-types';
import CardImage from './CardImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import spellback from '../../assets/img/cardback-spell.png';

import './AbilityTargetting.scss';
import DieIcon from './DieIcon';

class AbilityTargeting extends React.Component {
    onMouseOver(event, card) {
        if (card && this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut(event, card) {
        if (card && this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    renderSimpleCard(card) {
        if (card.type === 'die') {
            return (
                <div className='target-die x-large  mb-2'>
                    <DieIcon key={'cld-' + card.uuid} die={card} />
                </div>
            );
        }
        if (!card.id) return '';

        let checkCard = card.location === 'deck' ? { facedown: true } : card;
        return (
            <div
                className='target-card vertical mb-2'
                onMouseOut={(event) => this.onMouseOut(event, checkCard)}
                onMouseOver={(event) => this.onMouseOver(event, checkCard)}
            >
                <CardImage card={checkCard} cardBack={spellback} />
            </div>
        );
    }

    render() {
        let targetCards = [];
        if (this.props.targets) {
            targetCards = this.props.targets.map((target) => this.renderSimpleCard(target));
        }
        return (
            <div className='prompt-control-targeting'>
                {this.renderSimpleCard(this.props.source)}
                {targetCards.length > 0 && <FontAwesomeIcon icon={faArrowRight} />}
                {targetCards}
            </div>
        );
    }
}

AbilityTargeting.displayName = 'AbilityTargeting';
AbilityTargeting.propTypes = {
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    source: PropTypes.object,
    targets: PropTypes.array
};

export default AbilityTargeting;
