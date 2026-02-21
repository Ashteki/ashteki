import React, { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { withTranslation } from 'react-i18next';

import Card from './Card';

import './SquishableCardPanel.scss';

function SquishableCardPanel({
    cards,
    maxCards,
    title,
    side,
    rotateHeader,
    className,
    cardSize,
    manualMode,
    onCardClick,
    onCardAltClick,
    onDieClick,
    onMouseOver,
    onMouseOut,
    onMenuItemClick,
    focusDupes,
    groupVisibleCards,
    reverse,
    source,
    i18n,
    t
}) {
    const getCardDimensions = useCallback(() => {
        let multiplier = getCardSizeMultiplier(cardSize);
        return {
            width: 65 * multiplier,
            height: 91 * multiplier
        };
    }, [cardSize]);

    const getCardSizeMultiplier = (size) => {
        switch (size) {
            case 'small':
                return 0.6;
            case 'large':
                return 1.4;
            case 'x-large':
                return 2;
        }
        return 1;
    };

    const getOverallDimensions = useCallback(() => {
        let cardDimensions = getCardDimensions();
        return {
            width: (cardDimensions.width + 5) * maxCards,
            height: cardDimensions.height
        };
    }, [maxCards, getCardDimensions]);

    const hasMixOfVisibleCards = useCallback(() => {
        return (
            cards.some((card) => !!card.code) &&
            cards.some((card) => !card.code)
        );
    }, [cards]);

    const getCards = useCallback((needsSquish) => {
        let overallDimensions = getOverallDimensions();
        let dimensions = getCardDimensions();

        let cardList = [...cards];
        let cardIndex = 0;
        let handLength = cardList ? cardList.length : 0;
        let cardWidth = dimensions.width;

        let requiredWidth = handLength * cardWidth;
        let overflow = requiredWidth - overallDimensions.width;
        let offset = overflow / (handLength - 1);

        cardList = cardList.sort((a, b) => (a.cardSlot < b.cardSlot ? -1 : 1));
        if (groupVisibleCards && hasMixOfVisibleCards()) {
            cardList = cardList.sort((a, b) => (a.facedown && !b.facedown ? -1 : 1));
        }

        let lastCardSlot = '';
        let focusLeftDelta = 0;
        let hand = cardList.map((card, i) => {
            if (focusDupes && lastCardSlot === card.cardSlot) {
                focusLeftDelta += -47;
            }
            lastCardSlot = card.cardSlot;
            let left = 0;
            if (needsSquish) {
                left = (cardWidth - offset) * cardIndex++;
            }
            left = left + focusLeftDelta;

            let style = {};
            if (needsSquish || focusLeftDelta !== 0) {
                style = {
                    left: left + 'px'
                };
            }

            if (reverse) {
                style.zIndex = -i;
            }
            return (
                <Card
                    key={card.uuid}
                    card={card}
                    disableMouseOver={!card.name}
                    canDrag={manualMode}
                    onClick={onCardClick}
                    onAltClick={onCardAltClick}
                    onDieClick={onDieClick}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    onMenuItemClick={onMenuItemClick}
                    side={side}
                    size={cardSize}
                    style={style}
                    language={i18n.language}
                    source={source}
                />
            );
        });

        return hand;
    }, [cards, maxCards, cardSize, manualMode, onCardClick, onCardAltClick, onDieClick, onMouseOver, onMouseOut, onMenuItemClick, side, focusDupes, groupVisibleCards, reverse, source, i18n, hasMixOfVisibleCards, getOverallDimensions, getCardDimensions]);

    let dimensions = getOverallDimensions();
    let needsSquish = cards && cards.length > maxCards;
    let renderedCards = getCards(needsSquish);

    let panelClassName = classNames('squishable-card-panel', className, {
        [cardSize]: cardSize !== 'normal',
        squish: needsSquish,
        rotated: rotateHeader
    });

    let style = {
        minWidth: dimensions.width + 'px',
        height: dimensions.height + 'px'
    };

    let panelHeaderStyle = rotateHeader ? 'panel-header-rotated' : 'panel-header';
    let opponentSrText = side === 'top' ? <span className='sr-only'>Opponent&apos;s</span> : null;

    return (
        <div className={panelClassName} style={style}>
            {title && (
                <h3 className={panelHeaderStyle}>
                    {opponentSrText}
                    {title}&nbsp;
                    <span aria-hidden={true}>(</span>
                    {renderedCards.length}
                    <span aria-hidden={true}>)</span>
                </h3>
            )}
            {renderedCards}
        </div>
    );
}

SquishableCardPanel.displayName = 'SquishableCardPanel';

export default withTranslation()(SquishableCardPanel);
