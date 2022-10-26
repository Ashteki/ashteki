import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from 'react-bootstrap';

import DeckStatus from '../Decks/DeckStatus';

import './PendingGamePlayer.scss';
import PlayerName from '../Site/PlayerName';
import classNames from 'classnames';

/**
 * @typedef PendingGamePlayersProps
 * @property {PendingGame} currentGame The current pending game
 * @property {User} user The logged in user
 * @property {function(): void} onSelectDeck The callback to be invoked when a deck selection is requested
 */

/**
 * @param {PendingGamePlayersProps} props
 */
const PendingGamePlayers = ({ currentGame, user, onSelectDeck }) => {
    const { t } = useTranslation();

    let firstPlayer = true;
    return (
        <div title={t('Players')}>
            <h3>Players</h3>
            {Object.values(currentGame.players).map((player) => {
                const playerIsMe = player && player.name === user?.username;

                let deck = null;
                let selectLink = null;
                let status = null;
                let clickClasses = classNames('deck-selection', {
                    clickable: currentGame.gameFormat !== 'coaloff'
                });
                let clickHandler = onSelectDeck;
                if (currentGame.gameFormat === 'coaloff') {
                    clickHandler = () => true;
                }
                if (player && player.deck && player.deck.selected) {
                    if (playerIsMe) {
                        deck = (
                            <span className={clickClasses} onClick={clickHandler}>
                                {player.deck.name}
                            </span>
                        );
                    } else {
                        const deckName =
                            currentGame.gameFormat === 'firstadventure'
                                ? player.deck.name
                                : 'Deck Selected';
                        deck = <span className='deck-selection'>{deckName}</span>;
                    }

                    status = <DeckStatus status={player.deck.status} />;
                } else if (player && playerIsMe) {
                    selectLink = (
                        <>
                            <Button onClick={onSelectDeck}>
                                <Trans>Select Deck</Trans>
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
                        <PlayerName player={player} />
                        {deck} {status} {selectLink}
                    </div>
                );
            })}
        </div>
    );
};

export default PendingGamePlayers;
