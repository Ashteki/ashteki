describe('Sudden Death - OP v2', function () {
    describe('Discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shadow-hound', 'mist-spirit'],
                    spellboard: ['hypnotize'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['call-upon-the-realms', 'molten-gold'],
                    deck: ['anchornaut', 'iron-worker', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: ['purge'],
                    discard: ['flute-mage'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino'],
                    deck: ['hammer-knight', 'iron-worker', 'iron-worker']
                }
            });
        });

        it('start of turn causes 2 chosen discard', function () {
            expect(this.player1.deck.length).toBe(3);
            expect(this.player2.deck.length).toBe(3);
            this.game.activateSuddenDeath(); // fudge
            this.game.roundFirstPlayer = this.player2.player; // fudge

            this.player1.endTurn();
            // sudden death prompts
            expect(this.player2).toHavePrompt('Sudden Death');
            expect(this.player2).not.toBeAbleToSelect(this.fluteMage); // discard
            expect(this.player2).toBeAbleToSelect(this.purge); // spellboard
            expect(this.player2).toBeAbleToSelect(this.shatterPulse); // hand
            this.player2.clickPrompt('Top of deck');
            expect(this.player2).toHavePrompt('Discarding top of deck');
            this.player2.clickPrompt('Confirm');
            this.player2.clickCard(this.shatterPulse);
            expect(this.player2).toHavePrompt('Discarding Shatter Pulse');
            this.player2.clickPrompt('Confirm');

            expect(this.player1.deck.length).toBe(3);
            expect(this.player2.deck.length).toBe(2);
            expect(this.player2.hand.length).toBe(1);

            this.player2.player.actions.main = false; // fudge
            this.player2.endTurn();
            this.player1.clickPrompt('Top of deck');
            this.player1.clickPrompt('Confirm');
            this.player1.clickPrompt('Top of deck');
            this.player1.clickPrompt('Confirm');

            expect(this.player1.deck.length).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('with no deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shadow-hound', 'mist-spirit'],
                    spellboard: ['hypnotize', 'purge'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                }
            });

            this.player1.player.deck = [];
            this.player2.player.deck = [];
        });

        it('expects discard of cards in hand', function () {
            expect(this.player1.deck.length).toBe(0);
            expect(this.player2.deck.length).toBe(0);
            this.game.activateSuddenDeath(); // fudge
            this.game.roundFirstPlayer = this.player2.player; // fudge
            this.player1.endTurn();

            // sudden death prompt
            expect(this.player2).toHavePrompt('Sudden Death');
            expect(this.player2).not.toHavePrompt('Top of deck');

            // discard from hand
            this.player2.clickCard(this.summonIronRhino);
            this.player2.clickPrompt('Confirm');
            this.player2.clickCard(this.shatterPulse);
            this.player2.clickPrompt('Confirm');

            expect(this.player2.hand.length).toBe(0);
            expect(this.player2).toHaveDefaultPrompt();
        });

        it('expects discard of cards in spellboard', function () {
            expect(this.player1.deck.length).toBe(0);
            expect(this.player2.deck.length).toBe(0);
            expect(this.player1.spellboard.length).toBe(2);

            this.game.activateSuddenDeath(); // fudge
            this.game.roundFirstPlayer = this.player2.player; // fudge
            this.player1.endTurn();

            // discard from hand
            this.player2.clickCard(this.summonIronRhino);
            this.player2.clickPrompt('Confirm');
            this.player2.clickCard(this.shatterPulse);
            this.player2.clickPrompt('Confirm');

            this.player2.player.actions.main = false; // fudge
            this.player2.endTurn();

            // player 1 discard
            expect(this.player2).not.toHavePrompt('Top of deck');
            this.player1.clickCard(this.hypnotize);
            this.player1.clickPrompt('Confirm');
            this.player1.clickCard(this.purge);
            this.player1.clickPrompt('Confirm');

            expect(this.player1.spellboard.length).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });


    describe('unable to discard causes damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shadow-hound', 'mist-spirit'],
                    spellboard: ['hypnotize'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['call-upon-the-realms', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: [],
                    deck: ['iron-worker']
                }
            });

            this.player2.player.deck = [this.ironWorker];
        });

        it('start of turn causes 1 discard and 1 damage on partial deck', function () {
            expect(this.player2.deck.length).toBe(1);
            this.game.activateSuddenDeath(); // fudge
            this.game.roundFirstPlayer = this.player2.player; // fudge
            this.player1.endTurn();

            // sudden death prompt
            expect(this.player2).toHavePrompt('Sudden Death');
            expect(this.player2).not.toHavePrompt('Top of deck');

            // discard from hand
            this.player2.clickCard(this.ironWorker);
            this.player2.clickPrompt('Top of deck');
            this.player2.clickPrompt('Confirm');

            expect(this.player2.hand.length).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.player2).toHaveDefaultPrompt();
        });
    });
});
