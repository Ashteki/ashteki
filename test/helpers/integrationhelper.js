const _ = require('underscore');

require('./objectformatters.js');

const DeckBuilder = require('./deckbuilder.js');
const GameFlowWrapper = require('./gameflowwrapper.js');

const deckBuilder = new DeckBuilder();

const ProxiedGameFlowWrapperMethods = [
    'startGame',
    'selectFirstPlayer',
    'getChatLogs',
    'getChatLog'
];

var customMatchers = {
    toHavePrompt: function () {
        return {
            compare: function (actual, expected) {
                var result = {};
                var currentPrompt = actual.currentPrompt();
                result.pass = actual.hasPrompt(expected);

                if (result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt "${expected}" but it did.`;
                } else {
                    result.message = `Expected ${actual.name} to have prompt "${expected}" but it had menuTitle "${currentPrompt.menuTitle}" and promptTitle "${currentPrompt.promptTitle}".`;
                }

                return result;
            }
        };
    },

    toHavePromptTitle: function () {
        return {
            compare: function (actual, expected) {
                var result = {};
                var currentPrompt = actual.currentPrompt();
                result.pass = actual.hasPromptTitle(expected);

                if (result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt "${expected}" but it did.`;
                } else {
                    result.message = `Expected ${actual.name} to have prompt "${expected}" but it had menuTitle "${currentPrompt.menuTitle}" and promptTitle "${currentPrompt.promptTitle}".`;
                }

                return result;
            }
        };
    },

    toHaveDefaultPrompt: function () {
        return {
            compare: function (actual) {
                var result = {};
                var currentPrompt = actual.currentPrompt();
                result.pass = actual.hasDefaultPrompt();

                if (result.pass) {
                    result.message = `Expected ${actual.name} not to have the default prompt but it did.`;
                } else {
                    result.message = `Expected ${actual.name} to have  the default prompt but it had menuTitle "${currentPrompt.menuTitle}" and promptTitle "${currentPrompt.promptTitle}".`;
                }

                return result;
            }
        };
    },

    toHavePromptButton: function (util) {
        return {
            compare: function (actual, expected) {
                var buttons = actual.currentPrompt().buttons;
                var result = {};

                result.pass = _.any(buttons, (button) =>
                    util.equals(button.text, expected)
                );

                if (result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt button "${expected}" but it did.`;
                } else {
                    var buttonText = _.map(buttons, (button) => '[' + button.text + ']').join('\n');
                    result.message = `Expected ${actual.name} to have prompt button "${expected}" but it had buttons:\n${buttonText}`;
                }

                return result;
            }
        };
    },
    toHavePromptCardButton: function (util) {
        return {
            compare: function (actual, card) {
                var buttons = actual.currentPrompt().buttons;
                var result = {};

                if (_.isString(card)) {
                    card = actual.findCardByName(card);
                }

                result.pass = _.any(buttons, (button) =>
                    util.equals(button.card ? button.card.id : '', card.id)
                );

                if (result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt button "${card.name}" but it did.`;
                } else {
                    var buttonText = _.map(
                        buttons,
                        (button) => '[' + (button.card ? button.card.name : '') + ']'
                    ).join('\n');
                    result.message = `Expected ${actual.name} to have prompt button "${card.name}" but it had buttons:\n${buttonText}`;
                }

                return result;
            }
        };
    },
    toBeAbleToSelect: function () {
        return {
            compare: function (player, card) {
                if (_.isString(card)) {
                    card = player.findCardByName(card);
                }

                let result = {};

                result.pass = player.currentActionTargets.includes(card);

                if (result.pass) {
                    result.message = `Expected ${card.name} not to be selectable by ${player.name} but it was.`;
                } else {
                    result.message = `Expected ${card.name} to be selectable by ${player.name} but it wasn't.`;
                }

                return result;
            }
        };
    },
    toBeAbleToSelectDie: function () {
        return {
            compare: function (player, die) {
                let result = {};

                result.pass = player.currentActionDiceTargets.includes(die);

                if (result.pass) {
                    result.message = `Expected ${die.level} ${die.magic} die not to be selectable by ${player.name} but it was.`;
                } else {
                    result.message = `Expected ${die.level} ${die.magic} die to be selectable by ${player.name} but it wasn't.`;
                }

                return result;
            }
        };
    },
    toBeAbleToPlayFromHand: function () {
        return {
            compare: function (player, card) {
                if (_.isString(card)) {
                    card = player.findCardByName(card, 'hand');
                }

                let result = {};

                result.pass = card.getLegalActions(player.player, false).length > 0;

                if (result.pass) {
                    result.message = `Expected ${card.name} not to be playable by ${player.name} but it was.`;
                } else {
                    result.message = `Expected ${card.name} to be playable by ${player.name} but it wasn't.`;
                }

                return result;
            }
        };
    },
    toBeAbleToPlay: function () {
        return {
            compare: function (player, card) {
                if (_.isString(card)) {
                    card = player.findCardByName(card);
                }

                let result = {};

                result.pass = card.getLegalActions(player.player, false).length > 0;

                if (result.pass) {
                    result.message = `Expected ${card.name} not to be playable by ${player.name} but it was.`;
                } else {
                    result.message = `Expected ${card.name} to be playable by ${player.name} but it wasn't.`;
                }

                return result;
            }
        };
    },
    toHaveRecentChatMessage: function () {
        return {
            compare: function (game, msg, numBack = 1) {
                let result = {};
                let logs = game.getChatLogs(numBack);

                result.pass = logs.filter((lastMsg) => lastMsg.includes(msg)).length > 0;

                if (result.pass) {
                    result.message = `Expected ${msg} not to be in ${logs} but it was.`;
                } else {
                    result.message = `Expected '${msg}' to be in [${logs}] but it wasn't.`;
                }

                return result;
            }
        };
    }
};

beforeEach(function () {
    jasmine.addMatchers(customMatchers);

    let cards = {};

    for (let card of deckBuilder.cards) {
        cards[card.id] = card;
    }

    this.deckBuilder = deckBuilder;

    /**
     * Factory method. Creates a new simulation of a game.
     * @param {Object} [options = {}] - specifies the state of the game
     */
    this.setupTest = function (options = {}) {
        this.flow = new GameFlowWrapper(cards, options);

        this.game = this.flow.game;
        this.player1Object = this.game.getPlayerByName('player1');
        this.player2Object = this.game.getPlayerByName('player2');
        this.player1 = this.flow.player1;
        this.player2 = this.flow.player2;

        _.each(ProxiedGameFlowWrapperMethods, (method) => {
            this[method] = (...args) => this.flow[method].apply(this.flow, args);
        });

        this.buildDeck = function (cards) {
            return deckBuilder.buildDeck(cards);
        };
        //Set defaults
        if (!options.player1) {
            options.player1 = {};
        }

        if (!options.player2) {
            options.player2 = {};
        }

        //Build decks
        this.player1.selectDeck(deckBuilder.customDeck(options.player1));
        this.player2.selectDeck(deckBuilder.customDeck(options.player2));
        this.player1.player.optionSettings.bluffTimer = 0;
        this.player1.player.optionSettings.alertTimer = 0;
        this.player1.player.optionSettings.alwaysGroupTactics = false;
        this.player1.player.optionSettings.dontIceTrapOwnUnits = false;

        this.player2.player.optionSettings.bluffTimer = 0;
        this.player2.player.optionSettings.alertTimer = 0;
        this.player2.player.optionSettings.alwaysGroupTactics = false;
        this.player2.player.optionSettings.dontIceTrapOwnUnits = false;
        if (this.player2.isDummy && !options.allowSetup) {
            spyOn(this.player2.player, 'setupAspects');
        }
        this.startGame();
        //Player stats
        this.player1.actions = { main: true, side: true };
        this.player2.actions = { main: true, side: true };
        //Field
        this.player1.hand = [];
        this.player2.hand = [];

        // this.player1.phoenixborn = options.player1.phoenixborn;
        // this.player2.phoenixborn = options.player2.phoenixborn;
        this.player1.inPlay = options.player1.inPlay;
        if (!this.player2.inPlay.length) {
            this.player2.inPlay = options.player2.inPlay;
        }

        if (!this.player1.isDummy) {
            this.player1.spellboard = options.player1.spellboard;
        }
        if (!this.player2.isDummy) {
            this.player2.spellboard = options.player2.spellboard;
        }
        this.player1.dicepool = options.player1.dicepool;
        this.player2.dicepool = options.player2.dicepool;
        if (this.player2.isDummy) {
            this.player2.dicepool.forEach(d => d.level = 'basic');
        }
        this.player1.hand = options.player1.hand;
        this.player2.hand = options.player2.hand;
        this.player1.discard = options.player1.discard;
        this.player2.discard = options.player2.discard;
        this.player1.archives = options.player1.archives;
        this.player2.archives = options.player2.archives;
        if (this.player2.isDummy && options.player2.threatZone) {
            this.player2.threatZone = options.player2.threatZone;
        }

        for (let player of [this.player1, this.player2]) {
            let cards = [
                'inPlay',
                'threatZone',
                'spellboard',
                'hand',
                'discard',
                'archives',
                'phoenixborn',
                'deck'
            ].reduce((array, location) => array.concat(player[location]), []);
            for (let card of cards) {
                let split = card.id.split('-');
                for (let i = 1; i < split.length; i++) {
                    split[i] = split[i].slice(0, 1).toUpperCase() + split[i].slice(1);
                    // TODO Enable this and fix the tests it breaks
                    // if (split[i].length === 1) {
                    //     split[i] = split[i].toLowerCase();
                    // }
                }

                let camel = split.join('');
                if (!this[camel]) {
                    this[camel] = card;
                }
            }
        }

        this.game.checkGameState(true);
    };
});

afterEach(function () {
    if (process.env.DEBUG_TEST) {
        // eslint-disable-next-line no-console
        console.info(this.game.getPlainTextLog());
    }
});
