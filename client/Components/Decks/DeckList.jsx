import React, { useState, useEffect, useRef } from 'react';
import { Col, Form } from 'react-bootstrap';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faLink } from '@fortawesome/free-solid-svg-icons';

import ZoomableCard from './ZoomableCard';
import {
    loadDecks,
    selectDeck,
    loadStandaloneDecks,
    loadAdventuringPartyDecks,
    loadBuildingBasicsDecks,
    loadFirstAdventureDecks,
    loadPveDecks,
    loadChimeraDecks
} from '../../redux/actions';

import './DeckList.scss';
import DiceRack from './DiceRack';

const DeckList = ({ onDeckSelected, standaloneDecks = 0 }) => {
    const [pagingDetails, setPagingDetails] = useState({
        pageSize: 10,
        page: 1,
        sort: 'lastUpdated',
        sortDir: 'desc',
        filter: []
    });

    const [showFaves, setShowFaves] = useState(false);
    const pbFilter = useRef(null);
    const nameFilter = useRef(null);
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
                return state.cards.chimeraDecks;
            case 6:
                return state.cards.pveDecks;
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
        } else {
            dispatch(loadDecks(pagingDetails));
        }

        $('.filter-label').parent().parent().hide();
    }, [pagingDetails, dispatch, standaloneDecks, deckReload]);

    const selectRow = {
        mode: 'radio',
        clickToSelect: true,
        hideSelectColumn: true,
        selected: decks && selectedDeck ? [decks.find((d) => d._id === selectedDeck._id)?._id] : [],
        classes: 'selected-deck',
        onSelect: (deck, isSelect) => {
            if (isSelect) {
                dispatch(selectDeck(deck));
            }
        }
    };

    const rowEvents = {
        onClick: (event, deck) => {
            onDeckSelected && onDeckSelected(deck);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const rowClasses = (row) => {
        if (row.mode === 'chimera') {
            return '';
        }

        if (!row.status.basicRules) {
            return 'invalid';
        }

        if (!row.status.hasConjurations) {
            return 'conjurations';
        }

        return '';
    };

    /**
     * @param {any} type
     * @param {PagingDetails} data
     */
    const onTableChange = (type, data) => {
        let newPageData = Object.assign({}, pagingDetails);
        switch (type) {
            case 'pagination':
                if (
                    (pagingDetails.page !== data.page && data.page !== 0) ||
                    (pagingDetails.pageSize !== data.sizePerPage && data.sizePerPage !== 0)
                ) {
                    newPageData.page = data.page || pagingDetails.page;
                    newPageData.pageSize = data.sizePerPage;
                }

                break;
            case 'sort':
                newPageData.sort = data.sortField;
                newPageData.sortDir = data.sortOrder;

                break;
            case 'filter':
                newPageData.filter = Object.keys(data.filters).map((k) => ({
                    name: k,
                    value: data.filters[k].filterVal
                }));

                break;
        }

        setPagingDetails(newPageData);
    };

    const columns = [
        {
            dataField: 'pb',
            headerStyle: {
                width: '13%'
            },
            text: 'Pb',
            sort: !standaloneDecks,
            filter: textFilter({
                getFilter: (filter) => {
                    pbFilter.current = filter;
                }
            }),
            // eslint-disable-next-line react/display-name
            formatter: (pb, row) => (
                <div className='deck-image'>
                    <ZoomableCard pbStub={row.phoenixborn[0]?.card.imageStub} />
                </div>
            )
        },
        {
            dataField: 'name',
            text: 'Name',
            sort: !standaloneDecks,
            filter: textFilter({
                getFilter: (filter) => {
                    nameFilter.current = filter;
                }
            }),
            formatter: (item, row) => {
                const hasChained = row.cards.some((c) => c.card.isChained);
                const icon = hasChained ? (
                    <FontAwesomeIcon icon={faLink} title='This deck contains chained cards' />
                ) : null;
                const dice = row.mode !== 'chimera' && <DiceRack dice={row.dicepool} />;
                const output = (
                    <>
                        <span>{item}</span>&nbsp;
                        {icon}
                        <br />
                        {dice}
                    </>
                );
                return output;
            }
        },
        {
            dataField: 'lastUpdated',
            headerStyle: {
                width: '20%'
            },
            style: {
                fontSize: '0.7rem'
            },
            align: 'center',
            text: 'Updated',
            sort: !standaloneDecks,
            hidden: standaloneDecks,

            /**
             * @param {Date} cell
             */
            formatter: (cell) => moment(cell).format('YYYY-MM-DD')
        },
        {
            dataField: 'winRate',
            align: 'center',
            text: 'Win Rate',
            headerStyle: {
                width: '18%'
            },
            style: {
                fontSize: '0.8rem'
            },
            sort: !standaloneDecks,
            hidden: standaloneDecks,
            /**
             * @param {number} cell
             */
            formatter: (item, row) => {
                const output = (
                    <span>
                        {item}%<br />({row.played} games)
                    </span>
                );
                return output;
            }
        }
    ];

    let onNameChange = debounce((event) => {
        nameFilter.current(event.target.value);
    }, 500);

    let onPbChange = debounce((event) => {
        pbFilter.current(event.target.value);
    }, 500);

    const handleFaveChange = () => {
        setShowFaves(!showFaves);
        const newPageData = Object.assign({}, pagingDetails);
        const i = newPageData.filter.findIndex((f) => f.name === 'favourite');
        if (i > -1) {
            newPageData.filter.splice(i, 1);
        }
        newPageData.filter.push({
            name: 'favourite',
            value: !showFaves
        });
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
                <Col md={12}>
                    <Form>
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
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    title='Remove from favourites'
                                />
                                <Form.Check // prettier-ignore
                                    type='switch'
                                    id='custom-switch'
                                    onChange={handleFaveChange}
                                />
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Col>
            )}
            <Col md={12}>
                <BootstrapTable
                    bootstrap4
                    remote
                    hover
                    keyField='_id'
                    data={decks}
                    escape='false'
                    columns={columns}
                    selectRow={selectRow}
                    rowEvents={rowEvents}
                    rowClasses={rowClasses}
                    pagination={
                        standaloneDecks
                            ? null
                            : paginationFactory({
                                page: pagingDetails.page,
                                sizePerPage: pagingDetails.pageSize,
                                totalSize: numDecks
                            })
                    }
                    filter={filterFactory()}
                    filterPosition='top'
                    onTableChange={onTableChange}
                    defaultSorted={[{ dataField: 'datePublished', order: 'desc' }]}
                />
            </Col>
        </div>
    );
};

DeckList.displayName = 'DeckList';
export default DeckList;
