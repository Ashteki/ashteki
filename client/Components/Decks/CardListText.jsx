import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Zoomable from './Zoomable';

const CardListText = ({ deckCards, highlight, onFFClick }) => {
    const usesHighlightMagic = (card) => {
        return card.card.dice?.includes(highlight) || card.card.altDice?.includes(highlight);
    };

    const getCardsToRender = () => {
        let cardsToRender = [];
        let groupedCards = {};

        deckCards.forEach((card) => {
            let type = card.card.type;

            if (card.card.blood) {
                type = `${card.card.blood} Blood ${type}`;
            }
            if (!groupedCards[type]) {
                groupedCards[type] = [card];
            } else {
                groupedCards[type].push(card);
            }
        });

        const keys = [
            'Ready Spell',
            'Ally',
            'Alteration Spell',
            'Action Spell',
            'Reaction Spell',
            'Conjuration',
            '1 Blood Aspect',
            '2 Blood Aspect',
            'Conjured Alteration Spell',
            'Conjured Aspect'
        ];
        for (let key of keys) {
            if (!groupedCards[key] || groupedCards[key].length < 1) {
                continue;
            }
            let cardList = groupedCards[key].sort((a, b) => a.id > b.id ? 1 : -1);

            let cards = [];
            let count = 0;

            cardList.forEach((card) => {
                let chainedIcon = null;
                if (card.card.isChained) {
                    chainedIcon = (
                        <FontAwesomeIcon icon={faLink} title='This card is on the chained list' />
                    );
                }
                const linkClasses = classNames('card-link', {
                    unique: card.phoenixborn,
                    highlight: usesHighlightMagic(card),
                    ff: card.ff
                });
                const countClass = card.count > 3 && !card.card?.type.includes('Conjur') ? 'invalidCount' : '';

                cards.push(
                    <div className='card-list-text' key={'text-' + card.card.id}>
                        <span className={countClass}>{card.count + 'x '}</span>
                        <Zoomable card={card.card}>
                            <span className={linkClasses}>{card.card.name}</span>
                        </Zoomable>
                        &nbsp;
                        {chainedIcon}
                    </div>
                );
                count += parseInt(card.count);
            });

            cardsToRender.push(
                <div className='cards-no-break' key={key}>
                    <div className='card-group-title'>{key + ' (' + count.toString() + ')'}</div>
                    <div key={key} className='deck-card-group'>
                        {cards}
                    </div>
                </div>
            );
        }

        return cardsToRender;
    };

    return (
        <div className='cards'>{getCardsToRender(deckCards)}</div>
    );
};

export default CardListText;
