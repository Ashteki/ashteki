import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';

import Link from '../Components/Navigation/Link';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import ApiStatus from '../Components/Site/ApiStatus';
import { Decks } from '../redux/types';
import { clearApiStatus } from '../redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
                    <div className='lobby-card'>
                        <div className='lobby-header'>My Decks</div>
                        <Col className='text-center'>
                            <Link className='btn btn-secondary def' href='/decks/add'>
                                <FontAwesomeIcon icon={faPlus} /> New Deck
                            </Link>
                            <Link className='btn btn-primary def' href='/decks/import'>
                                <span className='phg-basic-magic'></span> Import a Deck
                            </Link>
                        </Col>
                        <Col>
                            Precon and Adventuring Party decks are built-in. You don&apos;t need to
                            create them here.
                        </Col>
                        <DeckList />
                    </div>
                </Col>
                <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} />}</Col>
            </Row>
        </div>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
