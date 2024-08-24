const _ = require('underscore');
const monk = require('monk');

const logger = require('../log.js');

class ReplayService {
    constructor(configService) {
        const mongoUrl = process.env.MONGO_URL || configService.getValue('mongo');
        let db = monk(mongoUrl);
        this.replays = db.get('replays');
    }

    save(username, state, tag) {
        return this.replays
            .insert({
                gameId: state.id,
                timeStamp: new Date(),
                username: username,
                state: state,
                tag: tag
            })
            .catch((err) => {
                logger.error('Unable to save replay state', err);
                throw new Error('Unable to save replay state');
            });
    }

    getReplayForGame(gameId) {
        const findSpec = {
            gameId: gameId
        };

        return this.replays.find(findSpec).catch((err) => {
            logger.error('Unable to get replay', err);
            throw new Error('Unable to get replay');
        });
    }
}

module.exports = ReplayService;
