import React, { useState } from 'react';
import classNames from 'classnames';
import 'jquery-migrate';
import { useDrag } from 'react-dnd';

import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import CardImage from './CardImage';
import { ItemTypes } from '../../constants';
import SquishableCardPanel from './SquishableCardPanel';

import Die from './Die';

import './Card.scss';

const Card = ({
    canDrag,
    card,
    cardBackUrl,
    className,
    disableMouseOver,
    onClick,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    orientation = 'vertical',
    side,
    size,
    source,
    style,
    wrapped = true
}) => {
    const sizeClass = {
        [size]: size !== 'normal'
    };
    const [showMenu, setShowMenu] = useState(false);

    const [{ dragOffset, isDragging }, drag, preview] = useDrag({
        item: { card: card, source: source, type: ItemTypes.CARD },
        canDrag: () => canDrag || (!card.unselectable && card.canPlay),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            dragOffset: monitor.getSourceClientOffset()
        })
    });

    const isAllowedMenuSource = () => {
        return source === 'play area' || source === 'spellboard';
    };

    const onCardClicked = (event, card) => {
        event.preventDefault();
        event.stopPropagation();
        if (isAllowedMenuSource() && card.menu && card.menu.length !== 0) {
            setShowMenu(!showMenu);
            return;
        }

        onClick && onClick(card);
    };

    const getCountersForCard = (card) => {
        let counters = [];
        let needsFade = card.type === 'upgrade' && !['full deck'].includes(source);
        if (card.armor > 0) {
            counters.push({
                name: 'armor',
                count: card.armor,
                fade: needsFade,
                showValue: true
            });
        }

        if (card.guarded) {
            counters.push({
                name: 'guarded',
                count: 1,
                fade: needsFade,
                showValue: false
            });
        }

        for (const [key, token] of Object.entries(card.tokens || {})) {
            counters.push({
                name: key,
                count: token,
                fade: needsFade,
                showValue: true
            });
        }

        for (const upgrade of card.upgrades || []) {
            counters = counters.concat(getCountersForCard(upgrade));
        }

        return counters.filter((counter) => counter.count >= 0);
    };

    const getCardSizeMultiplier = () => {
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

    const getupgrades = () => {
        if (!['full deck', 'play area'].includes(source) || !card.upgrades) {
            return null;
        }

        let index = 1;
        let upgrades = card.upgrades.map((upgrade) => {
            let returnedupgrade = (
                <Card
                    key={upgrade.uuid}
                    source={source}
                    card={upgrade}
                    className={classNames('upgrade', `upgrade-${index}`)}
                    wrapped={false}
                    onMouseOver={
                        !disableMouseOver && onMouseOver
                            ? (upgrade) => onMouseOver(upgrade)
                            : undefined
                    }
                    onMouseOut={!disableMouseOver && onMouseOut}
                    onClick={onClick}
                    onMenuItemClick={onMenuItemClick}
                    size={size}
                />
            );

            index += 1;
            return returnedupgrade;
        });

        return upgrades;
    };

    const renderUnderneathCards = () => {
        // TODO: Right now it is assumed that all cards in the childCards array
        // are being placed underneath the current card. In the future there may
        // be other types of cards in this array and it should be filtered.
        let underneathCards = card.childCards;
        if (!underneathCards || underneathCards.length === 0) {
            return;
        }

        let maxCards = 1 + (underneathCards.length - 1) / 6;
        return (
            <SquishableCardPanel
                cardBackUrl={cardBackUrl}
                cardSize={size}
                cards={underneathCards}
                className='underneath'
                maxCards={maxCards}
                onCardClick={onClick}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
                source='underneath'
            />
        );
    };

    const getCardOrdering = () => {
        if (!card.order) {
            return null;
        }

        return <div className='card-ordering'>{card.order}</div>;
    };

    const shouldShowMenu = () => {
        if (!isAllowedMenuSource()) {
            return false;
        }

        if (!card.menu || !showMenu) {
            return false;
        }

        return true;
    };

    const showCounters = () => {
        if (['full deck'].includes(source)) {
            return true;
        }

        if (card.facedown || card.type === 'upgrade') {
            return false;
        }

        return true;
    };

    const isFacedown = () => {
        return card.facedown || !card.name;
    };

    const getDragFrame = (image) => {
        if (!isDragging) {
            return null;
        }

        let style = {};
        if (dragOffset && isDragging) {
            let x = dragOffset.x;
            let y = dragOffset.y;
            style = {
                left: x,
                top: y
            };
        }

        return (
            <div className='drag-preview' style={style} ref={preview}>
                {image}
            </div>
        );
    };

    const getBoostedFlags = (card) => {
        if (card.flags) {
            let flagItems = Object.keys(card.flags).map((key, index) => {
                return (
                    <div key={key + index} className={`darkbg flag ${key}`}>
                        {card.flags[key]}
                    </div>
                );
            });

            return <div className='flags'>{flagItems}</div>;
        }

        return '';
    };

    const getCard = () => {
        if (!card) {
            return <div />;
        }

        let statusClass = getStatusClass();

        let cardClass = classNames(
            'game-card',
            `card-type-${card.type}`,
            className,
            sizeClass,
            statusClass,
            {
                'custom-card': card.code && card.code.startsWith('custom'),
                horizontal: orientation !== 'vertical',
                vertical: orientation === 'vertical',
                'can-play':
                    statusClass !== 'selected' &&
                    statusClass !== 'selectable' &&
                    !card.unselectable &&
                    card.canPlay,
                unselectable: card.unselectable,
                dragging: isDragging,
                controlled: card.controlled
            }
        );
        let imageClass = classNames('card-image vertical', sizeClass, {
            exhausted: orientation === 'exhausted' || orientation === 'horizontal'
        });
        let image = card ? (
            <div className={imageClass}>
                <CardImage card={card} cardBack={cardBackUrl} />
                {getBoostedFlags(card)}
            </div>
        ) : null;
        let dice =
            card.dieUpgrades && card.dieUpgrades.length > 0 ? (
                <Die die={{ magic: 'charm', level: 'power' }} />
            ) : null;

        return (
            <div className='card-frame' ref={drag}>
                {getDragFrame(image)}
                {getCardOrdering()}
                <div
                    className={cardClass}
                    onMouseOver={
                        !disableMouseOver && !isFacedown() && onMouseOver
                            ? () => onMouseOver(card)
                            : undefined
                    }
                    onMouseOut={!disableMouseOver && !isFacedown() ? onMouseOut : undefined}
                    onClick={(event) => onCardClicked(event, card)}
                >
                    <div>
                        <span className='card-name'>{card.name}</span>
                        {image}
                    </div>
                    {showCounters() && <CardCounters counters={getCountersForCard(card)} />}
                    {dice}
                </div>
                {shouldShowMenu() && (
                    <CardMenu
                        menu={card.menu}
                        side={side}
                        onMenuItemClick={(menuItem) => {
                            onMenuItemClick && onMenuItemClick(card, menuItem);
                            setShowMenu(!showMenu);
                        }}
                    />
                )}
            </div>
        );
    };

    const getStatusClass = () => {
        if (!card) {
            return undefined;
        }

        if (card.selected) {
            return 'selected';
        } else if (card.selectable) {
            return 'selectable';
        } else if (card.new) {
            return 'new';
        }

        return undefined;
    };

    let styleCopy = Object.assign({}, style);
    if (card.upgrades) {
        styleCopy.top = card.upgrades.length * (15 * getCardSizeMultiplier());
    }
    if (wrapped) {
        return (
            <div className='card-wrapper' style={style}>
                {getCard()}
                {getupgrades()}
                {renderUnderneathCards()}
            </div>
        );
    }

    return getCard();
};

Card.displayName = 'Card';

export default Card;
