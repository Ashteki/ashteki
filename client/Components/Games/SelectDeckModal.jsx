import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';

import DeckList from '../Decks/DeckList.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './SelectDeckModal.scss';

const SelectDeckModal = ({ onClose, onDeckSelected }) => {
    const { t } = useTranslation();

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('Select Deck')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Tabs>
                            <TabList>
                                <Tab>My Decks</Tab>
                                <Tab>Pre-con Decks</Tab>
                                <Tab>Adventuring Party</Tab>
                            </TabList>

                            <TabPanel>
                                <DeckList onDeckSelected={onDeckSelected} />
                            </TabPanel>
                            <TabPanel>
                                <DeckList standaloneDecks={1} onDeckSelected={onDeckSelected} />
                            </TabPanel>
                            <TabPanel>
                                <DeckList standaloneDecks={2} onDeckSelected={onDeckSelected} />
                            </TabPanel>
                        </Tabs>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

SelectDeckModal.displayName = 'SelectDeckModal';

export default SelectDeckModal;
