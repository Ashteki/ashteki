const uuid = require('uuid');
const _ = require('underscore');
const crypto = require('crypto');

const GameChat = require('./game/gamechat.js');
const logger = require('./log');
const PendingPlayer = require('./models/PendingPlayer.js');

class PendingGame {
    constructor(owner, details) {
        this.newGameType = details.newGameType;
        this.solo = details.gameFormat === 'solo';
        if (this.solo) {
            this.soloLevel = 'S';
            this.soloStage = '1';
        }
        this.allowSpectators = details.allowSpectators;
        this.createdAt = new Date();
        this.startedAt = null;
        this.gameChat = new GameChat(this);
        this.gameFormat = details.gameFormat;
        this.gamePrivate = !!details.gamePrivate; // hides from game list
        // this.gameType = details.gameType;
        this.gameType = details.ranked ? 'competitive' : 'casual';
        this.id = uuid.v1();
        this.label = details.label;
        this.muteSpectators = details.muteSpectators;
        this.name = details.name;
        this.node = {};
        this.owner = owner;
        this.players = {};
        this.showHand = details.showHand;
        this.openHands = details.openHands;
        this.spectators = {};
        this.started = false;
        this.swap = !!details.swap;
        this.rematch = false;
        this.tournament = details.tournament;

        this.useGameTimeLimit = details.useGameTimeLimit;
        this.gameTimeLimit = details.gameTimeLimit;
        this.clockType = details.clockType;
    }

    // Getters
    getPlayersAndSpectators() {
        return Object.assign({}, this.players, this.spectators);
    }

    getPlayers() {
        return this.players;
    }

    getSpectators() {
        return Object.values(this.spectators);
    }

    getPlayerOrSpectator(playerName) {
        return this.getPlayersAndSpectators()[playerName];
    }

    getPlayerByName(playerName) {
        return this.players[playerName];
    }

    getOtherPlayer(thisPlayerName) {
        for (const [key, value] of Object.entries(this.players)) {
            if (key !== thisPlayerName) {
                return value;
            }
        }
        return null;
    }

    getSaveState() {
        let players = _.map(this.getPlayers(), (player) => {
            return {
                deck: player.deck.phoenixborn[0].card.name,
                name: player.name,
                turn: player.turn,
                wins: player.wins
            };
        });

        return {
            id: this.id,
            gameFormat: this.gameFormat,
            gamePrivate: this.gamePrivate,
            gameId: this.id,
            gameType: this.gameType,
            label: this.label,
            players: players,
            startedAt: this.createdAt,
            swap: this.swap,
            solo: this.solo
        };
    }

    // Actions
    addMessage() {
        this.gameChat.addMessage(...arguments);
    }

    addPlayer(id, user) {
        if (!user) {
            logger.error('Tried to add a player to a game that did not have a user object');
            return;
        }

        const isOwner = this.owner.username === user.username;
        this.players[user.username] = new PendingPlayer(id, user.username, isOwner, user);
    }

    addSpectator(id, user) {
        this.spectators[user.username] = {
            emailHash: user.emailHash,
            id: id,
            name: user.username,
            user: user
        };
    }

    newGame(id, user, password, join) {
        if (password) {
            this.password = crypto.createHash('md5').update(password).digest('hex');
        }

        if (join) {
            this.addPlayer(id, user);
        }
    }

    isUserBlocked(user) {
        return _.contains(this.owner.blockList, user.username.toLowerCase());
    }

    join(id, user, password) {
        if (_.size(this.players) === 2 || this.started) {
            return 'Game full';
        }

        if (this.isUserBlocked(user)) {
            return 'Cannot join game';
        }

        if (this.password) {
            if (crypto.createHash('md5').update(password).digest('hex') !== this.password) {
                return 'Incorrect game password';
            }
        }

        this.addMessage('{0} has joined the game', user.username);
        this.addPlayer(id, user);

        if (!this.isOwner(this.owner.username)) {
            let otherPlayer = Object.values(this.players).find(
                (player) => player.name !== this.owner.username
            );

            if (otherPlayer) {
                this.owner = otherPlayer.user;
                otherPlayer.owner = true;
            }
        }

        return undefined;
    }

    watch(id, user, password) {
        if (user && user.permissions && user.permissions.canManageGames) {
            this.addSpectator(id, user);
            this.addMessage('{0} has joined the game as a spectator', user.username);

            return;
        }

        if (!this.allowSpectators) {
            return 'Join not permitted';
        }

        if (this.isUserBlocked(user)) {
            return 'Cannot join game';
        }

        if (this.password) {
            if (crypto.createHash('md5').update(password).digest('hex') !== this.password) {
                return 'Incorrect game password';
            }
        }

        this.addSpectator(id, user);
        this.addMessage('{0} has joined the game as a spectator', user.username);
    }

    leave(playerName) {
        let player = this.getPlayerOrSpectator(playerName);
        if (!player) {
            return;
        }

        if (!this.started) {
            this.addMessage('{0} has left the game', playerName);
        }

        if (this.players[playerName]) {
            if (this.started) {
                this.players[playerName].left = true;
            } else {
                this.removeAndResetOwner(playerName);

                delete this.players[playerName];
            }
        }

        if (this.spectators[playerName]) {
            delete this.spectators[playerName];
        }
    }

    disconnect(playerName) {
        let player = this.getPlayerOrSpectator(playerName);
        if (!player) {
            return;
        }

        if (!this.started) {
            this.addMessage('{0} has disconnected', playerName);
        }

        if (this.players[playerName]) {
            if (!this.started) {
                this.removeAndResetOwner(playerName);

                delete this.players[playerName];
            }
        } else {
            delete this.spectators[playerName];
        }
    }

    chat(playerName, message) {
        let player = this.getPlayerOrSpectator(playerName);
        if (!player) {
            return;
        }

        player.argType = 'player';

        this.addMessage('{0} {1}', player, message);
    }

    selectDeck(playerName, deck, forOpponent) {
        var player = forOpponent
            ? this.getOtherPlayer(playerName)
            : this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        if (player.deck) {
            player.deck.selected = false;
        }

        player.deck = deck;
        player.deck.selected = true;
    }

    // interrogators
    isEmpty() {
        return !_.any(this.getPlayersAndSpectators(), (player) =>
            this.hasActivePlayer(player.name)
        );
    }

    isOwner(playerName) {
        let player = this.players[playerName];

        if (!player || !player.owner) {
            return false;
        }

        return true;
    }

    removeAndResetOwner(playerName) {
        if (this.isOwner(playerName)) {
            let otherPlayer = _.find(this.players, (player) => player.name !== playerName);

            if (otherPlayer) {
                this.owner = otherPlayer.user;
                otherPlayer.owner = true;
            }
        }
    }

    hasActivePlayer(playerName) {
        return (
            (this.players[playerName] &&
                !this.players[playerName].left &&
                !this.players[playerName].disconnected) ||
            this.spectators[playerName]
        );
    }

    isVisibleFor(user) {
        if (!user) {
            return true;
        }

        if (user.permissions && user.permissions.canManageGames) {
            return true;
        }

        if (this.gamePrivate && !this.started) {
            return user.permissions && user.permissions.canManageTournaments && this.tournament;
        }

        let players = Object.values(this.players);
        return (
            !this.owner.hasUserBlocked(user) &&
            !user.hasUserBlocked(this.owner) &&
            players.every((player) => !player.user.hasUserBlocked(user))
        );
    }

    // Summary
    getSummary(activePlayer) {
        let playerSummaries = {};
        let playersInGame = _.filter(this.players, (player) => !player.left);

        _.each(playersInGame, (player) => {
            let deck = {};
            if (player.deck) {
                deck = {
                    selected: player.deck.selected,
                    status: player.deck.status,
                    name: null,
                    isChimera: player.playerType === 'dummy',
                    pbStub:
                        player.deck.phoenixborn[0]?.card.imageStub ||
                        player.deck.phoenixborn[0]?.card.stub
                };
                if (
                    activePlayer === player.name ||
                    ['firstadventure', 'solo'].includes(this.gameFormat)
                ) {
                    deck.name = player.deck.name;
                }
            }

            playerSummaries[player.name] = {
                avatar: player.user.avatar,
                deck: deck,
                id: player.id,
                left: player.left,
                name: player.name,
                owner: player.owner,
                role: player.user.role,
                wins: player.wins,
                faveColor: player.user.faveColor,
                gamesPlayed: player.user.gamesPlayed ? player.user.gamesPlayed : 0,
                eloRating: player.user.eloRating
            };
        });

        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            gameFormat: this.gameFormat,
            gamePrivate: this.gamePrivate,
            gameType: this.gameType,
            gameTimeLimit: this.gameTimeLimit,
            id: this.id,
            label: this.label,
            messages: activePlayer ? this.gameChat.messages : undefined,
            muteSpectators: this.muteSpectators,
            name: this.name,
            needsPassword: !!this.password,
            newGameType: this.newGameType,
            node: this.node ? this.node.identity : undefined,
            owner: this.owner.username,
            players: playerSummaries,
            showHand: this.showHand,
            openHands: this.openHands,
            started: this.started,
            swap: this.swap,
            spectators: Object.values(this.spectators).map((spectator) => {
                return {
                    id: spectator.id,
                    name: spectator.name,
                    avatar: spectator.user.avatar
                };
            }),
            startedAt: this.startedAt,
            solo: this.solo,
            useGameTimeLimit: this.useGameTimeLimit,
            clockType: this.clockType
        };
    }

    getStartGameDetails() {
        const players = {};

        for (let playerDetails of Object.values(this.players)) {
            const { name, user, ...rest } = playerDetails;
            players[name] = {
                name,
                user: user.getDetails(),
                ...rest
            };
        }

        const spectators = {};
        for (let spectatorDetails of Object.values(this.spectators)) {
            const { name, user, ...rest } = spectatorDetails;
            spectators[name] = {
                name,
                user: user.getDetails(),
                ...rest
            };
        }

        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            gameFormat: this.gameFormat,
            gamePrivate: this.gamePrivate,
            gameTimeLimit: this.gameTimeLimit,
            gameType: this.gameType,
            id: this.id,
            label: this.label,
            muteSpectators: this.muteSpectators,
            name: this.name,
            needsPassword: !!this.password,
            owner: this.owner.getDetails(),
            players,
            showHand: this.showHand,
            openHands: this.openHands,
            spectators,
            started: this.started,
            swap: this.swap,
            useGameTimeLimit: this.useGameTimeLimit,
            clockType: this.clockType,
            solo: this.solo,
            soloLevel: this.soloLevel,
            soloStage: this.soloStage
        };
    }
}

module.exports = PendingGame;
