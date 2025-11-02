import { faLink, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDeck } from '../../redux/actions';
import { PatreonStatus } from '../../types';
import DeckDice from './DeckDice';
import './DeckGrid.scss';

const DeckGrid = ({ decks, onDeckSelected, showWinRate }) => {
    const user = useSelector((state) => state.account.user);
    const allowPremium = user?.patreon === PatreonStatus.Pledged || user?.permissions?.isSupporter;

    const { selectedDeck } = useSelector((state) => ({
        selectedDeck: state.cards.selectedDeck
    }));

    const dispatch = useDispatch();

    const doClick = (event, deck) => {
        dispatch(selectDeck(deck));
        (!deck.premium || allowPremium) && onDeckSelected && onDeckSelected(deck);
    };

    return (
        <div className='deck-grid'>
            {decks.map((d, index) => {
                const idClass = d.listClass || d.phoenixborn[0].id;
                const hasChained = d.cards.some((c) => c.card.isChained);
                const icon = null;
                // hasChained ? (
                //     <FontAwesomeIcon icon={faLink} title='This deck contains chained cards' />
                // ) : null;
                const dice = d.mode !== 'chimera' && <DeckDice deck={d} />;
                const isSelected = selectedDeck === d;
                const cardClasses = classNames('deckgrid-card', {
                    'selected-deck': isSelected
                });
                return (
                    <div key={d} className={cardClasses} onClick={(event) => doClick(event, d)}>
                        <div
                            className={`decklist-entry-image ${idClass}`}
                            title={d.phoenixborn[0].card.name}
                        >
                            <span className='sr-only'>{d.phoenixborn[0].card.name}</span>
                        </div>
                        <div className='deckgrid-entry'>
                            {/* <div className={`decklist-entry-image ${row.phoenixborn[0].id}`}></div> */}
                            <div>
                                <button className='deckgrid-title' tabIndex={0}>
                                    {d.name}
                                </button>
                                &nbsp;
                                {icon}
                                <br />
                                {dice}
                                {d.premium && !allowPremium && (
                                    <div className='premium-lozenge'>
                                        <FontAwesomeIcon icon={faLock} />
                                        &nbsp;Premium
                                    </div>
                                )}
                            </div>
                        </div>
                        {showWinRate && (
                            <div className='win-rate'>
                                <span>{d.winRate}%</span>
                                <br />
                                (of {d.played})
                            </div>
                        )}

                    </div>
                );
            })}
        </div>
    );
};

DeckGrid.displayName = 'DeckList';
export default DeckGrid;
