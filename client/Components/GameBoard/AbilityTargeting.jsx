import React, { useCallback } from 'react';
import CardImage from './CardImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import './AbilityTargetting.scss';
import DieIcon from './DieIcon';

function AbilityTargeting({ trigger, source, targets, onMouseOver, onMouseOut, forceReveal }) {
    const handleMouseOver = useCallback((event, card) => {
        if (card && onMouseOver) {
            onMouseOver(event, card);
        }
    }, [onMouseOver]);

    const handleMouseOut = useCallback((event, card) => {
        if (card && onMouseOut) {
            onMouseOut(event, card);
        }
    }, [onMouseOut]);

    const renderSimpleCard = useCallback((card) => {
        if (!card) {
            return;
        }
        if (card.type === 'die') {
            return (
                <div className='target-die x-large  mb-2'>
                    <DieIcon key={'cld-' + card.uuid} die={card} />
                </div>
            );
        }
        if (!card.id) return '';

        let checkCard = !forceReveal && card.location === 'deck' ? { facedown: true } : card;
        return (
            <div
                className='target-card vertical mb-2'
                onMouseOut={(event) => handleMouseOut(event, checkCard)}
                onMouseOver={(event) => handleMouseOver(event, checkCard)}
            >
                <CardImage card={checkCard} />
            </div>
        );
    }, [forceReveal, handleMouseOut, handleMouseOver]);

    let targetCards = [];
    if (targets) {
        targetCards = targets.map((target) => renderSimpleCard(target));
    }

    return (
        <div className='prompt-control-targeting'>
            {renderSimpleCard(trigger)}
            {trigger && <FontAwesomeIcon icon={faChevronRight} />}
            {renderSimpleCard(source)}
            {targetCards.length > 0 && <FontAwesomeIcon icon={faArrowRight} />}
            {targetCards}
        </div>
    );
}

AbilityTargeting.displayName = 'AbilityTargeting';

export default AbilityTargeting;
