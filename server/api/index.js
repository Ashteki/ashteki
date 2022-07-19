const account = require('./account');
const decks = require('./decks');
const games = require('./games');
const stats = require('./stats');
const cards = require('./cards');
const user = require('./user');

const banlist = require('./banlist');

module.exports.init = function (server, options) {
    account.init(server, options);
    decks.init(server);
    games.init(server);
    stats.init(server);
    cards.init(server);
    user.init(server);
    banlist.init(server);
};
