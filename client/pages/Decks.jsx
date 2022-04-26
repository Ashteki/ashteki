import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Navigation/Link';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import ApiStatus from '../Components/Site/ApiStatus';
import { Decks } from '../redux/types';
import { clearApiStatus } from '../redux/actions';

const DecksComponent = () => {
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
    const { selectedDeck } = useSelector((state) => ({
        selectedDeck: state.cards.selectedDeck
    }));

    return (
        <div className='full-height'>
            <Col sm={12}>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Decks.DeleteDeck))}
                />
            </Col>
            <Row>
                <Col lg={6} className='full-height'>
                    <Panel title={t('Your decks')}>
                        <Col className='text-center'>
                            <Link className='btn btn-primary' href='/decks/add'>
                                New Deck
                            </Link>
                            <Link className='btn btn-secondary' href='/decks/import'>
                                Import Deck
                            </Link>
                        </Col>
                        <Col>
                            Precon decks are built into the site. You don&apos;t need to create a
                            copy here. For a better pre-constructed experience why not try one of
                            the{' '}
                            <a href='https://jaysonsethlindley.medium.com/adventuring-party-six-constructed-ashes-decks-from-one-collection-1a2e6a2d3260'>
                                Adventuring Party
                            </a>{' '}
                            decks? When you join a game and select your deck you can click the
                            Adventuring Party tab for the full list.
                        </Col>
                        <DeckList />
                    </Panel>
                </Col>
                <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} />}</Col>
            </Row>
        </div>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
