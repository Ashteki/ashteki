const socketio = require('socket.io');
const Socket = require('./socket.js');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const moment = require('moment');

const logger = require('./log');
const version = moment(require('../version').releaseDate);
const PendingGame = require('./pendinggame');
const GameRouter = require('./gamerouter');
const ServiceFactory = require('./services/ServiceFactory');
const AshesDeckService = require('./services/AshesDeckService');
const UserService = require('./services/AshesUserService');
const ConfigService = require('./services/ConfigService');
const User = require('./models/User');
const { sortBy } = require('./Array');
const DummyUser = require('./models/DummyUser.js');
const CampaignDeckValidator = require('./CampaignDeckValidator.js');

class Lobby {
    constructor(server, options = {}) {
        this.sockets = {};
        this.socketsByName = {};
        this.users = {};
        this.games = {};
        this.configService = options.configService || new ConfigService();
        this.cardService = options.cardService || ServiceFactory.cardService(options.configService);
        this.userService = options.userService || new UserService(options.configService);
        this.deckService = options.deckService || new AshesDeckService(this.configService);
        this.router = options.router || new GameRouter(this.configService);

        this.router.on('onGameClosed', this.onGameClosed.bind(this));
        this.router.on('onGameRematch', this.onGameRematch.bind(this));
        this.router.on('onGameFinished', this.onGameFinished.bind(this));
        this.router.on('onPlayerLeft', this.onPlayerLeft.bind(this));
        this.router.on('onWorkerTimedOut', this.onWorkerTimedOut.bind(this));
        this.router.on('onNodeReconnected', this.onNodeReconnected.bind(this));
        this.router.on('onWorkerStarted', this.onWorkerStarted.bind(this));

        this.userService.on('onBlocklistChanged', this.onBlocklistChanged.bind(this));

        this.io = options.io || new socketio.Server(server, {});

        // this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));

        setInterval(() => this.clearStalePendingGames(), 60 * 1000); // every minute
        setInterval(() => this.clearOldRefreshTokens(), 2 * 60 * 60 * 1000); // every 2 hours
    }

    async init() {
        // pre cache card list so the first user to the site doesn't have a slowdown
        this.cards = await this.cardService.getAllCards();
        this.precons = await this.deckService.getPrecons();
    }

    // External methods
    getStatus() {
        return this.router.getNodeStatus();
    }

    disableNode(nodeName) {
        return this.router.disableNode(nodeName);
    }

    enableNode(nodeName) {
        return this.router.enableNode(nodeName);
    }

    debugDump() {
        let games = Object.values(this.games).map((game) => {
            let players = Object.values(game.players).map((player) => {
                return {
                    name: player.name,
                    left: player.left,
                    disconnected: player.disconnected,
                    id: player.id
                };
            });

            let spectators = Object.values(game.spectators).map((spectator) => {
                return {
                    name: spectator.name,
                    id: spectator.id
                };
            });

            return {
                name: game.name,
                players: players,
                spectators: spectators,
                id: game.id,
                started: game.started,
                node: game.node ? game.node.identity : 'None',
                startedAt: game.createdAt
            };
        });

        let nodes = this.router.getNodeStatus();

        return {
            games: games,
            nodes: nodes,
            socketCount: Object.values(this.sockets).length,
            userCount: Object.values(this.users).length
        };
    }

    // Helpers
    findGameForUser(user) {
        return Object.values(this.games).find((game) => {
            if (game.spectators[user]) {
                return true;
            }

            let player = game.players[user];

            if (!player || player.left) {
                return false;
            }

            return true;
        });
    }

    getUserList() {
        let userList = Object.values(this.users).map((user) => {
            return user.getShortSummary();
        });

        userList = sortBy(userList, (user) => {
            return user.name.toLowerCase();
        });

        return userList;
    }

    handshake(ioSocket, next) {
        let versionInfo = undefined;

        if (ioSocket.handshake.query.token && ioSocket.handshake.query.token !== 'undefined') {
            jwt.verify(
                ioSocket.handshake.query.token,
                this.configService.getValue('secret'),
                (err, user) => {
                    if (err) {
                        ioSocket.emit('authfailed');
                        return;
                    }

                    this.userService
                        .getUserById(user.id)
                        .then((dbUser) => {
                            let socket = this.sockets[ioSocket.id];
                            if (!socket) {
                                logger.error(
                                    'Tried to authenticate socket for %s but could not find it',
                                    dbUser.username
                                );
                                return;
                            }

                            if (dbUser.disabled) {
                                ioSocket.disconnect();
                                return;
                            }

                            ioSocket.request.user = dbUser.getWireSafeDetails();
                            socket.user = dbUser;
                            this.users[dbUser.username] = socket.user;
                            this.socketsByName[dbUser.username] = socket;

                            this.doPostAuth(socket);
                        })
                        .catch((err) => {
                            logger.error(err);
                        });
                }
            );
        }

        if (ioSocket.handshake.query.version) {
            versionInfo = moment(ioSocket.handshake.query.version);
        }

        if (!versionInfo || versionInfo < version) {
            ioSocket.emit(
                'banner',
                'Your client version is out of date, please refresh or clear your cache to get the latest version'
            );
        }

        next();
    }

    // Actions
    mapGamesToGameSummaries(games) {
        return _.chain(games)
            .map((game) => game.getSummary())
            .sortBy('createdAt')
            .sortBy('started')
            .reverse()
            .value();
    }

    broadcastGameMessage(message, games) {
        if (!Array.isArray(games)) {
            games = [games];
        }

        for (let socket of Object.values(this.sockets)) {
            if (!socket) {
                continue;
            }

            let filteredGames = Object.values(games).filter((game) =>
                game.isVisibleFor(socket.user)
            );
            let gameSummaries = filteredGames.map((game) => game.getSummary());

            socket.send(message, gameSummaries);
        }
    }

    broadcastGameList(socket) {
        let sockets = {};

        if (socket) {
            sockets[socket.id] = socket;
        } else {
            sockets = this.sockets;
        }

        for (let socket of Object.values(sockets)) {
            if (!socket) {
                continue;
            }

            let filteredGames = Object.values(this.games).filter((game) =>
                game.isVisibleFor(socket.user)
            );
            let gameSummaries = this.mapGamesToGameSummaries(filteredGames);

            socket.send('games', gameSummaries);
        }
    }

    sendUserListFilteredWithBlockList(socket, userList) {
        let filteredUsers = userList;

        if (socket.user) {
            filteredUsers = userList.filter((user) => {
                return !socket.user.hasUserBlocked(user);
            });
        }

        socket.send('users', filteredUsers);
    }

    broadcastUserMessage(user, message) {
        for (let socket of Object.values(this.sockets)) {
            if (socket.user === user || (socket.user && socket.user.hasUserBlocked(user))) {
                continue;
            }

            socket.send(message, user.getShortSummary());
        }
    }

    broadcastUserList() {
        for (let socket of Object.values(this.sockets)) {
            this.sendUserListFilteredWithBlockList(socket, this.getUserList());
        }
    }

    sendGameState(game) {
        if (game.started) {
            return;
        }

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            if (!this.sockets[player.id]) {
                logger.info(`Wanted to send to ${player.id} but have no socket`);
                continue;
            }

            this.sockets[player.id].send('gamestate', game.getSummary(player.name));
        }
    }

    clearGamesForNode(nodeName) {
        for (let game of Object.values(this.games)) {
            if (game.node && game.node.identity === nodeName) {
                delete this.games[game.id];
            }
        }

        this.broadcastGameList();
    }

    clearStalePendingGames() {
        const timeout = 60 * 60 * 1000; // 1 hours
        let staleGames = Object.values(this.games).filter(
            (game) => !game.started && Date.now() - game.createdAt > timeout
        );

        for (let game of staleGames) {
            logger.info(`closed pending game ${game.id} due to inactivity`);
            delete this.games[game.id];
        }

        if (staleGames.length > 0) {
            this.broadcastGameMessage('removegame', staleGames);
        }
    }

    clearOldRefreshTokens() {
        logger.info('Starting refresh token cleanup...');

        this.userService.cleanupRefreshTokens().then(() => {
            logger.info('Refresh token cleanup completed.');
        });
    }

    filterMessages(messages, socket) {
        if (!socket.user) {
            return messages;
        }

        return messages.filter((message) => {
            return !socket.user.hasUserBlocked(message.user);
        });
    }

    // Events
    onConnection(ioSocket) {
        let socket = new Socket(ioSocket, { configService: this.configService });

        socket.registerEvent('chat', this.onPendingGameChat.bind(this));
        socket.registerEvent('clearsessions', this.onClearSessions.bind(this));
        socket.registerEvent('connectfailed', this.onConnectFailed.bind(this));
        socket.registerEvent('getnodestatus', this.onGetNodeStatus.bind(this));
        socket.registerEvent('joingame', this.onJoinGame.bind(this));
        socket.registerEvent('leavegame', this.onLeaveGame.bind(this));
        socket.registerEvent('newgame', this.onNewGame.bind(this));
        socket.registerEvent('removegame', this.onRemoveGame.bind(this));
        socket.registerEvent('restartnode', this.onRestartNode.bind(this));
        socket.registerEvent('selectdeck', this.onSelectDeck.bind(this));
        socket.registerEvent('setsololevel', this.onSetSoloLevel.bind(this));
        socket.registerEvent('setsolostage', this.onSetSoloStage.bind(this));
        socket.registerEvent('startgame', this.onStartGame.bind(this));
        socket.registerEvent('togglenode', this.onToggleNode.bind(this));
        socket.registerEvent('watchgame', this.onWatchGame.bind(this));

        socket.on('authenticate', this.onAuthenticated.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));

        this.sockets[ioSocket.id] = socket;

        if (socket.user) {
            this.users[socket.user.username] = socket.user;
            this.socketsByName[socket.user.username] = socket;

            this.broadcastUserMessage(socket.user, 'newuser');
        }

        this.sendUserListFilteredWithBlockList(socket, this.getUserList());
        this.broadcastGameList(socket);

        if (!socket.user) {
            return;
        }

        let game = this.findGameForUser(socket.user.username);
        if (game && game.started) {
            this.sendHandoff(socket, game.node, game.id);
        }
    }

    doPostAuth(socket) {
        let user = socket.user;

        if (!user) {
            return;
        }

        this.broadcastUserMessage(user, 'newuser');
        this.sendUserListFilteredWithBlockList(socket, this.getUserList());

        this.broadcastGameList(socket);

        let game = this.findGameForUser(user.username);
        if (game && game.started) {
            this.sendHandoff(socket, game.node, game.id);
        }
    }

    onAuthenticated(socket, user) {
        if (socket.user) {
            return;
        }

        this.userService
            .getUserById(user.id)
            .then((dbUser) => {
                this.users[dbUser.username] = dbUser;
                this.socketsByName[dbUser.username] = socket;

                socket.user = dbUser;

                this.doPostAuth(socket);
            })
            .catch((err) => {
                logger.error(err);
            });
    }

    onSocketDisconnected(socket, reason) {
        if (!socket) {
            return;
        }

        delete this.sockets[socket.id];

        if (!socket.user) {
            return;
        }

        this.broadcastUserMessage(socket.user, 'userleft');

        delete this.users[socket.user.username];
        delete this.socketsByName[socket.user.username];

        logger.info(`user '${socket.user.username}' disconnected from the lobby: ${reason}`);

        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        game.disconnect(socket.user.username);

        if (game.isEmpty() && !game.tournament) {
            this.broadcastGameMessage('removegame', game);
            delete this.games[game.id];
        } else {
            this.broadcastGameMessage('updategame', game);
            this.sendGameState(game);
        }
    }

    async onNewGame(socket, gameDetails) {
        if (!socket.user.permissions.canManageTournaments || !gameDetails.tournament) {
            let existingGame = this.findGameForUser(socket.user.username);
            if (existingGame) {
                return;
            }
        }

        let game = new PendingGame(socket.user, gameDetails);
        game.newGame(socket.id, socket.user, gameDetails.password, true);
        socket.joinChannel(game.id);

        if (gameDetails.gameFormat === 'coaloff') {
            // preselect coal deck
            try {
                await this.selectDeck(game, socket.user, -2);
            } catch (err) {
                logger.info(err);

                return;
            }
        }

        if (game.solo) {
            const dummy = new DummyUser();
            game.addPlayer(0, dummy);
            await this.selectDeck(game, dummy, true, -1, 0, game.gameFormat);
        }

        this.sendGameState(game);

        this.games[game.id] = game;
        this.broadcastGameMessage('newgame', game);
    }

    async onJoinGame(socket, gameId, password) {
        let existingGame = this.findGameForUser(socket.user.username);
        if (existingGame) {
            return;
        }

        let game = this.games[gameId];
        if (!game) {
            return;
        }

        let message = game.join(socket.id, socket.user, password);
        if (message) {
            socket.send('passworderror', message);

            return;
        }

        socket.joinChannel(game.id);
        if (game.gameFormat === 'coaloff') {
            // preselect coal deck
            try {
                await this.selectDeck(game, socket.user, -2);
            } catch (err) {
                logger.info(err);

                return;
            }
        }
        this.sendGameState(game);
        this.broadcastGameMessage('updategame', game);
    }

    onStartGame(socket, gameId) {
        let game = this.games[gameId];

        if (!game || game.started) {
            return;
        }

        if (
            Object.values(game.getPlayers()).some((player) => {
                return !player.deck;
            })
        ) {
            return;
        }

        if (!game.isOwner(socket.user.username)) {
            return;
        }

        let gameNode = this.router.startGame(game);
        if (!gameNode) {
            socket.send('gameerror', 'No game nodes available. Try again later.');
            return;
        }

        game.node = gameNode;
        game.started = true;
        game.startedAt = new Date();

        this.broadcastGameMessage('updategame', game);

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            let socket = this.sockets[player.id];

            if (!socket || !socket.user) {
                logger.error(`Wanted to handoff to ${player.name}, but couldn't find a socket`);
                continue;
            }

            this.sendHandoff(socket, gameNode, game.id);
        }
    }

    sendHandoff(socket, gameNode, gameId) {
        let user = socket.user.getWireSafeDetails();
        let authToken = jwt.sign(user, this.configService.getValue('secret'), { expiresIn: '5m' });

        socket.send('handoff', {
            address: gameNode.address,
            authToken: authToken,
            gameId: gameId,
            name: gameNode.identity,
            port: gameNode.port,
            protocol: gameNode.protocol,
            user: user
        });
    }

    onWatchGame(socket, gameId, password) {
        let existingGame = this.findGameForUser(socket.user.username);
        if (existingGame) {
            return;
        }

        let game = this.games[gameId];
        if (!game) {
            return;
        }

        let message = game.watch(socket.id, socket.user, password);
        if (message) {
            socket.send('passworderror', message);

            return;
        }

        socket.joinChannel(game.id);

        if (game.started) {
            this.router.addSpectator(game, socket.user.getDetails());
            this.sendHandoff(socket, game.node, game.id);
        } else {
            this.sendGameState(game);
        }
    }

    onLeaveGame(socket) {
        const username = socket.user.username;
        let game = this.findGameForUser(username);
        if (!game) {
            return;
        }

        if (game.solo && !game.isSpectator(username)) {
            game.leave(DummyUser.DUMMY_USERNAME);
        }
        game.leave(username);
        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if (game.isEmpty() && !game.tournament) {
            delete this.games[game.id];
            this.broadcastGameMessage('removegame', game);
        } else {
            this.sendGameState(game);
            this.broadcastGameMessage('updategame', game);
        }
    }

    onPendingGameChat(socket, message) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        game.chat(socket.user.username, message);
        this.sendGameState(game);
    }

    // called when the lobby server receives a 'selectdeck' message
    async onSelectDeck(socket, gameId, isForMe, deckId, isStandalone, chooseForMeType) {
        let game = this.games[gameId];
        if (!game) {
            return;
        }

        try {
            await this.selectDeck(
                game,
                socket.user,
                isForMe, // for me or for opponent (dummy/solo)
                deckId,
                isStandalone,
                chooseForMeType
            );
        } catch (err) {
            logger.info(err);

            return;
        }
        this.sendGameState(game);
    }

    async selectDeck(game, user, isForMe, deckId, isPrecon, chooseForMeType) {
        // get cards (need this for random deck generation)
        const cards = this.cards;
        let deck = null;
        if (isPrecon) {
            deck = await this.deckService.getPreconDeckById(deckId);
        } else if (game.gameFormat === 'coaloff') {
            deck = this.deckService.getCoalOffDeck(cards);
        } else if (game.solo && user.isDummy) {
            deck = await this.deckService.getChimeraDeck();
        } else {
            switch (deckId) {
                case -1: // random choice 
                    deck = await this.deckService.getRandomChoice(user, chooseForMeType);
                    break;
                default:
                    deck = await this.deckService.getById(deckId);
            }
        }

        // add drawdeck card prototypes to deckdata cardcount
        for (let card of deck.cards) {
            card.card = cards[card.id];
        }
        let cardCount = deck.cards.reduce((acc, card) => acc + card.count, 0);

        // add conjuration card prototypes to deckdata cardcount
        for (let conj of deck.conjurations) {
            conj.card = cards[conj.id];
        }

        let hasPhoenixborn = false;
        // add phoenixborn card prototypes to deckdata cardcount
        for (let pb of deck.phoenixborn) {
            pb.card = cards[pb.id];
            hasPhoenixborn = true;
        }

        if (deck.ultimate) {
            for (let u of deck.ultimate) {
                u.card = cards[u.id];
            }
        }

        if (deck.behaviour) {
            for (let u of deck.behaviour) {
                u.card = cards[u.id];
            }
        }

        let hasConjurations = this.checkConjurations(deck);
        let tenDice = 10 === deck.dicepool.reduce((acc, d) => acc + d.count, 0);

        const countUniques = deck.cards
            .filter((c) => c.card.phoenixborn)
            .reduce((agg, b) => agg + b.count, 0);
        const validUniques =
            // none for other pbs
            deck.cards.filter(
                (c) => c.card.phoenixborn && c.card.phoenixborn !== deck.phoenixborn[0].card.name
            ).length === 0 &&
            // max 3 uniques
            countUniques <= 3;
        let uniques = !hasPhoenixborn || validUniques;

        const maxThree = !deck.cards.some((c) => c.count > 3);

        const legalToPlay =
            hasPhoenixborn && maxThree && cardCount === 30 && hasConjurations && tenDice && uniques;

        deck.status = {
            basicRules: hasPhoenixborn && cardCount === 30,
            maxThree: maxThree,
            legalToPlay: legalToPlay,
            hasConjurations: hasConjurations,
            tenDice: tenDice,
            uniques: uniques,
            noUnreleasedCards: true,
            officialRole: true
        };

        if (game.gameFormat === 'hl2pvp') {
            const validator = new CampaignDeckValidator(this.cards, this.precons);
            const hl2pvp = validator.validateDeck(deck, 2).valid;
            deck.status.hl2pvp = hl2pvp;
        }

        game.selectDeck(user.username, deck, !isForMe);
    }

    onSetSoloLevel(socket, gameId, level) {
        let game = this.games[gameId];
        if (!game) {
            return;
        }

        game.soloLevel = level;
        this.sendGameState(game);
    }

    onSetSoloStage(socket, gameId, stage) {
        let game = this.games[gameId];
        if (!game) {
            return;
        }

        game.soloStage = stage;
        this.sendGameState(game);
    }

    checkConjurations(deck) {
        let cons = deck.cards
            .concat(deck.phoenixborn)
            .filter((c) => !!c.card.conjurations)
            .reduce((acc, c) => acc.concat(c.card.conjurations), [])
            .map((c) => c.stub);
        let result = cons.reduce(
            (a, stub) => a && deck.conjurations.some((c) => c.id === stub),
            true
        );
        return result;
    }

    onConnectFailed(socket) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        logger.info("user '%s' failed to handoff to game server", socket.user.username);
        this.router.notifyFailedConnect(game, socket.user.username);
    }

    onRemoveGame(socket, gameId) {
        if (!socket.user.permissions.canManageGames) {
            return;
        }

        let game = this.games[gameId];
        if (!game) {
            return;
        }

        logger.info(`${socket.user.username} closed game ${game.id} (${game.name}) forcefully`);

        if (!game.started) {
            delete this.games[game.id];
        } else {
            this.router.closeGame(game);
        }

        this.broadcastGameMessage('removegame', game);
    }

    onGetNodeStatus(socket) {
        if (!socket.user.permissions.canManageNodes) {
            return;
        }

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    onToggleNode(socket, node) {
        if (!socket.user.permissions.canManageNodes) {
            return;
        }

        this.router.toggleNode(node);

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    onRestartNode(socket, node) {
        if (!socket.user.permissions.canManageNodes) {
            return;
        }

        this.router.restartNode(node);

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    // router Events
    onGameClosed(gameId) {
        let game = this.games[gameId];

        if (!game) {
            return;
        }

        this.broadcastGameMessage('removegame', game);
        delete this.games[gameId];
    }

    onGameFinished(gameId) {
        let game = this.games[gameId];

        if (!game) {
            return;
        }

        game.finishedAt = new Date();
        this.broadcastGameMessage('updategame', game);

        // refresh the userlist with the latest player record (with game count incremented) 
        const promises = [];
        for (const p in game.players) {
            const socket = this.socketsByName[game.players[p].name];
            const user = this.users[game.players[p].name];

            if (user) {
                promises.push(
                    this.userService
                        .getUserById(user.id)
                        .then((dbUser) => {
                            this.users[dbUser.username] = dbUser;
                            socket.user = dbUser;
                        })
                        .catch((err) => {
                            logger.error(err);
                        })
                );
            }
        }

        Promise.all(promises).then(() => {
            // broadcast user list
            this.broadcastUserList();
        });
    }

    onGameRematch(oldGame) {
        let gameId = oldGame.gameId;
        let game = this.games[gameId];

        if (!game) {
            return;
        }

        this.broadcastGameMessage('removegame', game);
        delete this.games[gameId];

        let newGame = new PendingGame(game.owner, {
            gameTimeLimit: game.gameTimeLimit,
            gameFormat: game.gameFormat,
            gameType: game.gameType,
            showHand: game.showHand,
            openHands: game.openHands,
            allowSpectators: game.allowSpectators,
            swap: oldGame.swap,
            useGameTimeLimit: game.useGameTimeLimit,
            clockType: game.clockType,
            saveReplay: game.saveReplay
        });
        newGame.rematch = true;

        let owner = game.getPlayerOrSpectator(game.owner.username);
        if (!owner) {
            logger.error("Tried to rematch but the owner wasn't in the game");
            return;
        }

        let socket = this.socketsByName[owner.name];
        if (!socket) {
            logger.error("Tried to rematch but the owner's socket has gone away");
            return;
        }

        this.games[newGame.id] = newGame;
        newGame.newGame(socket.id, socket.user);

        socket.joinChannel(newGame.id);
        this.sendGameState(newGame);
        this.broadcastGameMessage('newgame', newGame);

        let promises = [
            this.onSelectDeck(socket, newGame.id, true, owner.deck._id, !!owner.deck.precon_id)
        ];

        for (let player of Object.values(game.getPlayers()).filter(
            (player) => player.name !== owner.username
        )) {
            let socket = this.socketsByName[player.name];

            if (!socket) {
                logger.warn(
                    `Tried to add ${player.name} to a rematch but couldn't find their socket`
                );
                continue;
            }

            newGame.join(socket.id, player.user);
            promises.push(
                this.onSelectDeck(socket, newGame.id, true, player.deck._id, !!player.deck.precon_id)
            );
        }

        for (let player of Object.values(game.getPlayers())) {
            let oldPlayer = oldGame.players.find((x) => x.name === player.name);

            if (oldPlayer && oldPlayer.wins) {
                if (!newGame.players[player.name]) {
                    logger.warn(
                        `Tried to set ${player.name} wins but couldn't find them in the game`
                    );
                    continue;
                }

                newGame.players[player.name].wins = oldPlayer.wins;
            }
        }

        for (let spectator of game.getSpectators()) {
            let socket = this.socketsByName[spectator.name];

            if (!socket) {
                logger.warn(
                    `Tried to add ${spectator.name} to spectate a rematch but couldn't find their socket`
                );
                continue;
            }

            newGame.watch(socket.id, spectator.user);
        }

        // Set the password after everyone has joined, so we don't need to worry about overriding the password, or storing it unencrypted/hashed
        newGame.password = game.password;

        Promise.all(promises).then(() => {
            this.onStartGame(socket, newGame.id);
        });
    }

    onPlayerLeft(gameId, player) {
        let game = this.games[gameId];

        if (!game) {
            return;
        }

        game.leave(player);

        if (game.isEmpty()) {
            this.broadcastGameMessage('removegame', game);
            delete this.games[gameId];
        } else {
            this.broadcastGameMessage('updategame', game);
        }
    }

    onBlocklistChanged(user) {
        let updatedUser = this.users[user.username];

        if (!updatedUser) {
            return;
        }

        updatedUser.blockList = user.blockList;
    }

    onWorkerTimedOut(nodeName) {
        this.clearGamesForNode(nodeName);
    }

    onWorkerStarted() { }

    onClearSessions(socket, username) {
        this.userService.clearUserSessions(username).then((success) => {
            if (!success) {
                logger.error(`Failed to clear sessions for user ${username}`);
                return;
            }

            let game = this.findGameForUser(username);

            if (game) {
                logger.info(
                    `closed game ${game.id} (${game.name}) forcefully due to clear session on ${username}`
                );

                if (!game.started) {
                    delete this.games[game.id];
                } else {
                    this.router.closeGame(game);
                }
            }

            let socket = Object.values(this.sockets).find((socket) => {
                return socket.user && socket.user.username === username;
            });

            if (socket) {
                socket.disconnect();
            }
        });
    }

    onNodeReconnected(nodeName, games) {
        for (let game of Object.values(games)) {
            let owner = game.players[game.owner];

            if (!owner) {
                logger.error("Got a game where the owner %s wasn't a player", game.owner);
                continue;
            }

            let syncGame = new PendingGame(new User(owner.user), {
                allowSpectators: game.allowSpectators,
                name: game.name
            });
            syncGame.createdAt = game.startedAt;
            syncGame.gameFormat = game.gameFormat;
            syncGame.gamePrivate = game.gamePrivate;
            syncGame.gameType = game.gameType;
            // syncGame.trackElo = game.trackElo;
            syncGame.id = game.id;
            syncGame.label = game.label;
            syncGame.node = this.router.workers[nodeName];
            syncGame.password = game.password;
            syncGame.started = game.started;

            syncGame.solo = game.solo;

            for (let player of Object.values(game.players)) {
                syncGame.players[player.name] = {
                    id: player.id,
                    name: player.name,
                    owner: game.owner === player.name,
                    user: new User(player.user)
                };
            }

            for (let player of Object.values(game.spectators)) {
                syncGame.spectators[player.name] = {
                    id: player.id,
                    name: player.name,
                    user: new User(player.user)
                };
            }

            this.games[syncGame.id] = syncGame;
        }

        for (let game of Object.values(this.games)) {
            if (
                game.node &&
                game.node.identity === nodeName &&
                Object.values(games).find((nodeGame) => {
                    return nodeGame.id === game.id;
                })
            ) {
                this.games[game.id] = game;
            } else if (game.node && game.node.identity === nodeName) {
                delete this.games[game.id];
            }
        }

        this.broadcastGameList();
    }
}

module.exports = Lobby;
