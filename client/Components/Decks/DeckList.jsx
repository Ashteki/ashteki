import React, { useState, useEffect, useRef, useContext } from 'react';
import { Accordion, AccordionContext, Card, Col, Form, useAccordionToggle } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faHeart, faLink, faLock } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Pagination from 'react-bootstrap-4-pagination';

import {
    loadDecks,
    selectDeck,
    loadStandaloneDecks,
    loadAdventuringPartyDecks,
    loadBuildingBasicsDecks,
    loadFirstAdventureDecks,
    loadPveDecks,
    loadChimeraDecks,
    loadMSUDecks
} from '../../redux/actions';

import './DeckList.scss';
import { PatreonStatus } from '../../types';
import DeckDice from './DeckDice';

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

const DeckList = ({ onDeckSelected, showToggle, standaloneDecks = 0 }) => {
    const [pagingDetails, setPagingDetails] = useState({
        pageSize: 10,
        page: 1,
        sort: 'lastUpdated',
        sortDir: 'desc',
        filter: []
    });
    const user = useSelector((state) => state.account.user);
    const allowPremium = user?.patreon === PatreonStatus.Pledged || user?.permissions.isSupporter;
    const showRestricted = user?.permissions.canVerifyDecks;
    const [showFaves, setShowFaves] = useState(false);
    const [pbFilter, setPbFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const dispatch = useDispatch();

    const getDecks = (state) => {
        switch (standaloneDecks) {
            case 1:
                return state.cards.standaloneDecks;
            case 2:
                return state.cards.adventuringPartyDecks;
            case 3:
                return state.cards.buildingBasicsDecks;
            case 4:
                return state.cards.firstAdventureDecks;
            case 5:
                return state.cards.chimeraDecks.filter((d) => showRestricted || !d.restricted);
            case 6:
                return state.cards.pveDecks;
            case 7:
                return state.cards.msuDecks;
            default:
                return state.cards.decks;
        }
    };

    const { decks, numDecks, selectedDeck, allCards, deckReload } = useSelector((state) => ({
        decks: getDecks(state),
        numDecks: state.cards.numDecks,
        selectedDeck: standaloneDecks ? null : state.cards.selectedDeck,
        allCards: state.cards.cards,
        deckReload: state.cards.deckReload
    }));

    useEffect(() => {
        if (standaloneDecks == 1) {
            dispatch(loadStandaloneDecks());
        } else if (standaloneDecks == 2) {
            dispatch(loadAdventuringPartyDecks());
        } else if (standaloneDecks == 3) {
            dispatch(loadBuildingBasicsDecks());
        } else if (standaloneDecks == 4) {
            dispatch(loadFirstAdventureDecks());
        } else if (standaloneDecks == 5) {
            dispatch(loadChimeraDecks());
        } else if (standaloneDecks == 6) {
            dispatch(loadPveDecks());
        } else if (standaloneDecks == 7) {
            dispatch(loadMSUDecks());
        } else {
            dispatch(loadDecks(pagingDetails));
        }

        $('.filter-label').parent().parent().hide();
    }, [pagingDetails, dispatch, standaloneDecks, deckReload]);

    const doClick = (event, deck) => {
        dispatch(selectDeck(deck));
        (!deck.premium || allowPremium) && onDeckSelected && onDeckSelected(deck);
    };

    const onPageClick = (page) => {
        let newPageData = Object.assign({}, pagingDetails);
        newPageData.page = page;
        setPagingDetails(newPageData);
    };

    let onNameChange = debounce((event) => {
        event.preventDefault();
        event.stopPropagation();
        const newPageData = Object.assign({}, pagingDetails);
        updateFilter(newPageData, 'name', event.target.value);
        setPagingDetails(newPageData);
    }, 500);

    let onPbChange = debounce((event) => {
        const newPageData = Object.assign({}, pagingDetails);
        updateFilter(newPageData, 'pb', event.target.value);
        setPagingDetails(newPageData);
    }, 500);

    const updateFilter = (newPageData, key, value) => {
        const i = newPageData.filter.findIndex((f) => f.name === key);
        if (i > -1) {
            newPageData.filter.splice(i, 1);
        }
        newPageData.filter.push({
            name: key,
            value: value
        });
    }

    const handleFaveChange = () => {
        setShowFaves(!showFaves);
        const newPageData = Object.assign({}, pagingDetails);
        updateFilter(newPageData, 'favourite', !showFaves);
        setPagingDetails(newPageData);
    };

    let phoenixbornCards = [];
    for (let c in allCards) {
        if (allCards[c].type == 'Phoenixborn') {
            phoenixbornCards.push(allCards[c]);
        }
    }
    phoenixbornCards.sort((a, b) => (a.name < b.name ? -1 : 1));

    return (
        <div className='deck-list'>
            {!standaloneDecks && (
                <div >
                    <Form onSubmit={(event) => event.preventDefault()}>
                        <Form.Row>
                            <Form.Group as={Col} controlId='formGridName'>
                                <Form.Control
                                    name='name'
                                    type='text'
                                    onChange={(event) => {
                                        event.persist();
                                        onNameChange(event);
                                    }}
                                    placeholder='Filter by name'
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId='phoenixborn'>
                                <Form.Control
                                    as='select'
                                    onChange={(event) => {
                                        event.persist();
                                        onPbChange(event);
                                    }}
                                    // value={this.pbid}
                                    placeholder={'Filter by PB'}
                                >
                                    <option key='-1' value=''>
                                        All Phoenixborn
                                    </option>
                                    {phoenixbornCards.map((c, index) => {
                                        return (
                                            <option key={index} value={c.stub}>
                                                {c.name}
                                            </option>
                                        );
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} controlId='favourite' xs='1' className='fave-hdr'>
                                <FontAwesomeIcon icon={faHeart} title='Remove from favourites' />
                                <Form.Check // prettier-ignore
                                    type='switch'
                                    id='custom-switch'
                                    onChange={handleFaveChange}
                                />
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </div>
            )}

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
                            <Card.Header className='decklist-accordion-header' onClick={(event) => doClick(event, d)}>
                                <div className={`decklist-entry-image ${idClass}`} title={d.phoenixborn[0].card.name}><span className='sr-only'>{d.phoenixborn[0].card.name}</span></div>
                                <div className='decklist-entry'>
                                    {/* <div className={`decklist-entry-image ${row.phoenixborn[0].id}`}></div> */}
                                    <div>
                                        <span className='decklist-title'>{d.name}</span>&nbsp;
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
                                <div className='win-rate'>
                                    <span>{d.winRate}%</span>
                                    <br />
                                    (of {d.played})
                                </div>
                                {showToggle && <ContextAwareToggle eventKey={index + 1}>Click me!</ContextAwareToggle>}
                            </Card.Header>
                            <Accordion.Collapse eventKey={index + 1}>
                                <Card.Body>Hello! I'm the body</Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    )
                })}
            </Accordion>
            {decks?.length > 0 && <div className='pagination-wrapper'>
                <Pagination
                    className='pager'
                    totalPages={numDecks / 10}
                    currentPage={pagingDetails.page}
                    showMax={7}
                    onClick={onPageClick}
                    prevNext={false}
                />
            </div>}
        </div>
    );
};

DeckList.displayName = 'DeckList';
export default DeckList;


