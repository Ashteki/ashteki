import { faLink, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDeck } from '../../redux/actions';
import { PatreonStatus } from '../../types';
import DeckDice from './DeckDice';
import './DeckListEx.scss';
import CardListText from './CardListText';

const DeckListEx = ({ decks, onDeckSelected, showWinRate, allowInvalidSelection }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.account.user);
    const allowPremium = user?.patreon === PatreonStatus.Pledged || user?.permissions?.isSupporter;
    const [magicHover, setMagicHover] = useState('');
    const { selectedDeck } = useSelector((state) => ({
        selectedDeck: state.cards.selectedDeck
    }));

    const onDieHover = (die) => {
        // highlight cards with dice type
        setMagicHover(die.magic);
    };
    const doClick = (event, deck) => {
        if (!allowInvalidSelection && deck.status && !deck.status.legalToPlay) {
            return;
        }

        dispatch(selectDeck(deck));
        (!deck.premium || allowPremium) && onDeckSelected && onDeckSelected(deck);
    };

    return (
        <div className='deck-list-ex'>
            {decks.map((d, index) => {
                const idClass = d.listClass || d.phoenixborn[0].id;
                const hasChained = d.cards.some((c) => c.card.isChained);
                const icon = hasChained ? (
                    <FontAwesomeIcon icon={faLink} title='This deck contains chained cards' />
                ) : null;

                const isSelected = selectedDeck === d;
                const combinedCards = d.cards.concat(d.conjurations);

                const cardClasses = classNames('decklistex-entry', 'card', {
                    // 'selected-deck': isSelected,
                    invalid: d.status && !d.status.legalToPlay
                });
                return (
                    <div key={d.id} className={cardClasses}>
                        <div
                            className='decklistex-header card-header'
                            onClick={(event) => doClick(event, d)}
                        >
                            <div
                                className={`decklist-entry-image ${idClass}`}
                                title={d.phoenixborn[0].card.name}
                            >
                                <span className='sr-only'>{d.phoenixborn[0].card.name}</span>
                            </div>
                            <div className='decklistex-header-content'>
                                {/* <div className={`decklist-entry-image ${row.phoenixborn[0].id}`}></div> */}
                                <div>
                                    <button className='decklist-title' tabIndex={0}>{d.name}</button>&nbsp;
                                    {icon}
                                    <br />
                                    {d.mode !== 'chimera' && (
                                        <DeckDice deck={d} onDieHover={onDieHover} size='med' />
                                    )}
                                    {d.premium && !allowPremium && (
                                        <div className='premium-lozenge'>
                                            <FontAwesomeIcon icon={faLock} />
                                            &nbsp;Premium
                                        </div>
                                    )}
                                    {showWinRate && (
                                        <div className='win-rate'>
                                            Win rate: {d.winRate}%&nbsp;(of {d.played})
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='decklistex-body'>
                            <CardListText
                                deckCards={combinedCards}
                                highlight={magicHover}
                            />

                        </div>
                    </div>
                );
            })}
        </div>
    );
};

DeckListEx.displayName = 'DeckList';
export default DeckListEx;
