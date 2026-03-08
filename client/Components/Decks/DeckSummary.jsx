import React, { useState } from 'react';
import { Col, Dropdown, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import './DeckSummary.scss';
import CardListText from './CardListText';
import CardListImg from './CardListImg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faList } from '@fortawesome/free-solid-svg-icons';
import { faCopy, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

// import DeckDice from './DeckDice';

import DeckStatus from './DeckStatus';
import { ashesDbShareUrl, ashesLiveShareUrl } from '../../util';
import { useDispatch } from 'react-redux';
import { resyncDeck } from '../../redux/actions';
import { toastr } from 'react-redux-toastr';

const DeckSummary = ({ deck, editMode, allowEdit, onEdit, onCopy, onDelete, magicHover }) => {
    const dispatch = useDispatch();

    const [radioValue, setRadioValue] = useState(false);

    if (!deck) return null;

    const handleEditClick = () => {
        if (onEdit) {
            onEdit();
        }
    };
    const handleCopyClick = () => {
        if (onCopy) {
            onCopy();
        }
    };
    const handleDeleteClick = () => {
        if (onDelete) {
            onDelete();
        }
    };
    const handleUpdateClick = () => {
        dispatch(resyncDeck(deck));
    };

    const ashesLiveLink =
        (deck?.ashesDb ? ashesDbShareUrl : ashesLiveShareUrl) + deck?.ashesLiveUuid;
    const siteName = deck?.ashesDb ? 'ashesdb' : 'ashes.live';

    const writeLinkToClipboard = (event) => {
        event.preventDefault();
        navigator.clipboard
            .writeText(ashesLiveLink)
            .then(() => toastr.success('Copied url to clipboard'))
            .catch((err) => toastr.error(`Could not copy deck url: ${err}`));
    };

    const onFFClick = (cardId) => {
        if (editMode) {
            const card = deck.cards.find((c) => c.id === cardId);
            if (card) {
                card.ff = !card.ff;
                // udpate state & save etc
            }
        }
    };

    const combinedCards = deck.cards.concat(deck.conjurations);
    const cardCount = deck.cards.reduce((agg, val) => agg += val.count, 0);
    return (
        <Col className='deck-summary'>
            <div className='deck-cards-header'>
                <ToggleButtonGroup name="radio" value={radioValue}>
                    <ToggleButton
                        key={'rad-0'}
                        id={`radio-0`}
                        type="radio"
                        value={false}
                        onChange={(e) => setRadioValue(false)}
                        className='mini'
                    >
                        <FontAwesomeIcon icon={faList} title='Show menu' />
                    </ToggleButton>
                    <ToggleButton
                        key={'rad-1'}
                        id={`radio-1`}
                        type="radio"
                        value={true}
                        onChange={(e) => setRadioValue(true)}
                        className='mini'
                    >
                        <FontAwesomeIcon icon={faImage} title='Show menu' />
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className='deck-header-buttons'>
                    <div className='total-box'>{cardCount}</div>
                    {deck && <DeckStatus status={deck.status} />}
                    {deck && (
                        <Dropdown title='edit' className='deck-edit-dd'>
                            <Dropdown.Toggle
                                variant='primary'
                                className='def deck-edit-btn'
                                id='dropdown-basic'
                            >
                                <FontAwesomeIcon icon={faPen} />&nbsp;
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href='#' onClick={handleEditClick}>
                                    <FontAwesomeIcon icon={faPen} /> Edit
                                </Dropdown.Item>
                                <Dropdown.Item href='#' onClick={handleCopyClick}>
                                    <FontAwesomeIcon icon={faCopy} /> Copy
                                </Dropdown.Item>
                                <Dropdown.Item href='#' onClick={handleDeleteClick}>
                                    <FontAwesomeIcon icon={faTrashCan} /> Delete
                                </Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                    {!editMode && allowEdit && (
                        <div className='deck-buttons text-center'>
                            {deck.ashesLiveUuid && (
                                <Dropdown
                                    variant='warning'
                                    className='ashes-live def'
                                    title={siteName}
                                >
                                    <Dropdown.Toggle
                                        split
                                        variant='warning'
                                        className='def'
                                        id='dropdown-basic'
                                    >
                                        <span className='phg-basic-magic'></span>&nbsp;
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href='#' onClick={handleUpdateClick}>
                                            Update
                                        </Dropdown.Item>
                                        <Dropdown.Item href={ashesLiveLink}>Go to {siteName}</Dropdown.Item>
                                        <Dropdown.Item href='#' onClick={writeLinkToClipboard}>
                                            Copy {siteName} url
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </div>
                    )}
                </div>

            </div>
            <div className='deck-cards'>
                {radioValue ? (
                    <>
                        <div className='basic-title'>First Five</div>
                        <CardListImg deckCards={deck.cards.filter((c) => c.ff)} noIndex={true} />
                        <div className='basic-title'>All Cards</div>

                        <CardListImg deckCards={deck.cards} />
                        <div className='basic-title'>Conjurations</div>
                        <CardListImg deckCards={deck.conjurations} />
                    </>
                ) : (
                    <CardListText
                        deckCards={combinedCards}
                        highlight={magicHover}
                        onFFClick={onFFClick}
                    />
                )}
            </div>
            <div className='deck-card-group deck-notes'>{deck.notes}</div>
            {deck.played > 0 && (
                <Row>
                    <Col sm='9'>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <th>Win</th>
                                    <th>Loss</th>
                                    <th>Total</th>
                                    <th>Win Rate</th>
                                </tr>
                                <tr>
                                    <td>{deck.wins}</td>
                                    <td>{deck.played - deck.wins}</td>
                                    <td>{parseInt(deck.played)}</td>
                                    <td>{deck.winRate?.toFixed(0)}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            )}
        </Col>
    );
};

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
