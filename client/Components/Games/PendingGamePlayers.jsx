import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { sendSocketMessage } from '../../redux/actions';
import { Button, Col, Form } from 'react-bootstrap';
import classNames from 'classnames';

import './PendingGamePlayer.scss';
import DeckStatus from '../Decks/DeckStatus';
import PlayerName from '../Site/PlayerName';
import SelectDeckModal from './SelectDeckModal';

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
    const { t } = useTranslation();
    const dispatch = useDispatch();

    let firstPlayer = true;
    // need to account for coaloff, and player index
    let clickHandler = (playerIsMe) => {
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
        setShowModal(false);
        dispatch(sendSocketMessage('selectdeck', currentGame.id, playerIsMe, -1, 0, deckType));
    };

    const onSoloLevelChange = (newLevel) => {
        dispatch(sendSocketMessage('setsololevel', currentGame.id, newLevel));
    };

    const onSoloStageChange = (newStage) => {
        dispatch(sendSocketMessage('setsolostage', currentGame.id, newStage));
    };

    return (
        <div title={t('Players')}>
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
                    if (isMe || currentGame.solo) {
                        const deckName = player.deck.name;
                        deck = (
                            <span className={clickClasses} onClick={() => clickHandler(isMe)}>
                                {deckName}
                            </span>
                        );
                    } else {
                        const deckName =
                            currentGame.gameFormat === 'firstadventure'
                                ? player.deck.name
                                : 'Deck Selected';
                        deck = <span className='deck-selection'>{deckName}</span>;
                    }

                    status = !(currentGame.solo && !isMe) && (
                        <DeckStatus status={player.deck.status} />
                    );

                    if (player.deck.isChimera) {
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
                        <Form.Row>
                            <PlayerName player={player} />
                            {deck}
                            {status}
                            {selectLink}
                            {soloControls}
                        </Form.Row>
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
