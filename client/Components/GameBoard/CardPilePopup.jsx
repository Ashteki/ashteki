import React from 'react';
import classNames from 'classnames';

import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';

const CardPilePopup = ({
    cards,
    disableMouseOver,
    manualMode,
    onCardClick,
    onCardAltClick,
    onCloseClick,
    onPlusClick,
    onMinusClick,
    onDragDrop,
    onMouseOut,
    onMouseOver,
    onTouchMove,
    popupLocation,
    popupMenu,
    showChains,
    size,
    source,
    title
}) => {
    let popup = null;
    let cardList = [];

    let listProps = {
        disableMouseOver: disableMouseOver,
        manualMode: manualMode,
        onCardClick: onCardClick,
        onCardAltClick: onCardAltClick,
        onCardMouseOut: onMouseOut,
        onCardMouseOver: onMouseOver,
        onTouchMove: onTouchMove,
        showChains: showChains,
        size: size,
        source: source
    };

    if (cards && cards.some((card) => card.group)) {
        const cardGroup = cards.reduce((grouping, card) => {
            (grouping[card.group] = grouping[card.group] || []).push(card);

            return grouping;
        }, {});
        const sortedKeys = Object.keys(cardGroup).sort();
        for (const key of sortedKeys) {
            cardList.push(
                <CardTiledList cards={cardGroup[key]} key={key} title={key} {...listProps} />
            );
        }
    } else {
        cardList = <CardTiledList cards={cards} {...listProps} />;
    }

    let popupClass = classNames('panel-body', {
        'our-side': popupLocation === 'bottom'
    });

    let innerClass = classNames('inner', size);
    let linkIndex = 0;

    let popupMenuToRender = popupMenu && (
        <div>
            {popupMenu.map((menuItem) => {
                return (
                    <a
                        className='btn btn-default'
                        key={linkIndex++}
                        onClick={() => {
                            menuItem.handler && menuItem.handler();

                            onCloseClick();
                        }}
                    >
                        {menuItem.text}
                    </a>
                );
            })}
        </div>
    );

    popup = (
        <MovablePanel
            title={title}
            name={source}
            onCloseClick={onCloseClick}
            onPlusClick={onPlusClick}
            onMinusClick={onMinusClick}
            side={popupLocation}>
            <Droppable onDragDrop={onDragDrop} source={source} manualMode={manualMode}>
                <div className={popupClass} onClick={(event) => event.stopPropagation()}>
                    {popupMenuToRender}
                    <div className={innerClass}>{cardList}</div>
                </div>
            </Droppable>
        </MovablePanel>
    );

    return popup;
};

export default CardPilePopup;
