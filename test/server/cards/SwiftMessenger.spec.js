const { TypeaheadInputSingle } = require("react-bootstrap-typeahead");

describe('Swift Messenger', function () {
    describe('Swift Messenger in hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['beast-tamer'],
                    dicepool: ['charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'illusion', 'illusion', 'ceremonial', 'time'],
                    hand: ['swift-messenger'],
                    archives: ['sleeping-widow']
                }
            });

            this.player2.actions.main = false; // shouldn't need this
            this.fluteMage.tokens.damage = 1;
        });

        it('reaction to play after opponent unit enters play', function () {
            this.player1.play(this.beastTamer);

            expect(this.player2).toBeAbleToSelect(this.swiftMessenger);

            this.player2.clickCard(this.swiftMessenger);

            expect(this.swiftMessenger.location).toBe('play area');
            expect(this.player2.dicepool[5].exhausted).toBe(true);
            expect(this.player2.player.limitedPlayed).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('does not count as reaction when played normally', function () {
            this.player1.endTurn();
            this.player2.play(this.swiftMessenger);
            expect(this.swiftMessenger.location).toBe('play area');
            expect(this.player2.player.limitedPlayed).toBe(0);
            expect(this.player2).toHaveDefaultPrompt();
        });
    });

    describe('Swift Messenger chain draw', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['beast-tamer'],
                    dicepool: ['charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    spellboard: [],
                    dicepool: ['time', 'time'],
                    hand: ['swift-messenger'],
                    archives: ['sleeping-widow'],
                    deck: ['swift-messenger', 'swift-messenger']
                }
            });

            this.player2.actions.main = false; // shouldn't need this
        });

        it('reaction should not chain if card drawn is swift messenger', function () {
            this.player2.player.deck = this.player2.deck.filter((c) => c.id === 'swift-messenger');
            this.player1.play(this.beastTamer);
            expect(this.player2).toBeAbleToSelect(this.swiftMessenger);

            this.player2.clickCard('swift-messenger', 'hand');

            expect(this.swiftMessenger.location).toBe('play area');
            expect(this.player2.dicepool[0].exhausted).toBe(true);
            expect(this.player2.player.limitedPlayed).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });


    describe('Swift Messenger on my turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['swift-messenger', 'beast-tamer'],
                    dicepool: ['natural', 'natural', 'illusion', 'time', 'ceremonial', 'time']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['salamander-monk'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'illusion', 'illusion', 'ceremonial', 'time'],
                    hand: [],
                    archives: ['sleeping-widow', 'salamander-monk-spirit']
                }
            });
        });

        it('reaction to play after opponent unit enters play', function () {
            expect(this.player1.actions.main).toBe(true);
            this.player1.clickDie(0);
            this.player1.clickPrompt('Natural Dice Power');
            this.player1.clickCard(this.salamanderMonk);
            expect(this.player1).toBeAbleToSelect(this.swiftMessenger);

            this.player1.clickCard(this.swiftMessenger);

            expect(this.swiftMessenger.location).toBe('play area');
            expect(this.player1.actions.main).toBe(true);
            expect(this.player1.player.limitedPlayed).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
