import React, { useState } from 'react';
import classNames from 'classnames';

import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';

const CardPilePopup = ({
    cards,
    disableMouseOver,
    manualMode,
    showAlphaSort,
    onCardClick,
    onCardAltClick,
    onCloseClick,
    onPlusClick,
    onMinusClick,
    onDragDrop,
    onMenuItemClick,
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
    const [alphaSort, setAlphaSort] = useState(false);
    const onAlphaClick = () => {
        setAlphaSort(!alphaSort);
    };
    const cardsSorted = alphaSort ? [...cards].sort((a, b) => a.name.localeCompare(b.name)) : cards;

    let popup = null;
    let cardList = [];

    let listProps = {
        disableMouseOver: disableMouseOver,
        manualMode: manualMode,
        onCardClick: onCardClick,
        onCardAltClick: onCardAltClick,
        onMenuItemClick: onMenuItemClick,
        onCardMouseOut: onMouseOut,
        onCardMouseOver: onMouseOver,
        onTouchMove: onTouchMove,
        showChains: showChains,
        size: size,
        source: source
    };

    if (cardsSorted && cardsSorted.some((card) => card.group)) {
        const cardGroup = cardsSorted.reduce((grouping, card) => {
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
        cardList = <CardTiledList cards={cardsSorted} {...listProps} />;
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
            onAlphaClick={onAlphaClick}
            showAlphaSort={showAlphaSort}
            alphaSort={alphaSort}
            onCloseClick={onCloseClick}
            onPlusClick={onPlusClick}
            onMinusClick={onMinusClick}
            side={popupLocation}>
            <Droppable onDragDrop={onDragDrop} source={source} manualMode={manualMode}>
                <div className={popupClass} onClick={(event) => event.stopPropagation()}>
                    {popupMenuToRender}
                    {/* <div className={innerClass}> */}
                    {cardList}
                    {/* </div> */}
                </div>
            </Droppable>
        </MovablePanel>
    );

    return popup;
};

export default CardPilePopup;
