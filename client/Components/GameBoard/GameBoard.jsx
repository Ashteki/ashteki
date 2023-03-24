import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { withTranslation, Trans } from 'react-i18next';

import PlayerStats from './PlayerStats';
import PlayerRow from './PlayerRow';
import DiceHistory from './DiceHistory';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import CardZoom from './CardZoom';
import CardLog from './CardLog';
import PlayerBoard from './PlayerBoard';
import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import Droppable from './Droppable';
import TimeLimitClock from './TimeLimitClock';
import * as actions from '../../redux/actions';

import './GameBoard.scss';
import PlayerPBRow from './PlayerPBRow';
import ManualCommands from '../../pages/ManualCommands';
import MovablePanel from './MovablePanel';
import CardInspector from './CardInspector';
import Clock from './Clock';
import WinLoseSplash from './WinLoseSplash';
import ChimeraRow from './ChimeraRow';

const placeholderPlayer = {
    cardPiles: {
        cardsInPlay: [],
        discard: [],
        hand: [],
        purged: [],
        spells: [],
        deck: []
    },
    activePlayer: false,
    firstPlayer: false,
    numDeckCards: 0,
    actions: {
        main: false,
        side: false
    },
    title: null,
    user: null,
    dice: []
};

export class GameBoard extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.onCardAltClick = this.onCardAltClick.bind(this);
        this.onDieClick = this.onDieClick.bind(this);
        this.handleDrawPopupChange = this.handleDrawPopupChange.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onCommand = this.onCommand.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onPileClick = this.onPileClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.onSettingsClick = this.onSettingsClick.bind(this);
        this.onMessagesClick = this.onMessagesClick.bind(this);
        this.onDiceHistoryClick = this.onDiceHistoryClick.bind(this);
        this.onManualCommandsClick = this.onManualCommandsClick.bind(this);
        this.onManualModeClick = this.onManualModeClick.bind(this);
        this.onMuteClick = this.onMuteClick.bind(this);
        this.onWinSplashCloseClick = this.onWinSplashCloseClick.bind(this);

        this.state = {
            cardToZoom: undefined,
            showActionWindowsMenu: false,
            showCardMenu: {},
            showMessages: true,
            showDiceHistory: false,
            showManualCommands: false,
            showWinSplash: true,
            lastMessageCount: 0,
            newMessages: 0,
            showModal: false
        };
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        let lastMessageCount = this.state.lastMessageCount;
        let currentMessageCount = props.currentGame ? props.currentGame.messages.length : 0;

        if (this.state.showMessages) {
            this.setState({ lastMessageCount: currentMessageCount, newMessages: 0 });
        } else {
            this.setState({ newMessages: currentMessageCount - lastMessageCount });
        }
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    onCardClick(card) {
        this.props.sendGameMessage('cardClicked', card.uuid);
    }

    onCardAltClick(card) {
        this.props.sendGameMessage('cardAltClicked', card.uuid);
    }

    onDieClick(die) {
        this.props.sendGameMessage('dieClicked', die.uuid);
    }

    handleDrawPopupChange(event) {
        this.props.sendGameMessage('showDrawDeck', event.visible);
    }

    sendChatMessage(message) {
        this.props.sendGameMessage('chat', message);
    }

    onShuffleClick() {
        this.props.sendGameMessage('shuffleDeck');
    }

    onPileClick(source) {
        this.props.sendGameMessage('pileClicked', source);
    }

    onDragDrop(card, source, target) {
        this.props.sendGameMessage('drop', card.uuid, source, target);
    }

    getTimer(player) {
        let clocks = [];
        if (
            this.props.currentGame.useGameTimeLimit
        ) {
            if (
                this.props.currentGame.gameTimeLimit &&
                this.props.currentGame.gameTimeLimitStarted
            ) {
                clocks.push(
                    <TimeLimitClock
                        timeLimitStarted={this.props.currentGame.gameTimeLimitStarted}
                        timeLimitStartedAt={this.props.currentGame.gameTimeLimitStartedAt}
                        timeLimit={this.props.currentGame.gameTimeLimit}
                    />
                );
            }
            if (player.clock) {
                clocks.push(
                    <Clock
                        secondsLeft={player.clock.timeLeft}
                        mode={player.clock.mode}
                        stateId={player.clock.stateId}
                        periods={player.clock.periods}
                        mainTime={player.clock.mainTime}
                        timePeriod={player.clock.timePeriod}
                        winner={this.props.currentGame.winner}
                    />
                );
            }
        }
        return <div className='time-limit-clock card bg-dark border-primary'>{clocks}</div>;
    }

    onCommand(command, arg, uuid, method) {
        let commandArg = arg;

        this.props.sendGameMessage(command, commandArg, uuid, method);
    }

    onMenuItemClick(card, menuItem) {
        this.props.sendGameMessage('menuItemClick', card.uuid, menuItem);
    }

    onOptionSettingToggle(option, value) {
        this.props.sendGameMessage('toggleOptionSetting', option, value);
    }

    onTimerExpired(uuid) {
        this.props.sendGameMessage('menuButton', null, uuid, 'pass');
    }

    onMuteClick() {
        this.props.sendGameMessage('toggleMuteSpectators');
    }

    onSettingsClick() {
        this.setState({ showModal: true });
    }

    onMessagesClick() {
        const showState = !this.state.showMessages;

        let newState = {
            showMessages: showState
        };

        if (showState) {
            newState.newMessages = 0;
            newState.lastMessageCount = this.props.currentGame.messages.length;
        }

        this.setState(newState);
    }

    onDiceHistoryClick() {
        this.setState({ showDiceHistory: !this.state.showDiceHistory });
    }

    onManualModeClick(event) {
        event.preventDefault();
        this.props.sendGameMessage('toggleManualMode');
    }

    onManualCommandsClick() {
        this.setState({ showManualCommands: !this.state.showManualCommands });
    }

    onWinSplashCloseClick() {
        this.setState({ showWinSplash: !this.state.showWinSplash });
    }

    defaultPlayerInfo(source) {
        let player = Object.assign({}, placeholderPlayer, source);
        player.cardPiles = Object.assign({}, placeholderPlayer.cardPiles, player.cardPiles);
        player.dice = Object.assign([], placeholderPlayer.dice, player.dice);
        return player;
    }

    getMatchRecord(thisPlayer, otherPlayer) {
        return {
            thisPlayer: {
                name: thisPlayer.name,
                wins: thisPlayer.wins
            },
            otherPlayer: {
                name: otherPlayer.name ? otherPlayer.name : 'Noone',
                wins: otherPlayer.wins ? otherPlayer.wins : 0
            }
        };
    }

    getPlayerRows(otherPlayer, compactLayout, leftMode, cardSize, spectating) {
        return (
            <>
                {!compactLayout && (
                    <div className='player-home-row'>
                        <PlayerRow
                            archives={otherPlayer.cardPiles.archives}
                            cardSize={cardSize}
                            isMe={false}
                            hand={otherPlayer.cardPiles.hand}
                            language={this.props.i18n.language}
                            leftMode={leftMode}
                            manualMode={this.props.currentGame.manualMode}
                            onCardClick={this.onCardClick}
                            onDieClick={this.onDieClick}
                            onMouseOut={this.onMouseOut}
                            onMouseOver={this.onMouseOver}
                            side='top'
                            dice={otherPlayer.dice}
                            purgedPile={otherPlayer.cardPiles.purged}
                            behaviour={otherPlayer.behaviour}
                        />
                    </div>
                )}
                <div className='player-home-row'>
                    <PlayerPBRow
                        cardSize={cardSize}
                        discard={otherPlayer.cardPiles.discard}
                        drawDeck={otherPlayer.cardPiles.deck}
                        isMe={false}
                        language={this.props.i18n.language}
                        manualMode={this.props.currentGame.manualMode}
                        numDeckCards={otherPlayer.numDeckCards}
                        onCardClick={this.onCardClick}
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                        player={otherPlayer}
                        showDice={compactLayout}
                        showDeckPile={!compactLayout}
                        side='top'
                        spells={otherPlayer.cardPiles.spells}
                        spectating={spectating}
                        phoenixborn={otherPlayer.phoenixborn}
                    />
                </div>
            </>
        );
    }

    getChimeraRow(otherPlayer, spectating) {
        return (
            <div className='player-home-row'>
                <ChimeraRow
                    cardSize={this.props.user.settings.cardSize}
                    dice={otherPlayer.dice}
                    discard={otherPlayer.cardPiles.discard}
                    drawDeck={otherPlayer.cardPiles.deck}
                    isMe={false}
                    language={this.props.i18n.language}
                    manualMode={this.props.currentGame.manualMode}
                    numDeckCards={otherPlayer.numDeckCards}
                    onCardClick={this.onCardClick}
                    onMouseOver={this.onMouseOver}
                    onMouseOut={this.onMouseOut}
                    player={otherPlayer}
                    side='top'
                    spells={otherPlayer.cardPiles.spells}
                    spectating={spectating}
                    phoenixborn={otherPlayer.phoenixborn}
                />
            </div>
        );
    }

    renderBoard(thisPlayer, otherPlayer, compactLayout, leftMode, cardSize, spectating) {
        return [
            <div key='board-middle' className='board-middle'>
                {this.props.currentGame.solo
                    ? this.getChimeraRow(otherPlayer, compactLayout, leftMode, cardSize, spectating)
                    : this.getPlayerRows(otherPlayer, compactLayout, leftMode, cardSize, spectating)}

                <div className='board-inner'>
                    <div className='play-area'>
                        {/* opponent board */}
                        <PlayerBoard
                            attack={this.props.currentGame.attack}
                            cardsInPlay={otherPlayer.cardPiles.cardsInPlay}
                            phoenixborn={otherPlayer.phoenixborn}
                            onCardClick={this.onCardClick}
                            onMenuItemClick={this.onMenuItemClick}
                            onMouseOut={this.onMouseOut}
                            onMouseOver={this.onMouseOver}
                            rowDirection='reverse'
                            side='top'
                            cardSize={cardSize}
                            playerId={otherPlayer.id}
                            active={otherPlayer.activePlayer}
                        />
                        {/* myboard */}
                        <Droppable
                            onDragDrop={this.onDragDrop}
                            source='play area'
                            manualMode={this.props.currentGame.manualMode}
                        >
                            <PlayerBoard
                                attack={this.props.currentGame.attack}
                                cardsInPlay={thisPlayer.cardPiles.cardsInPlay}
                                phoenixborn={thisPlayer.phoenixborn}
                                manualMode={this.props.currentGame.manualMode}
                                onCardClick={this.onCardClick}
                                onMenuItemClick={this.onMenuItemClick}
                                onMouseOut={this.onMouseOut}
                                onMouseOver={this.onMouseOver}
                                rowDirection='default'
                                side='bottom'
                                cardSize={cardSize}
                                playerId={thisPlayer.id}
                                active={thisPlayer.activePlayer}
                            />
                        </Droppable>
                    </div>
                </div>
                <div className='player-home-row our-side'>
                    <PlayerPBRow
                        cardSize={cardSize}
                        discard={thisPlayer.cardPiles.discard}
                        drawDeck={thisPlayer.cardPiles.deck}
                        isMe={!spectating}
                        language={this.props.i18n.language}
                        manualMode={this.props.currentGame.manualMode}
                        numDeckCards={thisPlayer.numDeckCards}
                        onCardClick={this.onCardClick}
                        onCardAltClick={this.onCardAltClick}
                        onDieClick={this.onDieClick}
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                        onMenuItemClick={this.onMenuItemClick}
                        player={thisPlayer}
                        showDeckPile={true}
                        side='bottom'
                        spells={thisPlayer.cardPiles.spells}
                        spectating={spectating}
                        onDrawPopupChange={this.handleDrawPopupChange}
                        onPileClick={this.onPileClick}
                        onShuffleClick={this.onShuffleClick}
                        onDragDrop={this.onDragDrop}
                        phoenixborn={thisPlayer.phoenixborn}
                    />
                </div>
                <div className='player-home-row our-side'>
                    <PlayerRow
                        archives={thisPlayer.cardPiles.archives}
                        cardSize={cardSize}
                        isMe={!spectating}
                        hand={thisPlayer.cardPiles.hand}
                        leftMode={leftMode}
                        manualMode={this.props.currentGame.manualMode}
                        onCardClick={this.onCardClick}
                        onDragDrop={this.onDragDrop}
                        onMouseOut={this.onMouseOut}
                        onMouseOver={this.onMouseOver}
                        onDieClick={this.onDieClick}
                        onMenuItemClick={this.onMenuItemClick}
                        side='bottom'
                        dice={thisPlayer.dice}
                        purgedPile={thisPlayer.cardPiles.purged}
                    />
                </div>
            </div>
        ];
    }

    render() {
        if (Object.values(this.props.cards).length === 0 || !this.props.currentGame?.started) {
            return (
                <div>
                    <Trans>Waiting for server...</Trans>
                </div>
            );
        }

        if (!this.props.authUser) {
            this.props.navigate('/');
            return (
                <div>
                    <Trans>You are not logged in, redirecting...</Trans>
                </div>
            );
        }

        const cardSize = this.props.user.settings.cardSize;
        let spectating = !this.props.currentGame.players[this.props.user.username];
        let thisPlayer = this.props.currentGame.players[this.props.user.username];
        if (!thisPlayer) {
            thisPlayer = Object.values(this.props.currentGame.players)[0];
        }

        if (!thisPlayer) {
            return (
                <div>
                    <Trans>Waiting for game to have players or close...</Trans>
                </div>
            );
        }

        let otherPlayer = Object.values(this.props.currentGame.players).find((player) => {
            return player.name !== thisPlayer.name;
        });

        // Default any missing information
        thisPlayer = this.defaultPlayerInfo(thisPlayer);
        otherPlayer = this.defaultPlayerInfo(otherPlayer);

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        let boardClass = classNames('game-board', {
            'select-cursor': thisPlayer && thisPlayer.selectCard
        });

        let manualMode = this.props.currentGame.manualMode;
        let cardToZoom;

        if (this.props.cardToZoom && this.props.cards[this.props.cardToZoom.code]) {
            cardToZoom = this.props.cards[this.props.cardToZoom.code];
        } else if (this.props.cardToZoom) {
            cardToZoom = this.props.cardToZoom;
        }

        const compactLayout = this.props.optionSettings?.compactLayout;
        const leftMode = this.props.optionSettings?.leftMode;

        return (
            <div className={boardClass}>
                {this.state.showModal && (
                    <GameConfigurationModal
                        optionSettings={thisPlayer.optionSettings}
                        onOptionSettingToggle={this.onOptionSettingToggle.bind(this)}
                        onClose={() => this.setState({ showModal: false })}
                    />
                )}
                <div className='stats-top'>
                    <PlayerStats
                        stats={otherPlayer.stats}
                        activePlayer={otherPlayer.activePlayer}
                        actions={otherPlayer.actions}
                        compactLayout={compactLayout}
                        firstPlayer={otherPlayer.firstPlayer}
                        phoenixborn={otherPlayer.phoenixborn}
                        player={otherPlayer}
                        clockState={otherPlayer.clock}
                        winner={this.props.currentGame.winner}
                        onMouseOver={this.onMouseOver}
                    />
                </div>
                <div className='main-window'>
                    {leftMode && this.getPromptArea(thisPlayer)}
                    {this.renderBoard(thisPlayer, otherPlayer, compactLayout, leftMode, cardSize, spectating)}
                    {this.state.showWinSplash && this.props.currentGame.winner && (
                        <WinLoseSplash
                            game={this.props.currentGame}
                            onCloseClick={this.onWinSplashCloseClick}
                        />
                    )}
                    {!thisPlayer.inspectionCard && cardToZoom && (
                        <CardZoom
                            cardName={cardToZoom ? cardToZoom.name : null}
                            card={cardToZoom}
                            left={leftMode}
                        />
                    )}
                    {this.state.showManualCommands && (
                        <div className='info-panel'>
                            <MovablePanel
                                title='Manual Commands'
                                name='Manual'
                                onCloseClick={this.onManualCommandsClick}
                                side='bottom'
                            >
                                <ManualCommands />
                            </MovablePanel>
                        </div>
                    )}
                    {this.state.showDiceHistory && (
                        <div>
                            <DiceHistory
                                firstFive={thisPlayer.firstFive}
                                diceHistory={thisPlayer.diceHistory}
                                onCloseClick={this.onDiceHistoryClick}
                                side='bottom'
                            />
                        </div>
                    )}
                    <div className='right-side'>
                        {!leftMode && this.getPromptArea(thisPlayer)}

                        {this.state.showMessages && (
                            <div className='gamechat'>
                                {this.getOtherPlayerPrompt(otherPlayer)}
                                <GameChat
                                    key='gamechat'
                                    messages={this.props.currentGame.messages}
                                    onCardMouseOut={this.onMouseOut}
                                    onCardMouseOver={this.onMouseOver}
                                    onSendChat={this.sendChatMessage}
                                    muted={spectating && this.props.currentGame.muteSpectators}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <PlayerStats
                        {...boundActionCreators}
                        activePlayer={thisPlayer.activePlayer}
                        actions={thisPlayer.actions}
                        clockState={thisPlayer.clock}
                        // compactLayout={thisPlayer.optionSettings.compactLayout}
                        firstPlayer={thisPlayer.firstPlayer}
                        isMe={!spectating}
                        manualModeEnabled={manualMode}
                        matchRecord={this.getMatchRecord(thisPlayer, otherPlayer)}
                        muteSpectators={this.props.currentGame.muteSpectators}
                        numMessages={this.state.newMessages}
                        onDiceHistoryClick={this.onDiceHistoryClick}
                        onDragDrop={this.onDragDrop}
                        onManualCommandsClick={this.onManualCommandsClick}
                        onManualModeClick={this.onManualModeClick}
                        onMessagesClick={this.onMessagesClick}
                        onMuteClick={this.onMuteClick}
                        onSettingsClick={this.onSettingsClick}
                        phoenixborn={thisPlayer.phoenixborn}
                        player={thisPlayer}
                        showControls={!spectating && manualMode}
                        showManualMode={!spectating}
                        showMessages
                        size={this.cardSize}
                        stats={thisPlayer.stats}
                        winner={this.props.currentGame.winner}
                    />
                </div>
            </div>
        );
    }

    getOtherPlayerPrompt(otherPlayer) {
        let otherPlayerPrompt = null;
        if (this.props.currentGame.solo) {
            const otherState = otherPlayer.promptState;
            otherState.style = 'warning';
            otherPlayerPrompt = <div className='inset-pane'>
                <ActivePlayerPrompt
                    cards={this.props.cards}
                    promptState={otherState}
                    onButtonClick={this.onCommand}
                    onMouseOver={this.onMouseOver}
                    onMouseOut={this.onMouseOut}
                    onTimerExpired={this.onTimerExpired.bind(this)}
                    phase={this.props.currentGame.currentPhase}
                />
            </div>
        }
        return otherPlayerPrompt;
    }

    getCardLog() {
        return (
            <div className='timer-log-area'>
                <CardLog
                    items={this.props.currentGame.cardLog}
                    onMouseOut={this.onMouseOut}
                    onMouseOver={this.onMouseOver}
                />
            </div>
        );
    }

    getPromptArea(thisPlayer, otherPlayer) {
        let otherPlayerPrompt = null;
        // if (this.props.currentGame.solo) {
        //     const otherState = otherPlayer.promptState;
        //     otherState.style = 'warning';
        //     otherPlayerPrompt = <div className='inset-pane'>
        //         <ActivePlayerPrompt
        //             cards={this.props.cards}
        //             promptState={otherState}
        //             onButtonClick={this.onCommand}
        //             onMouseOver={this.onMouseOver}
        //             onMouseOut={this.onMouseOut}
        //             onTimerExpired={this.onTimerExpired.bind(this)}
        //             phase={this.props.currentGame.currentPhase}
        //         />
        //     </div>
        // }

        const logArea = thisPlayer.inspectionCard ? (
            <CardInspector card={thisPlayer.inspectionCard} />
        ) : (
            <div>{otherPlayerPrompt || this.getCardLog()}</div>
        );
        return (
            <div className='prompt-area panel'>
                {logArea}
                <div className='inset-pane'>
                    <ActivePlayerPrompt
                        cards={this.props.cards}
                        promptState={thisPlayer.promptState}
                        onButtonClick={this.onCommand}
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                        onTimerExpired={this.onTimerExpired.bind(this)}
                        phase={this.props.currentGame.currentPhase}
                    />
                    {this.getTimer(thisPlayer)}
                </div>
            </div>
        );
    }
}

GameBoard.displayName = 'GameBoard';
GameBoard.propTypes = {
    cardToZoom: PropTypes.object,
    cards: PropTypes.object,
    clearZoom: PropTypes.func,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
    dispatch: PropTypes.func,
    i18n: PropTypes.object,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    restrictedList: PropTypes.array,
    sendGameMessage: PropTypes.func,
    socket: PropTypes.object,
    t: PropTypes.func,
    user: PropTypes.object,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        cards: state.cards.cards,
        currentGame: state.lobby.currentGame,
        packs: state.cards.packs,
        restrictedList: state.cards.restrictedList,
        socket: state.lobby.socket,
        user: state.account.user,
        authUser: state.auth.user,
        // using ACCOUNT for temporary settings access
        optionSettings: state.account.user.settings.optionSettings || {}
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps, null)(GameBoard));
