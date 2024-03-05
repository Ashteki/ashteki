import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Accordion, AccordionContext, Card, useAccordionToggle } from 'react-bootstrap';
import DeckDice from './DeckDice';
import classNames from 'classnames';
import { faAngleDown, faAngleUp, faLink, faLock } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { selectDeck } from '../../redux/actions';

function ContextAwareToggle({ children, eventKey, callback }) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(eventKey, () => callback && callback(eventKey));

    const isCurrentEventKey = currentEventKey === eventKey;
    const icon = isCurrentEventKey ? faAngleUp : faAngleDown;
    return (
        <FontAwesomeIcon
            className='toggle'
            icon={icon}
            onClick={decoratedOnClick}
        ></FontAwesomeIcon>
    );
}

const DeckListItems = ({ decks, selectedDeck, allowPremium, showToggle, showWinRate, onDeckSelected }) => {
    const dispatch = useDispatch();

    const doClick = (event, deck) => {
        dispatch(selectDeck(deck));
        (!deck.premium || allowPremium) && onDeckSelected && onDeckSelected(deck);
    };

    return (
        <Accordion>
            {decks.map((d, index) => {
                const idClass = d.listClass || d.phoenixborn[0].id;
                const hasChained = d.cards.some((c) => c.card.isChained);
                const icon = hasChained ? (
                    <FontAwesomeIcon icon={faLink} title='This deck contains chained cards' />
                ) : null;
                const dice = d.mode !== 'chimera' && <DeckDice deck={d} />;
                const isSelected = selectedDeck === d;
                const cardClasses = classNames('decklist-card', {
                    'selected-deck': isSelected
                });
                return (
                    <Card key={d} className={cardClasses}>
                        <Card.Header
                            className='decklist-accordion-header'
                            onClick={(event) => doClick(event, d)}
                        >
                            <div
                                className={`decklist-entry-image ${idClass}`}
                                title={d.phoenixborn[0].card.name}
                            >
                                <span className='sr-only'>{d.phoenixborn[0].card.name}</span>
                            </div>
                            <div className='decklist-entry'>
                                {/* <div className={`decklist-entry-image ${row.phoenixborn[0].id}`}></div> */}
                                <div>
                                    <button className='decklist-title' tabIndex={0}>{d.name}</button>&nbsp;
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
                            {showWinRate && (<div className='win-rate'>
                                <span>{d.winRate}%</span>
                                <br />
                                (of {d.played})
                            </div>)}
                            {showToggle && (
                                <ContextAwareToggle eventKey={index + 1}>
                                    Click me!
                                </ContextAwareToggle>
                            )}
                        </Card.Header>
                        <Accordion.Collapse eventKey={index + 1}>
                            <Card.Body>Hello! I'm the body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                );
            })}
        </Accordion>
    );
};

export default DeckListItems;
