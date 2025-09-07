import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DeckList from '../Decks/DeckList.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './SelectDeckModal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { loadDecks } from '../../redux/actions/deck.js';
import DeckFilter from '../Decks/DeckFilter.jsx';
import Pagination from 'react-bootstrap-4-pagination';
import debounce from 'lodash.debounce';
import { PatreonStatus } from '../../types/patreon.js';

const SelectDeckModal = ({ gameFormat, onClose, onDeckSelected, onChooseForMe, playerIsMe }) => {
    const user = useSelector((state) => state.account.user);
    const showRestricted = user?.permissions.canVerifyDecks;
    const allowPremium = user?.patreon === PatreonStatus.Pledged || user?.permissions?.isSupporter;

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
        oneCollectionDecks
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
        oneCollectionDecks: state.cards.oneCollectionDecks
    }));
    const [pbFilter, setPbFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [showFaves, setShowFaves] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const dispatch = useDispatch();
    let showChooseForMe = true;

    useEffect(() => {
        const filter = [
            { name: 'pb', value: pbFilter },
            { name: 'name', value: nameFilter },
            { name: 'favourite', value: showFaves }
        ];
        const pagingDetails = {
            pageSize: 80,
            page: pageNumber,
            sort: 'lastUpdated',
            sortDir: 'desc',
            filter: filter
        };

        dispatch(loadDecks(pagingDetails));
    }, [nameFilter, pbFilter, showFaves, dispatch, pageNumber]);

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

    let deckList = null;
    let setIndex = 0;
    if (['constructed', 'hl2pvp'].includes(gameFormat) || (gameFormat === 'solo' && playerIsMe)) {
        deckList = (
            <Tabs>
                <TabList>
                    <Tab>My Decks</Tab>
                    <Tab>Precons</Tab>
                    <Tab>Red Rains Precons</Tab>
                    <Tab>Building Basics</Tab>
                    <Tab>Corpse Rebuild</Tab>
                    <Tab>Adventuring Party</Tab>
                    <Tab>Master Set Upgrade</Tab>
                    <Tab>Dual Duel</Tab>
                    {gameFormat === 'solo' && playerIsMe && <Tab>One Collection Battlebox</Tab>}
                </TabList>

                <TabPanel>
                    <Button onClick={() => onChooseForMe(0)}>Choose for me</Button>
                    <DeckFilter
                        onNameChange={onNameChange}
                        onPbChange={onPbChange}
                        handleFaveChange={handleFaveChange}
                        showButtons={false}
                    />

                    <DeckList onDeckSelected={onDeckSelected} decks={myDecks} showWinRate={true} />
                    <div className='pagination-wrapper'>
                        <Pagination
                            className='pager'
                            totalPages={myDecks.length / 8}
                            currentPage={pageNumber}
                            showMax={7}
                            onClick={onPageClick}
                            prevNext={false}
                        />
                    </div>

                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(1)}>Choose for me</Button>
                    <DeckList decks={standaloneDecks} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(6)}>Choose for me</Button>
                    <DeckList decks={pveDecks} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(3)}>Choose for me</Button>
                    <DeckList decks={buildingBasicsDecks} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(9)}>Choose for me</Button>
                    <DeckList decks={corpseRebuildDecks} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(2)}>Choose for me</Button>
                    <DeckList decks={adventuringPartyDecks} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(7)}>Choose for me</Button>
                    <DeckList decks={msuDecks} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(8)}>Choose for me</Button>
                    <DeckList decks={dualDuelDecks} onDeckSelected={onDeckSelected} />
                </TabPanel>

                {gameFormat === 'solo' && playerIsMe && (
                    <TabPanel>
                        <Button onClick={() => onChooseForMe(10)}>Choose for me</Button>
                        <DeckList decks={oneCollectionDecks} onDeckSelected={onDeckSelected} />
                    </TabPanel>
                )}
            </Tabs>
        );
    } else if (gameFormat === 'precon') {
        deckList = (
            <Tabs>
                <TabList>
                    <Tab>Precons</Tab>
                    <Tab>Red Rains Precons</Tab>
                </TabList>

                <TabPanel>
                    <Button onClick={() => onChooseForMe(1)}>Choose for me</Button>
                    <DeckList decks={standaloneDecks} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(6)}>Choose for me</Button>
                    <DeckList decks={pveDecks} onDeckSelected={onDeckSelected} />
                </TabPanel>
            </Tabs>
        );
    } else {
        let decks = null;
        switch (gameFormat) {
            case 'solo':
                setIndex = 5;
                decks = chimeraDecks;
                showChooseForMe = allowPremium;
                break;
            case 'firstadventure':
                setIndex = 4;
                decks = firstAdventureDecks;
                break;
            case 'aparty':
                setIndex = 2;
                decks = adventuringPartyDecks;
                break;
            case 'onecollection':
                setIndex = 10;
                decks = oneCollectionDecks;
                break;
        }

        deckList = (
            <div>
                {showChooseForMe && (
                    <Button onClick={() => onChooseForMe(setIndex)}>Choose for me</Button>
                )}
                <DeckList decks={decks} onDeckSelected={onDeckSelected} />
            </div>
        );
    }

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Deck</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>{deckList}</div>
                </Modal.Body>
            </Modal>
        </>
    );
};

SelectDeckModal.displayName = 'SelectDeckModal';

export default SelectDeckModal;
