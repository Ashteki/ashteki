import React from 'react';
import classNames from 'classnames';

import Card from './Card';
import CardPilePopup from './CardPilePopup';

import './CardPile.scss';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

const CardPile = ({
    cardBackUrl,
    cards,
    cardCount,
    className,
    closeOnClick,
    disableMouseOver,
    disablePopup,
    hiddenTopCard,
    manualMode,
    onCardClick,
    onCardAltClick,
    onDragDrop,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    onPileClick,
    onPopupChange,
    onTouchMove,
    orientation = 'vertical',
    player,
    popupLocation = 'bottom',
    popupMenu,
    showAltIcon,
    showChains,
    size,
    source,
    title
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [manualPopup, setManualPopup] = useState(false);
    const updatePopupVisibility = useCallback(
        (value) => {
            setShowPopup(value);

            onPopupChange && onPopupChange({ source: source, visible: value });
        },
        [source, onPopupChange]
    );

    useEffect(() => {
        if (manualPopup) {
            return;
        }

        if (cards?.some((card) => card.selectable)) {
            updatePopupVisibility(true);
        } else {
            updatePopupVisibility(false);
        }
    }, [cards, manualPopup, updatePopupVisibility]);

    let classNameStr = classNames('panel', 'card-pile', className, {
        [size]: size !== 'normal',
        horizontal: orientation === 'horizontal' || orientation === 'exhausted',
        vertical: orientation === 'vertical'
    });

    let count = cardCount || (cards ? cards.length : 0);
    let cardCountStr = cardCount || (cards ? cards.length : '0');
    let headerText = title ? `${title} (${cardCountStr})` : '';
    let topCard = cards ? cards[0] : null;
    let cardOrientation =
        orientation === 'horizontal' && topCard && topCard.facedown ? 'exhausted' : orientation;

    if (hiddenTopCard && count > 0) {
        topCard = { facedown: true };
    }

    const onPileClicked = () => {
        onPileClick && onPileClick(source);
    };

    return (
        <div
            className={classNameStr}
            onClick={() => {
                if (!disablePopup) {
                    updatePopupVisibility(!showPopup);
                    setManualPopup(!showPopup);
                }
            }}
        >
            <div className='panel-header'>{headerText}</div>
            {topCard ? (
                <Card
                    cardBackUrl={cardBackUrl}
                    canDrag={manualMode}
                    card={topCard}
                    source={source}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    disableMouseOver={hiddenTopCard}
                    onClick={() => {
                        if (player.canSelectDeck) {
                            onPileClicked();
                        } else {
                            updatePopupVisibility(!showPopup);
                            setManualPopup(!showPopup);
                        }
                    }}
                    onMenuItemClick={onMenuItemClick}
                    orientation={cardOrientation}
                    size={size}
                />
            ) : (
                <div className='card-placeholder' />
            )}
            {!disablePopup && showPopup && (
                <CardPilePopup
                    cardBackUrl={cardBackUrl}
                    cards={cards}
                    disableMouseOver={disableMouseOver}
                    manualMode={manualMode}
                    onCardClick={(card) => {
                        // auto close
                        if (closeOnClick) {
                            updatePopupVisibility(false);
                            setManualPopup(false);
                        }

                        // call handler
                        onCardClick && onCardClick(card);
                    }}
                    onCardAltClick={onCardAltClick}
                    onCloseClick={() => {
                        updatePopupVisibility(!showPopup);
                        setManualPopup(!showPopup);
                    }}
                    onDragDrop={onDragDrop}
                    onMouseOut={onMouseOut}
                    onMouseOver={onMouseOver}
                    onTouchMove={onTouchMove}
                    popupLocation={popupLocation}
                    popupMenu={popupMenu}
                    showAltIcon={showAltIcon}
                    showChains={showChains}
                    size={size}
                    source={source}
                    title={title}
                />
            )}
        </div>
    );
};

CardPile.displayName = 'CardPile';
CardPile.defaultProps = {
    popupLocation: 'bottom',
    orientation: 'vertical'
};

export default CardPile;
