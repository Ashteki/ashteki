const _ = require('underscore');

const defaultState = {
    games: [],
    users: [],
    messages: [],
    windowBlurred: false
};

export default function (state = defaultState, action) {
    let newState = Object.assign({}, state);

    switch (action.type) {
        case 'LOBBY_CONNECTING':
            newState.connecting = true;
            newState.connected = false;
            newState.socket = action.socket;

            break;
        case 'LOBBY_CONNECTED':
            newState.connecting = false;
            newState.connected = true;

            break;
        case 'LOBBY_DISCONNECTED':
            newState.connecting = false;
            newState.connected = false;

            break;
        case 'LOBBY_RECONNECING':
            (newState.connected = false), (newState.connecting = true);

            break;
        case 'LOBBY_MESSAGE_RECEIVED':
            return handleMessage(action, state);
        case 'LOBBY_MESSAGE_DELETED':
            return handleMessage(action, state);
        case 'RECEIVE_GAMEREPLAY':
            return handleReplay(action, state);
        case 'START_REPLAY':
            return handleReplayRaw(action, state);
        case 'CLEAR_GAMEREPLAY':
            return clearGameReplay(action, state);
        case 'REPLAY_FORWARD':
            return handleReplayForward(action, state);
        case 'REPLAY_TURN_FORWARD':
            return handleReplayTurnForward(action, state);
        case 'REPLAY_ROUND_FORWARD':
            return handleReplayRoundForward(action, state);
        case 'REPLAY_BACK':
            return handleReplayBack(action, state);
        case 'REPLAY_TURN_BACK':
            return handleReplayTurnBack(action, state);
        case 'REPLAY_ROUND_BACK':
            return handleReplayRoundBack(action, state);
        case 'JOIN_PASSWORD_GAME':
            newState.passwordGame = action.game;
            newState.passwordJoinType = action.joinType;

            break;
        case 'CANCEL_PASSWORD_JOIN':
            newState.passwordJoinType = undefined;
            newState.passwordGame = undefined;
            newState.passwordError = undefined;

            break;
        case 'GAME_SOCKET_CLOSED':
            newState.currentGame = undefined;
            newState.newGame = false;

            break;
        // case 'GAME_SOCKET_DISCONNECTED':
        //     newState.rootState = undefined;

        //     break;
        case 'PROFILE_SAVED':
            if (state.socket) {
                state.socket.emit('authenticate', action.response.token);
                state.socket.user = action.response.user;
            }

            break;
        case 'GAME_STARTING':
            newState.gameError = undefined;

            break;
        case 'START_NEWGAME':
            newState.newGame = true;
            newState.newGameType = action.gameType;

            break;
        case 'CANCEL_NEWGAME':
            newState.newGame = false;
            newState.newGameType = undefined;

            break;
        case 'CLEAR_CHAT_STATUS':
            newState.lobbyError = false;

            break;
        case 'CLEAR_GAMESTATE':
            newState.newGame = false;
            newState.currentGame = undefined;

            break;
        case 'WINDOW_BLUR':
            newState.windowBlurred = true;

            break;
        case 'WINDOW_FOCUS':
            newState.windowBlurred = false;

            break;
        case 'RESPONSE_TIME_RECEIVED':
            newState.responseTime = action.responseTime;

            break;
        case 'PLAYER_TYPED':
            newState.currentGame.opponentTyping = action.active;

            break;
        case 'RECEIVE_PAIRINGS':
            newState.leaguePairings = action.response.pairings;
            break;
        case 'RECEIVE_ALL_PAIRINGS':
            newState.allPairings = action.response.pairings;
            break;
        case 'CLEAR_PAIRINGS':
            newState.leaguePairings = null;
            break;
        default:
            return state;
    }

    return newState;
}

function handleGameState(action, state) {
    let retState = Object.assign({}, state, {
        currentGame: action.args[0]
    });

    var username = action.args[1];

    var currentState = retState.currentGame;
    if (!currentState) {
        retState.newGame = false;
        return retState;
    }

    if (
        currentState &&
        currentState.spectators &&
        currentState.spectators.some((spectator) => {
            return spectator.name === username;
        })
    ) {
        return retState;
    }

    if (!currentState) {
        delete retState.currentGame;
        retState.newGame = false;
    }

    if (currentState) {
        delete retState.passwordGame;
        delete retState.passwordJoinType;
        delete retState.passwordError;
    }

    if (retState.currentGame && !retState.currentGame.started) {
        retState.newGame = false;
    }

    return retState;
}

function handleMessage(action, state) {
    let newState = Object.assign({}, state);

    switch (action.message) {
        case 'games':
            newState.games = action.args[0];

            // If the current game is no longer in the game list, it must have been closed
            if (
                state.currentGame &&
                !action.args[0].some((game) => {
                    return game.id === state.currentGame.id;
                })
            ) {
                newState.currentGame = undefined;
                newState.newGame = false;
            }

            break;
        case 'newgame':
            newState.games = [...action.args[0], ...state.games];

            break;
        case 'removegame':
            newState.games = state.games.filter(
                (game) => !action.args[0].some((g) => g.id === game.id)
            );

            break;
        case 'updategame':
            var updatedGames = state.games.slice(0);
            for (let game of action.args[0]) {
                let index = _.findIndex(updatedGames, (g) => g.id === game.id);

                updatedGames[index] = game;
            }

            newState.games = updatedGames;

            break;
        case 'users':
            newState.users = action.args[0];

            break;
        case 'newuser':
            var users = state.users.slice(0);

            users.push(action.args[0]);
            users = users.sort((a, b) => a < b);

            newState.users = users;

            break;
        case 'userleft':
            newState.users = state.users.filter((u) => u.username !== action.args[0].username);

            break;
        case 'passworderror':
            newState.passwordError = action.args[0];

            break;
        case 'gameerror':
            newState.gameError = action.args[0];

            break;
        case 'lobbychat':
            newState.messages = [...state.messages, action.args[0]];
            break;
        case 'nochat':
            newState.lobbyError = true;

            break;
        case 'lobbymessages':
            newState.messages = action.args[0];

            break;
        case 'removemessage':
            var message = newState.messages.find(
                (message) => message._id === action.args[0]
            );
            message.deletedBy = action.args[1];
            message.deleted = true;

            newState.messages = [].concat(newState.messages);

            break;
        case 'banner':
            newState.notice = action.args[0];
            break;
        case 'gamestate':
            newState = handleGameState(action, state);

            break;
        case 'cleargamestate':
            newState.newGame = false;
            newState.currentGame = undefined;

            break;
    }

    return newState;
}

function handleReplay(action, state) {
    const replay = action.response.replay;
    return startReplay(state, replay);
}

function handleReplayRaw(action, state) {
    const replay = action.replayData;
    return startReplay(state, replay);
}

function startReplay(state, replay) {
    let retState = Object.assign({}, state, {
        replayData: replay
    });
    if (replay && replay.length > 0) {
        retState = updateReplayState(retState, 0);
    }
    return retState;
}

function clearGameReplay(action, state) {
    let retState = Object.assign({}, state, {
        replayData: undefined,
        stepIndex: undefined,
        stepTag: undefined,
        currentGame: undefined
    });

    return retState;
}

function handleReplayForward(action, state) {
    const newStepIndex = state.stepIndex + 1;

    let newState = updateReplayState(state, newStepIndex);
    return newState;
}

function handleReplayTurnForward(action, state) {
    if (state.stepIndex === state.replayData.length - 1) {
        return state;
    }

    let newStepIndex = state.stepIndex;
    for (let i = state.stepIndex + 1; i < state.replayData.length; i++) {
        const thisStep = state.replayData[i];
        if (['begin-turn', 'end'].includes(thisStep.tag)) {
            newStepIndex = i;
            break;
        }
    }

    let newState = updateReplayState(state, newStepIndex);
    return newState;
}

function handleReplayRoundForward(action, state) {
    if (state.stepIndex === state.replayData.length - 1) {
        return state;
    }

    let newStepIndex = state.stepIndex;
    for (let i = state.stepIndex + 1; i < state.replayData.length; i++) {
        const thisStep = state.replayData[i];
        if (['prepare', 'end'].includes(thisStep.tag)) {
            newStepIndex = i;
            break;
        }
    }

    let newState = updateReplayState(state, newStepIndex);
    return newState;
}

function updateReplayState(state, newStepIndex) {
    const newReplayStep = state.replayData[newStepIndex];
    const stepTag = newReplayStep.tag;
    const newGameState = newReplayStep.state;
    newGameState.isReplay = true;
    let newState = Object.assign({}, state, {
        stepIndex: newStepIndex,
        stepTag: stepTag,
        currentGame: newGameState
    });
    return newState;
}

function handleReplayBack(action, state) {
    const newStepIndex = state.stepIndex > 0 ? state.stepIndex - 1 : 0;
    let newState = updateReplayState(state, newStepIndex);

    return newState;
}
function handleReplayTurnBack(action, state) {
    if (state.stepIndex === 0) {
        return state;
    }

    let newStepIndex = state.stepIndex;
    for (let i = state.stepIndex - 1; i >= 0; i--) {
        const thisStep = state.replayData[i];
        if (['begin-turn', 'prepare'].includes(thisStep.tag)) {
            newStepIndex = i;
            break;
        }
    }

    let newState = updateReplayState(state, newStepIndex);
    return newState;
};

function handleReplayRoundBack(action, state) {
    if (state.stepIndex === 0) {
        return state;
    }

    let newStepIndex = state.stepIndex;
    for (let i = state.stepIndex - 1; i >= 0; i--) {
        const thisStep = state.replayData[i];
        if (['prepare'].includes(thisStep.tag)) {
            newStepIndex = i;
            break;
        }
    }

    let newState = updateReplayState(state, newStepIndex);
    return newState;
};