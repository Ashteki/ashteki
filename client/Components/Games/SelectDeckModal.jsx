import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import igcircle from '../../assets/img/igcircle.png';
import DeckList from '../Decks/DeckList.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './SelectDeckModal.scss';

const SelectDeckModal = ({ gameFormat, onClose, onDeckSelected, onChooseForMe }) => {
    const { t } = useTranslation();

    let deckList = null;
    let setIndex = 0;
    if (gameFormat === 'constructed') {
        deckList = (
            <Tabs>
                <TabList>
                    <Tab>My Decks</Tab>
                    <Tab>Pre-cons</Tab>
                    <Tab>PvE</Tab>
                    <Tab>Building Basics</Tab>
                    <Tab style={{ backgroundColor: 'rgb(0, 153, 255)', color: '#FFF' }}>
                        <img src={igcircle} alt='Adventuring Party' height='22' width='22' />{' '}
                        Adventuring Party
                    </Tab>
                </TabList>

                <TabPanel>
                    <Button onClick={() => onChooseForMe(0)}>Choose for me</Button>
                    <DeckList onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(1)}>Choose for me</Button>
                    <DeckList standaloneDecks={1} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(6)}>Choose for me</Button>
                    <DeckList standaloneDecks={6} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(3)}>Choose for me</Button>
                    <DeckList standaloneDecks={3} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(2)}>Choose for me</Button>
                    <DeckList standaloneDecks={2} onDeckSelected={onDeckSelected} />
                </TabPanel>
            </Tabs>
        );
    } else if (gameFormat === 'precon') {
        deckList = (
            <Tabs>
                <TabList>
                    <Tab>Pre-cons</Tab>
                    <Tab>PvE</Tab>
                </TabList>

                <TabPanel>
                    <Button onClick={() => onChooseForMe(1)}>Choose for me</Button>
                    <DeckList standaloneDecks={1} onDeckSelected={onDeckSelected} />
                </TabPanel>
                <TabPanel>
                    <Button onClick={() => onChooseForMe(6)}>Choose for me</Button>
                    <DeckList standaloneDecks={6} onDeckSelected={onDeckSelected} />
                </TabPanel>
            </Tabs>
        );
    } else {
        switch (gameFormat) {
            case 'firstadventure':
                setIndex = 4;
                break;
            case 'aparty':
                setIndex = 2;
                break;
        }

        deckList = (
            <div>
                <Button onClick={() => onChooseForMe(setIndex)}>Choose for me</Button>
                <DeckList standaloneDecks={setIndex} onDeckSelected={onDeckSelected} />
            </div>
        );
    }

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('Select Deck')}</Modal.Title>
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
