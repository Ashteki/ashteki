import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';
// import Pagination from 'react-bootstrap-4-pagination';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import ApiStatus from '../Components/Site/ApiStatus';
import { Decks } from '../redux/types';
import { clearApiStatus, loadDecks, selectDeck } from '../redux/actions';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import DeckTypeInfo from '../Components/Decks/DeckTypeInfo';
import DeckFilter from '../Components/Decks/DeckFilter';
import debounce from 'lodash.debounce';
import './Decks.scss';
import { PaginationControl } from 'react-bootstrap-pagination-control';

const DecksComponent = ({ onDeckSelected }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiState = useSelector((state) => {
        const retState = state.api[Decks.DeleteDeck];

        if (retState && retState.success) {
            retState.message = t('Deck deleted successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.DeleteDeck));
            }, 1000);
        }

        return retState;
    });
    const [tabIndex, setTabIndex] = useState(0);
    const onDuplicate = () => {
        setTabIndex(0);
    };

    const [pbFilter, setPbFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [showFaves, setShowFaves] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);

    const user = useSelector((state) => state.account.user);
    const showRestricted = user?.permissions.canVerifyDecks;
    const { numDecks, selectedDeck, deckReload } = useSelector((state) => ({
        numDecks: state.cards.numDecks,
        selectedDeck: standaloneDecks ? null : state.cards.selectedDeck,
        deckReload: state.cards.deckReload
    }));

    useEffect(() => {
        const filter = [
            { name: 'pb', value: pbFilter },
            { name: 'name', value: nameFilter },
            { name: 'favourite', value: showFaves }
        ];
        const pagingDetails = {
            pageSize: 8,
            page: pageNumber,
            sort: 'lastUpdated',
            sortDir: 'desc',
            filter: filter
        };

        dispatch(loadDecks(pagingDetails));
    }, [nameFilter, pbFilter, showFaves, dispatch, deckReload, standaloneDecks, pageNumber]);

    let onNameChange = debounce((event) => {
        event.preventDefault();
        event.stopPropagation();
        setNameFilter(event.target.value);
    }, 500);

    let onPbChange = (event) => {
        setPbFilter(event.target.value);
    };

    const handleFaveChange = () => {
        setShowFaves(!showFaves);
    };
    const onPageClick = (page) => {
        setPageNumber(page);
    };

    const {
        myDecks,
        standaloneDecks,
        adventuringPartyDecks,
        buildingBasicsDecks,
        corpseRebuildDecks,
        firstAdventureDecks,
        chimeraDecks,
        pveDecks,
        msuDecks,
        dualDuelDecks,
        oneCollectionDecks,
        ascendancyDecks
    } = useSelector((state) => ({
        myDecks: state.cards.decks,
        standaloneDecks: state.cards.standaloneDecks,
        adventuringPartyDecks: state.cards.adventuringPartyDecks,
        buildingBasicsDecks: state.cards.buildingBasicsDecks,
        corpseRebuildDecks: state.cards.corpseRebuildDecks,
        firstAdventureDecks: state.cards.firstAdventureDecks,
        chimeraDecks: state.cards.chimeraDecks?.filter((d) => showRestricted || !d.restricted),
        pveDecks: state.cards.pveDecks,
        msuDecks: state.cards.msuDecks,
        dualDuelDecks: state.cards.dualDuelDecks,
        oneCollectionDecks: state.cards.oneCollectionDecks,
        ascendancyDecks: state.cards.ascendancyDecks
    }));

    const onTabChange = (index, lastIndex, event) => {
        setTabIndex(index);
        let deck = null;
        switch (index) {
            case 0:
                deck = myDecks[0];
                break;
            case 1: // ascendancy
                deck = ascendancyDecks[0];
                break;
            case 2:
                deck = standaloneDecks[0];
                break;
            case 3:
                deck = pveDecks[0];
                break;
            case 4:
                deck = buildingBasicsDecks[0];
                break;
            case 5:
                deck = corpseRebuildDecks[0];
                break;
            case 6:
                deck = firstAdventureDecks[0];
                break;
            case 7:
                deck = adventuringPartyDecks[0];
                break;
            case 8:
                deck = msuDecks[0];
                break;
            case 9:
                deck = dualDuelDecks[0];
                break;
            case 10: // oneCollection
                deck = oneCollectionDecks[0];
                break;
        }
        dispatch(selectDeck(deck));
    };

    return (
        <div className='full-height'>
            <div className='lobby-card'>
                <Col sm={12}>
                    <ApiStatus
                        state={apiState}
                        onClose={() => dispatch(clearApiStatus(Decks.DeleteDeck))}
                    />
                </Col>

                {/* <div className='lobby-header'> Decks</div> */}
                <Tabs onSelect={onTabChange} selectedIndex={tabIndex}>
                    <TabList>
                        <Tab>My Decks</Tab>
                        <Tab>Ascendancy</Tab>
                        <Tab>Precons</Tab>
                        <Tab>Red Rains Precons</Tab>
                        <Tab>Building Basics</Tab>
                        <Tab>Corpse Rebuild</Tab>
                        <Tab>First Adventure</Tab>
                        <Tab>Adventuring Party</Tab>
                        <Tab>Master Set Upgrade</Tab>
                        <Tab>Dual Duel</Tab>
                        <Tab>One Collection Battlebox</Tab>
                    </TabList>
                    <TabPanel>
                        <Row>
                            <Col>
                                <DeckFilter
                                    onNameChange={onNameChange}
                                    onPbChange={onPbChange}
                                    handleFaveChange={handleFaveChange}
                                    showButtons={true}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <DeckList decks={myDecks} showWinRate={true} />
                                {(myDecks?.length > 0) && (
                                    <div className='pagination-wrapper'>
                                        <PaginationControl
                                            page={pageNumber}
                                            between={4}
                                            total={numDecks}
                                            limit={10}
                                            changePage={(page) => {
                                                onPageClick(page);
                                            }}
                                            ellipsis={1}
                                        />
                                    </div>
                                )}
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} allowEdit={true} />}</Col>
                        </Row>
                    </TabPanel>
                    <TabPanel>
                        <Row>
                            <Col>
                            </Col>
                        </Row>
                        <Row>

                            <Col lg={6}>
                                <DeckTypeInfo deckType='ascendancy' />
                                <DeckList decks={ascendancyDecks} />
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} />}</Col>
                        </Row>
                    </TabPanel>
                    <TabPanel>
                        <Row>
                            <Col>
                            </Col>
                        </Row>
                        <Row>

                            <Col lg={6}>
                                <DeckTypeInfo deckType='precon' />
                                <DeckList decks={standaloneDecks} />
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} />}</Col>
                        </Row>
                    </TabPanel>
                    <TabPanel>
                        <Row>
                            <Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <DeckTypeInfo deckType='pveDecks' />
                                <DeckList decks={pveDecks} />
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} />}</Col>
                        </Row>
                    </TabPanel>
                    <TabPanel>
                        <Row>
                            <Col>
                            </Col>
                        </Row>
                        <Row>

                            <Col lg={6}>
                                <DeckTypeInfo deckType='buildingBasics' />
                                <DeckList decks={buildingBasicsDecks} />
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} />}</Col>
                        </Row>
                    </TabPanel>
                    <TabPanel>
                        <Row>
                            <Col>
                            </Col>
                        </Row>
                        <Row>

                            <Col lg={6}>
                                <DeckTypeInfo deckType='corpseRebuild' />
                                <DeckList decks={corpseRebuildDecks} />
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} />}</Col>
                        </Row>
                    </TabPanel>

                    <TabPanel>
                        <Row>
                            <Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <DeckTypeInfo deckType='firstadventure' />
                                <DeckList decks={firstAdventureDecks} />
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} />}</Col>
                        </Row>
                    </TabPanel>
                    <TabPanel>
                        <Row>
                            <Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <DeckTypeInfo deckType='aparty' />
                                <DeckList decks={adventuringPartyDecks} />
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} />}</Col>
                        </Row>
                    </TabPanel>
                    <TabPanel>
                        <Row>
                            <Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <DeckTypeInfo deckType='msu' />
                                <DeckList decks={msuDecks} />
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} />}</Col>
                        </Row>
                    </TabPanel>
                    <TabPanel>
                        <Row>
                            <Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <DeckTypeInfo deckType='dualduel' />
                                <DeckList decks={dualDuelDecks} />
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} />}</Col>
                        </Row>
                    </TabPanel>
                    <TabPanel>
                        <Row>
                            <Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <DeckTypeInfo deckType='onecollection' />
                                <DeckList decks={oneCollectionDecks} />
                            </Col>
                            <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} onDuplicate={onDuplicate} />}</Col>
                        </Row>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
