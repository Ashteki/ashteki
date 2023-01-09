import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames';
import 'jquery-migrate';
import { useDrag } from 'react-dnd';

import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import CardImage from './CardImage';
import { ItemTypes, UpgradeCardTypes } from '../../constants';
import SquishableCardPanel from './SquishableCardPanel';
import spellback from '../../assets/img/cardback-spell.png';
import conjback from '../../assets/img/cardback-conjuration.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import Die from './Die';

import './Card.scss';
import { sendGameMessage } from '../../redux/actions';

const Card = ({
    canDrag,
    card,
    cardBackUrl,
    className,
    disableMouseOver,
    onClick,
    onAltClick,
    onDieClick,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    orientation = 'vertical',
    showAltIcon,
    side,
    size,
    source,
    style,
    wrapped = true
}) => {
    const cardBack = cardBackUrl || (card.isConjuration ? conjback : spellback);
    const sizeClass = {
        [size]: size !== 'normal'
    };
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const gameRound = useSelector((state) => state.lobby.currentGame?.round);

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

    // const isAllowedInspector = () => {
    //     return manualMode && (source === 'play area' || source === 'spellboard');
    // };

    const onCardClicked = (event, card) => {
        event.preventDefault();
        event.stopPropagation();
        // if (isAllowedInspector()) {
        //     dispatch(sendGameMessage('inspectCard', card.uuid));
        // }
        if (isAllowedMenuSource() && card.menu && card.menu.length !== 0) {
            setShowMenu(!showMenu);
            return;
        }

        onClick && onClick(card);
    };

    const getCountersForCard = (card) => {
        let counters = [];
        let needsFade = UpgradeCardTypes.includes(card.type) && !['full deck'].includes(source);
        if (card.acquiredEffects?.length) {
            card.acquiredEffects.forEach((e) => {
                counters.push({
                    icon: e.effect,
                    name: e.name,
                    count: 1,
                    fade: needsFade,
                    showValue: false
                });
            });
        }
        if (card.armor > 0) {
            counters.push({
                name: 'armor',
                count: card.armor,
                fade: needsFade,
                showValue: true
            });
        }

        if (card.guarded || card.cannotBlock) {
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

        return counters.filter((counter) => counter.count > 0);
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
        if (!['full deck', 'play area', 'spellboard'].includes(source)) {
            return null;
        }

        if (['full deck', 'play area'].includes(source) && !card.upgrades) {
            return null;
        }
        if ('spellboard' === source && !card.childCards) {
            return null;
        }

        let index = 1;
        const cardsToRender = 'spellboard' === source
            ? card.childCards
            : card.upgrades;
        let upgrades = cardsToRender.map((upgrade) => {
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
        if (!underneathCards || underneathCards.length === 0 || card.location === 'spellboard') {
            return;
        }

        let maxCards = 1 + (underneathCards.length - 1) / 6;
        return (
            <SquishableCardPanel
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

        if (card.facedown || UpgradeCardTypes.includes(card.type)) {
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
            let flagItems = Object.keys(card.flags)
                .sort((a, b) => (a < b ? -1 : 1))
                .map((key, index) => {
                    return (
                        <div key={key + index} className={`darkbg flag ${key}`}>
                            <span className='sr-only'>{key[0]}</span>
                            {card.flags[key]}
                        </div>
                    );
                });

            return <div className='flags'>{flagItems}</div>;
        }

        return '';
    };

    const getChainIcon = (card) => {
        if (card.isChained) {
            const chainClass = gameRound > 1 ? 'card-chain-ok' : 'card-chain-bad';
            return (
                <div className={chainClass}>
                    <FontAwesomeIcon icon={faLink} />
                </div>
            );
        }
        return '';
    };

    const getAltIcon = (card) => {
        if (showAltIcon && card.altArts) {
            return (
                <div className='card-alt-icon'>
                    <button className=''
                        onClick={() => onAltClick(card)}
                    >Alt</button>
                </div>
            );
        }
        return '';
    };

    const getCard = () => {
        if (!card) {
            return <div />;
        }

        let statusClass = getStatusClass();
        const combatClass = card.isAttacker || card.isDefender ? 'combat-' + side : null;

        let cardClass = classNames(
            'game-card',
            `card-type-${card.type}`,
            className,
            sizeClass,
            statusClass,
            combatClass,
            {
                'custom-card': card.code && card.code.startsWith('custom'),
                horizontal: orientation !== 'vertical',
                vertical: orientation === 'vertical',
                'can-play':
                    statusClass !== 'selected' &&
                    statusClass !== 'selectable' &&
                    !card.unselectable &&
                    !card.isAttacker &&
                    !card.isDefender &&
                    card.canPlay,
                unselectable: !card.selected && card.unselectable,
                dragging: isDragging,
                controlled: card.controlled,
                attacker: card.isAttacker,
                defender: card.isDefender
            }
        );
        let imageClass = classNames('card-image vertical', sizeClass, {
            exhausted: orientation === 'exhausted' || orientation === 'horizontal'
        });
        let image = card ? (
            <div className={imageClass}>
                <CardImage card={card} cardBack={cardBack} />
                {getChainIcon(card)}
                {getBoostedFlags(card)}
            </div>
        ) : null;
        let dice =
            card.dieUpgrades && card.dieUpgrades.length > 0
                ? card.dieUpgrades.map((d) => (
                    <Die key={'dup-' + d.uuid} die={d} onClick={onDieClick} />
                ))
                : null;

        const mouseOverAllowed = !disableMouseOver
            && (!isFacedown() || !card.parent) && onMouseOver;
        return (
            <div className='card-frame' ref={drag}>
                {getDragFrame(image)}
                {getCardOrdering()}
                <div
                    tabIndex={0}
                    className={cardClass}
                    onMouseOver={mouseOverAllowed ? () => onMouseOver(card) : undefined}
                    onMouseOut={!disableMouseOver && !isFacedown() ? onMouseOut : undefined}
                    onClick={(event) => onCardClicked(event, card)}
                >
                    <div>
                        <span className='card-name'>{card.name}</span>
                        {image}
                    </div>
                    {showCounters() && <CardCounters counters={getCountersForCard(card)} />}
                    <div className='die-upgrades'>{dice}</div>
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

        // location prevents highlighting cards we're about to meditate
        if (card.selected && card.location !== 'deck') {
            return 'selected';
        } else if (card.selectable) {
            // if (card.isAttacker) return 'attacker-' + side + ' selectable ';
            return 'selectable';
            // } else if (card.isAttacker) {
            //     return 'attacker-' + side;
            // } else if (card.isDefender) {
            //     return 'defender-' + side;
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
            <div className={'card-wrapper'} style={style}>
                {getAltIcon(card)}

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
