import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';
// import Pagination from 'react-bootstrap-4-pagination';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import ApiStatus from '../Components/Site/ApiStatus';
import { Decks } from '../redux/types';
import { clearApiStatus, loadMyChimeraDecks, selectDeck } from '../redux/actions';
import DeckFilter from '../Components/Decks/DeckFilter';
import debounce from 'lodash.debounce';
import './Decks.scss';
import { PaginationControl } from 'react-bootstrap-pagination-control';

const ChimeraDecksComponent = ({ onDeckSelected }) => {
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

    const [pbFilter, setPbFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [showFaves, setShowFaves] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);

    const { numDecks, selectedDeck, deckReload } = useSelector((state) => ({
        numDecks: state.cards.numDecks,
        selectedDeck: myChimeraDecks ? null : state.cards.selectedDeck,
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

        dispatch(loadMyChimeraDecks(pagingDetails));
        dispatch(selectDeck(myChimeraDecks[0]));
    }, [nameFilter, pbFilter, showFaves, dispatch, deckReload, myChimeraDecks, pageNumber]);

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

    const { myChimeraDecks } = useSelector((state) => ({
        myChimeraDecks: state.cards.myChimeraDecks
    }));

    return (
        <div className='full-height'>
            <div className='lobby-card'>
                <Col sm={12}>
                    <ApiStatus
                        state={apiState}
                        onClose={() => dispatch(clearApiStatus(Decks.DeleteDeck))}
                    />
                </Col>

                <div className='lobby-header'>Chimera Decks</div>
                <div>
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
                            <DeckList decks={myChimeraDecks} showWinRate={true} />
                            {(myChimeraDecks?.length > 0) && (
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
                        <Col lg={6}>{selectedDeck && <ViewDeck deck={selectedDeck} allowEdit={true} />}</Col>
                    </Row></div>
            </div>
        </div>
    );
};

ChimeraDecksComponent.displayName = 'ChimeraDecks';

export default ChimeraDecksComponent;
