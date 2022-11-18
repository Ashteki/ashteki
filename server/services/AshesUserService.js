const escapeRegex = require('../util.js').escapeRegex;
const logger = require('../log.js');
const monk = require('monk');
const crypto = require('crypto');
const EventEmitter = require('events');
const uuid = require('uuid');
const User = require('../models/User.js');
const { GameType } = require('../constants');
const { EloCalculator } = require('../EloCalculator.js');

class UserService extends EventEmitter {
    constructor(configService) {
        super();
        this.configService = configService;
        const mongoUrl = process.env.MONGO_URL || configService.getValue('mongo');
        let db = monk(mongoUrl);

        this.users = db.get('users');
        this.refreshTokens = db.get('refresh_tokens');
        this.roles = db.get('roles');
        this.blockList = db.get('block_list');
    }

    async getAllUsers() {
        return this.users.find().catch((err) => {
            logger.error('Error fetching all users', err);
            throw new Error('Error occured fetching all users');
        });
    }
    async getUserByUsername(username) {
        logger.debug('getting user %s', username);
        return this.users
            .find({
                username: {
                    $regex: new RegExp('^' + escapeRegex(username.toLowerCase()) + '$', 'i')
                }
            })
            .then((users) => {
                return users[0];
            })
            .catch((err) => {
                logger.error('Error fetching users', err);

                throw new Error('Error occured fetching users');
            });
    }

    // fetch user by username / email address
    async getFullUserByUsername(username) {
        let user = await this.getUserByUsername(username);
        if (!user) {
            user = await this.getUserByEmail(username);
        }

        if (user) {
            user.tokens = await this.getRefreshTokens(user._id.toString());
            user.blockList = await this.getBlocklist(user._id.toString());
            return new User(user);
        } else return;
    }

    async doesUserExist(username) {
        const usr = await this.getUserByUsername(username);
        return !!usr;
    }

    async getUserByEmail(email) {
        return this.users
            .find({
                email: { $regex: new RegExp('^' + escapeRegex(email.toLowerCase()) + '$', 'i') }
            })
            .then((users) => {
                return users[0];
            })
            .catch((err) => {
                logger.error('Error fetching users', err);

                throw new Error('Error occured fetching users');
            });
    }

    async doesEmailExist(email) {
        const usr = await this.getUserByEmail(email);
        return !!usr;
    }

    async getRefreshTokens(userId) {
        return await this.refreshTokens
            .find({ userId: userId })
            .then((tokens) => {
                if (tokens) {
                    return tokens;
                } else {
                    return [];
                }
            })
            .catch((err) => {
                logger.error('Failed to lookup tokens for user', err);
            });
    }

    async getBlocklist(userId) {
        return await this.blockList
            .find({ userId: userId })
            .then((entries) => {
                if (entries) {
                    return entries.map((e) => e.entry);
                } else {
                    return [];
                }
            })
            .catch((err) => {
                logger.error('Failed to lookup blocklist for user', err);
            });
    }

    async getUserById(id) {
        let user = await this.users.findOne({ _id: id });
        user.tokens = await this.getRefreshTokens(id);
        user.blockList = await this.getBlocklist(id);

        return new User(user);
    }

    async addUser(user) {
        return this.users
            .insert(user)
            .then(() => {
                return user;
            })
            .catch((err) => {
                logger.error('Error adding user', err, user);

                throw new Error('Error occured adding user');
            });
    }

    async update(user) {
        var toSet = {
            email: user.email,
            settings: user.settings,
            promptedActionWindows: user.promptedActionWindows,
            permissions: user.permissions,
            patreon: user.patreon
        };

        if (user.password && user.password !== '') {
            toSet.password = user.password;
        }
        if (user.faveColor) {
            toSet.faveColor = user.faveColor;
        }

        return this.users.update({ username: user.username }, { $set: toSet }).catch((err) => {
            logger.error('Error setting user details', err);

            throw new Error('Error setting user details');
        });
    }

    async recordEloResult(players, winner) {
        if (players.length < 2) {
            return;
        }

        for (const player of players) {
            player.user = await this.getUserByUsername(player.name);
            if (!player.user) {
                logger.error('cannot find user: ', player.name);
                return;
            }
            logger.info(`player elo: ${player.name}, old: ${player.user.eloRating}`);
        }

        const eloCalculator = new EloCalculator();
        eloCalculator.calculateExpectedResults(players);
        eloCalculator.calculateNewResults(players, winner);

        // save user elo
        for (const player of players) {
            logger.info(`player elo: ${player.name}, new: ${player.user.eloRating}`);

            await this.updateUserElo(player.user);
        }
    }

    async updateUserElo(user) {
        var toSet = {
            eloRating: user.eloRating
        };
        try {
            this.users.update({ username: user.username }, { $set: toSet });
        } catch (error) {
            logger.error('Error updating user Elo', error);
            throw new Error('Error updating user Elo');
        }
    }

    async addBlocklistEntry(user, entry) {
        try {
            this.blockList.insert({ userId: user.id, entry: entry });
        } catch (err) {
            logger.warn('Failed to add blocklist entry', err);

            throw new Error('Error adding blocklist entry');
        }
    }

    async deleteBlocklistEntry(user, entry) {
        try {
            this.blockList.remove({ userId: user.id, entry: entry });
        } catch (err) {
            logger.warn('Failed to remove blocklist entry', err);

            throw new Error('Error removing blocklist entry');
        }
    }

    // not called except to setup event
    async updateBlockList(user) {
        this.users
            .update(
                { username: user.username },
                {
                    $set: {
                        blockList: user.blockList
                    }
                }
            )
            .catch((err) => {
                logger.error('Error setting user details', err);

                throw new Error('Error setting user details');
            });

        this.emit('onBlocklistChanged', user);
    }

    async setResetToken(user, token, tokenExpiration) {
        logger.info('entering: setResetToken');

        return this.users
            .update(
                { username: user.username },
                { $set: { resetToken: token, tokenExpires: tokenExpiration } }
            )
            .catch((err) => {
                logger.error('Error setting reset token: ', err);

                throw new Error('Error setting reset token');
            });
    }

    async setPassword(user, password) {
        logger.info('entering: setPassword');

        return this.users
            .update({ username: user.username }, { $set: { password: password } })
            .catch((err) => {
                logger.error('Error setting password: ', err);

                throw new Error('Error setting password');
            });
    }

    async clearResetToken(user) {
        logger.info('entering: clearResetToken');
        return this.users
            .update(
                { username: user.username },
                { $set: { resetToken: undefined, tokenExpires: undefined } }
            )
            .catch((err) => {
                logger.error('Error clearing reset token:', err);

                throw new Error('Error clearing reset token');
            });
    }

    async clearUserSessions(username) {
        logger.info('entering: clearUserSessions');
        let user = await this.getFullUserByUsername(username);

        if (!user) {
            throw 'User not found';
        }

        try {
            this.refreshTokens.remove({ userId: user.id });
        } catch (err) {
            logger.error('Failed to clear user sessions', err);
        }
    }

    async addRefreshToken(user, token, ip) {
        logger.info('entering: addRefreshToken');

        let hmac = crypto.createHmac(
            'sha512',
            this.configService.getValueForSection('lobby', 'hmacSecret')
        );

        let tokenId = uuid.v1();

        let encodedToken = hmac.update(`REFRESH ${user.username} ${tokenId}`).digest('hex');

        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        let toAdd = {
            userId: user.id,
            token: encodedToken,
            tokenId: tokenId,
            expiry: expiryDate,
            ip: ip,
            lastUsed: new Date()
        };

        return this.refreshTokens.insert(toAdd);
    }

    verifyRefreshToken(username, refreshToken) {
        let hmac = crypto.createHmac(
            'sha512',
            this.configService.getValueForSection('lobby', 'hmacSecret')
        );
        let encodedToken = hmac.update(`REFRESH ${username} ${refreshToken.tokenId}`).digest('hex');

        if (encodedToken !== refreshToken.token) {
            return false;
        }

        if (refreshToken.expiry < Date.now()) {
            return false;
        }

        return true;
    }

    async updateRefreshTokenUsage(tokenId, ip) {
        const toSet = {
            ip: ip,
            lastUsed: new Date()
        };
        this.refreshTokens.update({ tokenId: tokenId }, { $set: toSet }).catch((err) => {
            logger.error('Error saving token usage: ', err);
            throw new Error('Error saving token usage');
        });
    }

    async removeRefreshToken(userId, tokenId) {
        try {
            this.refreshTokens.remove({ tokenId: tokenId, userId: userId });
        } catch (err) {
            logger.error('Failed to remove refresh token');
        }
    }

    async cleanupRefreshTokens() {
        this.refreshTokens.remove({ expiry: { $lte: new Date() } });
    }

    async setSupporterStatus(user, isSupporter) {
        logger.info(
            'entering: setSupporterStatus username:%s isSupporter:%s',
            user.username,
            isSupporter
        );

        return this.users
            .update(
                { username: user.username },
                { $set: { 'permissions.isSupporter': isSupporter } }
            )
            .catch((err) => {
                logger.error('Error setting patreon supporter status: ', err);

                throw new Error('Error setting patreon supporter status');
            });
    }

    async incrementGameCount(username) {
        return this.users
            .update({ username: username }, { $inc: { gamesPlayed: 1 } })
            .catch((err) => {
                logger.error('Error incrementing game count: ', err);

                throw new Error('Error incrementing game count');
            });

    }
}

module.exports = UserService;
