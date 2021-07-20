const escapeRegex = require('../util.js').escapeRegex;
const logger = require('../log.js');
const monk = require('monk');
const crypto = require('crypto');
const EventEmitter = require('events');
const uuid = require('uuid');
const User = require('../models/User.js');

class UserService extends EventEmitter {
    constructor(configService) {
        super();
        this.configService = configService;
        const mongoUrl = process.env.MONGO_URL || configService.getValue('mongo');
        let db = monk(mongoUrl);

        this.users = db.get('users');
        this.refreshTokens = db.get('refresh_tokens');
        this.roles = db.get('roles');
        this.blocklist = db.get('block_list');
    }

    async getAllUsers() {
        return this.users.find().catch((err) => {
            logger.error('Error fetching all users', err);
            throw new Error('Error occured fetching all users');
        });
    }
    async getUserByUsername(username) {
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

    async getFullUserByUsername(username) {
        let user = await this.getUserByUsername(username);
        if (!user) {
            user = await this.getUserByEmail(username);
        }
        if (user) {
            user.tokens = await this.getRefreshTokens(user._id.toString());
            user.blocklist = await this.getBlocklist(user._id.toString());
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
        return await this.blocklist
            .find({ userId: userId })
            .then((entries) => {
                if (entries) {
                    return entries;
                } else {
                    return [];
                }
            })
            .catch((err) => {
                logger.error('Failed to lookup blocklist for user', err);
            });
    }

    async getPermissions(userId) {
        return await this.roles
            .find({ userId: userId })
            .then((permissions) => {
                if (permissions) {
                    return this.mapPermissions(permissions);
                } else {
                    return {};
                }
            })
            .catch((err) => {
                logger.error('Failed to lookup permissions for user', err);
                return {};
            });
    }

    async getUserById(id) {
        let user = await this.users.findOne({ _id: id });
        user.tokens = await this.getRefreshTokens(id);
        user.blocklist = await this.getBlocklist(id);
        // user.permissions = await this.getPermissions(user);

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
            patreon: user.patreon,
            faveColor: user.faveColor
        };

        if (user.password && user.password !== '') {
            toSet.password = user.password;
        }

        return this.users.update({ username: user.username }, { $set: toSet }).catch((err) => {
            logger.error('Error setting user details', err);

            throw new Error('Error setting user details');
        });
    }

    async addBlocklistEntry(user, entry) {
        try {
            this.blocklist.insert({ userId: user.id, entry: entry });
        } catch (err) {
            logger.warn('Failed to add blocklist entry', err);

            throw new Error('Error adding blocklist entry');
        }
    }

    async deleteBlocklistEntry(user, entry) {
        try {
            this.blocklist.remove({ userId: user.id, entry: entry });
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

    async setSupporterStatus(userId, isSupporter) {
        const supporterRoleName = 'Supporter';
        let supporterRoles = this.roles.find({ userId: userId, Name: supporterRoleName });
        let isExistingSupporter = supporterRoles && supporterRoles.length > 0;

        if (isExistingSupporter && !isSupporter) {
            try {
                this.roles.remove({ userId: userId, Name: supporterRoleName });
            } catch (err) {
                logger.error('Failed to remove supporter status', err);

                throw new Error('Failed to remove supporter status');
            }
        } else if (!isExistingSupporter && isSupporter) {
            try {
                this.roles.insert({ userId: userId, Name: supporterRoleName });
            } catch (err) {
                logger.error('Failed to add supporter status', err);

                throw new Error('Failed to add supporter status');
            }
        }
    }

    permissionToRole(permission) {
        switch (permission) {
            case 'canManageUsers':
                return 1; //'UserManager';
            case 'canManageBanlist':
                return 2; // 'BanListManager';
            case 'canEditNews':
                return 3; //'NewsManager';
            case 'canManageGames':
                return 4; // 'GameManager';
            case 'canManageMotd':
                return 5; // 'MotdManager';
            case 'canManagePermissions':
                return 6; // 'PermissionsManager';
            case 'canManageNodes':
                return 7; // 'NodeManager';
            case 'canModerateChat':
                return 8; // 'ChatManager';
            case 'canVerifyDecks':
                return 9; // 'DeckVerifier';
            case 'isAdmin':
                return 10; // 'Admin';
            case 'isSupporter':
                return 11; // 'Supporter';
            case 'isContributor':
                return 12; // 'Contributor';
            case 'canManageTournaments':
                return 13; // 'TournamentManager'
            case 'isWinner':
                return 14; // 'TournamentWinner'
            case 'isPreviousWinner':
                return 15; // 'TournamentPreviousWinner'
            case 'keepsSupporterWithNoPatreon':
                return 16; // 'KeepSupporterStatus'
        }
    }

    mapPermissions(permissions) {
        let ret = {
            canEditNews: false,
            canManageUsers: false,
            canManagePermissions: false,
            canManageGames: false,
            canManageNodes: false,
            canModerateChat: false,
            canVerifyDecks: false,
            canManageBanlist: false,
            canManageMotd: false,
            canManageTournaments: false,
            isAdmin: false,
            isContributor: false,
            isSupporter: false,
            isWinner: false,
            isPreviousWinner: false,
            keepsSupporterWithNoPatreon: false
        };

        for (let permission of permissions) {
            switch (permission.Name) {
                case 'NewsManager':
                    ret.canEditNews = true;
                    break;
                case 'UserManager':
                    ret.canManageUsers = true;
                    break;
                case 'PermissionsManager':
                    ret.canManagePermissions = true;
                    break;
                case 'GameManager':
                    ret.canManageGames = true;
                    break;
                case 'NodeManager':
                    ret.canManageNodes = true;
                    break;
                case 'ChatManager':
                    ret.canModerateChat = true;
                    break;
                case 'DeckVerifier':
                    ret.canVerifyDecks = true;
                    break;
                case 'BanListManager':
                    ret.canManageBanlist = true;
                    break;
                case 'MotdManager':
                    ret.canManageMotd = true;
                    break;
                case 'Admin':
                    ret.isAdmin = true;
                    break;
                case 'Supporter':
                    ret.isSupporter = true;
                    break;
                case 'Contributor':
                    ret.isContributor = true;
                    break;
                case 'TournamentManager':
                    ret.canManageTournaments = true;
                    break;
                case 'TournamentWinner':
                    ret.isWinner = true;
                    break;
                case 'PreviousTournamentWinner':
                    ret.isPreviousWinner = true;
                    break;
                case 'KeepSupporterStatus':
                    ret.keepsSupporterWithNoPatreon = true;
                    break;
            }
        }

        return ret;
    }
}

module.exports = UserService;
