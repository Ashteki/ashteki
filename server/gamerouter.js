const redis = require('redis');
const EventEmitter = require('events');
const logger = require('./log');
const GameService = require('./services/AshesGameService');
const { detectBinary } = require('./util');
const UserService = require('./services/AshesUserService');
const { GameType } = require('./constants');
const ReplayService = require('./services/AshesReplayService');

class GameRouter extends EventEmitter {
    /**
     * @param {import("./services/ConfigService.js")} configService
     */
    constructor(configService) {
        super();

        this.workers = {};
        this.gameService = new GameService(configService);
        this.userService = new UserService(configService);
        this.replayService = new ReplayService(configService);

        const redisUrl = process.env.REDIS_URL || configService.getValue('redisUrl');
        this.subscriber = redis.createClient(redisUrl);
        this.publisher = redis.createClient(redisUrl);

        this.subscriber.on('error', this.onError);
        this.publisher.on('error', this.onError);

        this.subscriber.subscribe('nodemessage');
        this.subscriber.on('message', this.onMessage.bind(this));
        this.subscriber.on('subscribe', () => {
            this.sendCommand('allnodes', 'LOBBYHELLO');
        });

        setInterval(this.checkTimeouts.bind(this), 1000 * 60);
    }

    // External methods
    /**
     * @param {import("./pendinggame.js")} game
     */
    startGame(game) {
        let node = this.getNextAvailableGameNode();
        if (!node) {
            logger.error('Could not find new node for game');

            return undefined;
        }

        this.gameService.create(game.getSaveState());

        node.numGames++;

        this.sendCommand(node.identity, 'STARTGAME', game.getStartGameDetails());

        return node;
    }

    /**
     * @param {import("./pendinggame.js")} game
     * @param {import("./models/User")} user
     */
    addSpectator(game, user) {
        this.sendCommand(game.node.identity, 'SPECTATOR', {
            game: game.getSaveState(),
            user: user
        });
    }

    getNextAvailableGameNode() {
        if (Object.values(this.workers).length === 0) {
            return undefined;
        }

        let returnedWorker;
        for (const worker of Object.values(this.workers)) {
            if (worker.disabled || worker.disconnected || worker.numGames >= worker.maxGames) {
                continue;
            }

            if (!returnedWorker || returnedWorker.numGames > worker.numGames) {
                returnedWorker = worker;
            }
        }

        return returnedWorker;
    }

    getNodeStatus() {
        return Object.values(this.workers).map((worker) => {
            return {
                name: worker.identity,
                numGames: worker.numGames,
                status: worker.disconnceted
                    ? 'disconnected'
                    : worker.disabled
                        ? 'disabled'
                        : 'active',
                version: worker.version
            };
        });
    }

    /**
     * @param {string} nodeName
     */
    disableNode(nodeName) {
        let worker = this.workers[nodeName];
        if (!worker) {
            return false;
        }

        worker.disabled = true;

        return true;
    }

    /**
     * @param {string} nodeName
     */
    enableNode(nodeName) {
        let worker = this.workers[nodeName];
        if (!worker) {
            return false;
        }

        worker.disabled = false;

        return true;
    }

    /**
     * @param {string} nodeName
     */
    toggleNode(nodeName) {
        let worker = this.workers[nodeName];
        if (!worker) {
            return false;
        }

        worker.disabled = !worker.disabled;

        return true;
    }

    /**
     * @param {string} nodeName
     */
    restartNode(nodeName) {
        let worker = this.workers[nodeName];
        if (!worker) {
            return false;
        }

        this.sendCommand(nodeName, 'RESTART');

        return true;
    }

    /**
     * @param {import("./pendinggame.js")} game
     * @param {string} username
     */
    notifyFailedConnect(game, username) {
        if (!game.node) {
            return;
        }

        this.sendCommand(game.node.identity, 'CONNECTFAILED', {
            gameId: game.id,
            username: username
        });
    }

    /**
     * @param {import("./pendinggame.js")} game
     */
    closeGame(game) {
        if (!game.node) {
            return;
        }

        this.sendCommand(game.node.identity, 'CLOSEGAME', { gameId: game.id });
    }

    // Events
    /**
     * @param {Error} err
     */
    onError(err) {
        logger.error('Redis error: ', err);
    }

    /**
     * @param {string} channel
     * @param {string} msg
     */
    onMessage(channel, msg) {
        if (channel !== 'nodemessage') {
            logger.warn(`Message '${msg}' received for unknown channel ${channel}`);
            return;
        }

        let message;
        try {
            message = JSON.parse(msg);
        } catch (err) {
            logger.info(
                `Error decoding redis message. Channel ${channel}, message '${msg}' %o`,
                err
            );
            return;
        }

        const identity = message.identity;
        let worker = this.workers[identity];

        if (worker && worker.disconnected) {
            logger.info(`Worker ${identity} came back`);
            worker.disconnected = false;
        }

        switch (message.command) {
            case 'HELLO':
                this.emit('onWorkerStarted', identity);
                if (this.workers[identity]) {
                    logger.info(`Worker ${identity} was already known, presume reconnected`);
                    this.workers[identity].disconnected = false;
                }

                this.workers[identity] = {
                    identity: identity,
                    numGames: 0,
                    ...message.arg
                };
                worker = this.workers[identity];

                this.emit('onNodeReconnected', identity, message.arg.games);

                worker.numGames = message.arg.games.length;

                break;
            case 'PONG':
                if (worker) {
                    worker.pingSent = undefined;
                } else {
                    logger.error('PONG received for unknown worker');
                }

                break;
            case 'GAMEWIN':
                this.handleGameWin(message.arg.game);

                break;
            case 'REPLAY_STATE':
                this.handleReplayState(message.arg.username, message.arg.game, message.arg.tag);
                break;
            case 'REMATCH':
                this.gameService.update(message.arg.game);

                if (worker) {
                    worker.numGames--;
                } else {
                    logger.error(`Got rematch game for non existant worker ${identity}`);
                }

                this.emit('onGameRematch', message.arg.game);

                break;
            case 'GAMECLOSED':
                if (worker) {
                    worker.numGames--;
                } else {
                    logger.error(`Got close game for non existant worker ${identity}`);
                }

                this.emit('onGameClosed', message.arg.game);

                break;
            case 'PLAYERLEFT':
                if (!message.arg.spectator) {
                    this.gameService.update(message.arg.game);
                }

                this.emit('onPlayerLeft', message.arg.gameId, message.arg.player);

                break;
        }

        if (worker) {
            worker.lastMessage = new Date();
        }
    }

    handleGameWin(game) {
        // final save for game state
        this.gameService.update(game);

        // do elo update
        try {
            this.doRankedUpdate(game);
        } catch (error) {
            logger.error('unable to update elo ratings:', game.gameId);
        }

        const ranked = game.gameType === GameType.Competitive;
        // increment player game counts
        game.players.forEach((player) => {
            Promise.resolve(this.userService.incrementGameCount(player.name, ranked));
        });

        this.emit('onGameFinished', game.gameId);
    }

    handleReplayState(username, state, tag) {
        this.replayService.save(username, state, tag);
    }

    async doRankedUpdate(game) {
        // update player / user elo stats
        if (game.gameType === GameType.Competitive) {
            const gameDate = new Date(game.finishedAt);
            await this.userService.recordRankedResult(game.players, game.winner, gameDate);
        }
    }

    getNamedProperty(object, key) {
        return object[key];
    }
    getOtherProperty(object, key) {
        return Object.entries(object).find(([k, v]) => k !== key)[1];
    }

    // Internal methods
    /**
     * @param {string} channel
     * @param {string} command
     */
    sendCommand(channel, command, arg = {}) {
        let object = {
            command: command,
            arg: arg
        };

        let objectStr = '';
        try {
            objectStr = JSON.stringify(object);
        } catch (err) {
            logger.error('Failed to stringify node data', err);
            for (let obj of Object.values(detectBinary(arg))) {
                logger.error(`Path: ${obj.path}, Type: ${obj.type}`);
            }

            return;
        }

        try {
            this.publisher.publish(channel, objectStr);
        } catch (err) {
            logger.error(err);
        }
    }

    checkTimeouts() {
        const currentTime = Date.now();
        const pingTimeout = 1 * 60 * 1000;

        for (const worker of Object.values(this.workers)) {
            if (worker.disconnected) {
                continue;
            }

            if (worker.pingSent && currentTime - worker.pingSent > pingTimeout) {
                logger.info(`worker ${worker.identity} timed out`);
                worker.disconnected = true;
                this.emit('onWorkerTimedOut', worker.identity);
            } else if (!worker.pingSent) {
                if (currentTime - worker.lastMessage > pingTimeout) {
                    worker.pingSent = currentTime;
                    this.sendCommand(worker.identity, 'PING');
                }
            }
        }
    }
}

module.exports = GameRouter;
