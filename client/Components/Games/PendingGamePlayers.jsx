import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendSocketMessage } from '../../redux/actions';
import { Button, Col, Form, Row } from 'react-bootstrap';
import classNames from 'classnames';

import './PendingGamePlayer.scss';
import DeckStatus from '../Decks/DeckStatus';
import PlayerName from '../Site/PlayerName';
import SelectDeckModal from './SelectDeckModal';
import { PatreonStatus } from '../../types';
import { patreonUrl } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

/**
 * @typedef PendingGamePlayersProps
 * @property {PendingGame} currentGame The current pending game
 * @property {User} user The logged in user
 * @property {function(): void} onSelectDeck The callback to be invoked when a deck selection is requested
 */

/**
 * @param {PendingGamePlayersProps} props
 */
const PendingGamePlayers = ({ currentGame, user }) => {
    const [showModal, setShowModal] = useState(false);
    const [playerIsMe, setPlayerIsMe] = useState(true);
    const dispatch = useDispatch();
    const allowPremium = user?.patreon === PatreonStatus.Pledged || user?.permissions?.isSupporter;
    const unlinked = !user?.patreon || user?.patreon === PatreonStatus.Unlinked;
    const showPatreonAdvice = !allowPremium;
    const isSolo = currentGame.solo;
    const userIsSpectator = !!currentGame.spectators.find((s) => s.name === user?.username);

    let firstPlayer = true;
    // need to account for coaloff, and player index
    let clickHandler = (playerIsMe) => {
        if (userIsSpectator) {
            return;
        }
        if (currentGame.gameFormat === 'coaloff') {
            return true;
        }

        setPlayerIsMe(playerIsMe);
        setShowModal(true);
    };

    const deckSelectedHandler = (deck) => {
        setShowModal(false);
        dispatch(
            sendSocketMessage('selectdeck', currentGame.id, playerIsMe, deck._id, !!deck.precon_id)
        );
    };

    const chooseForMeHandler = (deckType) => {
        // guard for unsubscribed user getting access to a random premium deck
        if (!playerIsMe && isSolo && !allowPremium) {
            return;
        }
        setShowModal(false);
        dispatch(sendSocketMessage('selectdeck', currentGame.id, playerIsMe, -1, 0, deckType));
    };

    const onSoloLevelChange = (newLevel) => {
        dispatch(sendSocketMessage('setsololevel', currentGame.id, newLevel));
    };

    const onSoloStageChange = (newStage) => {
        dispatch(sendSocketMessage('setsolostage', currentGame.id, newStage));
    };

    const patreonLoginClick = (event) => {
        if (user?.patreon === 'linked') {
            window.location = 'https://www.patreon.com/ashteki';
        } else {
            window.location = patreonUrl;
        }

        event.preventDefault();
    };

    return (
        <div>
            <h3>Players:</h3>
            {Object.values(currentGame.players).map((player) => {
                const isMe = player && player.name === user?.username;

                let deck = null;
                let selectLink = null;
                let status = null;
                let soloControls = null;

                let clickClasses = classNames('deck-selection', {
                    clickable: currentGame.gameFormat !== 'coaloff'
                });

                if (player && player.deck && player.deck.selected) {
                    if (!userIsSpectator && (isMe || currentGame.solo)) {
                        const deckName = player.deck.name;
                        deck = (
                            <button className={clickClasses} title='Select Deck' onClick={() => clickHandler(isMe)}>
                                {deckName}
                            </button>
                        );
                    } else {
                        const deckName =
                            player.name === 'Chimera'
                                ? player.deck.name
                                : 'Deck Selected';
                        deck = <span className='deck-selection'>{deckName}</span>;
                    }

                    status = !(currentGame.solo && !isMe) && (
                        <DeckStatus
                            status={player.deck.status}
                            gameFormat={currentGame.gameFormat}
                        />
                    );

                    if (player.deck.isChimera) {
                        if (userIsSpectator) {
                            soloControls = <span></span>;
                        } else if (allowPremium) {
                            soloControls = (
                                <>
                                    <Col xs='auto'>
                                        <Form.Control
                                            as='select'
                                            sm='3'
                                            size='sm'
                                            onChange={(e) => onSoloLevelChange(e.target.value)}
                                        >
                                            <option value='S'>Standard</option>
                                            <option value='H'>Heroic</option>
                                        </Form.Control>
                                    </Col>
                                    <Col xs='auto'>
                                        <Form.Control
                                            as='select'
                                            size='sm'
                                            onChange={(e) => onSoloStageChange(e.target.value)}
                                        >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                        </Form.Control>
                                    </Col>
                                </>
                            );
                        } else {
                            soloControls = (<>
                                <span
                                    className='premium btn btn-primary def disabled'
                                    title='Patreon only'
                                >
                                    Standard L1
                                </span>
                            </>
                            );
                        }
                    }
                } else if (player && isMe) {
                    selectLink = (
                        <>
                            <Button onClick={() => clickHandler(isMe)} className='btn-focus def'>
                                Select Deck
                            </Button>
                        </>
                    );
                }

                let rowClass = 'player-row';
                if (firstPlayer) {
                    rowClass += ' mb-2';

                    firstPlayer = false;
                }
                return (
                    <div className={rowClass} key={player.name}>
                        <Row className='form-row'>
                            <PlayerName player={player} />
                            {deck}
                            {status}
                            {selectLink}
                            {soloControls}
                        </Row>
                        {player.deck.isChimera && showPatreonAdvice && (
                            <Row className='form-row patreon-row'>
                                <div className='pending-player-name'></div>
                                <div>
                                    <span className='unlock-advice'>
                                        <a href='#' onClick={patreonLoginClick}>
                                            {unlinked ? 'Login to' : 'Support on'} Patreon
                                        </a>{' '}
                                        to unlock all content <FontAwesomeIcon icon={faCircleInfo} title='You may need to reload this page after' />
                                    </span>
                                </div>
                            </Row>
                        )}
                    </div>
                );
            })}
            {showModal && (
                <SelectDeckModal
                    gameFormat={currentGame.gameFormat}
                    onClose={() => setShowModal(false)}
                    onDeckSelected={deckSelectedHandler}
                    onChooseForMe={chooseForMeHandler}
                    playerIsMe={playerIsMe}
                />
            )}
        </div>
    );
};

export default PendingGamePlayers;
