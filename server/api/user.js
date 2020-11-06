const passport = require('passport');

const UserService = require('../services/AshesUserService.js');
const ConfigService = require('../services/ConfigService.js');
const { wrapAsync } = require('../util.js');
const logger = require('../log.js');

let configService = new ConfigService();

let userService = new UserService(configService);

module.exports.init = function (server) {
    server.get(
        '/api/user/:username',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.user.permissions || !req.user.permissions.canManageUsers) {
                return res.status(403);
            }

            let user;
            let linkedAccounts;
            let retUser;
            try {
                user = await userService.getFullUserByUsername(req.params.username);

                if (!user) {
                    return res.status(404).send({ message: 'Not found' });
                }

                retUser = user.getFullDetails();

                // linkedAccounts = await userService.getPossiblyLinkedAccounts(user);
            } catch (error) {
                logger.error(error);

                return res.send({
                    success: false,
                    message: 'An error occurred searching the user.  Please try again later.'
                });
            }

            res.send({
                success: true,
                user: retUser,
                linkedAccounts:
                    linkedAccounts &&
                    linkedAccounts
                        .map((account) => account.username)
                        .filter((name) => name !== user.username)
            });
        })
    );

    server.put(
        '/api/user/:username',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.user.permissions || !req.user.permissions.canManageUsers) {
                return res.status(403);
            }

            if (!req.body.userToChange) {
                return res.send({ success: false, message: 'You must specify the user data' });
            }

            let userToSet = req.body.userToChange;

            userService
                .getUserByUsername(req.params.username)
                .then((user) => {
                    if (!user) {
                        return res.status(404).send({ message: 'Not found' });
                    }

                    user.permissions = userToSet.permissions;

                    return userService.update(user);
                })
                .then(() => {
                    res.send({ success: true });
                })
                .catch(() => {
                    return res.send({
                        success: false,
                        message: 'An error occured saving the user'
                    });
                });
        })
    );

    server.post(
        '/api/user/:username/verifyDecks',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.user.permissions || !req.user.permissions.canVerifyDecks) {
                return res.status(403);
            }

            let user;
            try {
                user = await userService.getFullUserByUsername(req.params.username);

                if (!user) {
                    return res.status(404).send({ message: 'Not found' });
                }

                // await deckService.verifyDecksForUser(user.id);
            } catch (error) {
                logger.error(error);

                return res.send({
                    success: false,
                    message: 'An error occurred verifying decks.  Please try again later.'
                });
            }

            res.send({ success: true });
        })
    );
};
