describe('Polarity Mage', function () {
    describe('enters play return', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                    hand: ['polarity-mage', 'living-doll', 'molten-gold'],
                    discard: ['massive-growth']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('returns upgrade from discard', function () {
            this.player1.clickCard(this.polarityMage);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Return card');
            expect(this.player1).toHavePrompt('Choose a card');

            this.player1.clickCard(this.massiveGrowth);

            expect(this.massiveGrowth.location).toBe('hand');
        });

        it('return upgrade cancelled', function () {
            this.player1.clickCard(this.polarityMage);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Return card');
            expect(this.player1).toHavePrompt('Choose a card');

            this.player1.clickDone();

            expect(this.massiveGrowth.location).toBe('discard');
        });
    });

    describe('enters play - Discard from Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                    hand: ['polarity-mage', 'massive-growth']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('Discard from Play', function () {
            this.player1.clickCard(this.massiveGrowth);
            this.player1.clickPrompt('Play this Alteration');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.upgrades[0]).toBe(this.massiveGrowth);
            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.clickCard(this.polarityMage);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(2);
            this.player1.clickPrompt('Discard card');
            expect(this.player1).toHavePrompt('Choose a card');

            this.player1.clickCard(this.massiveGrowth);

            expect(this.massiveGrowth.location).toBe('discard');
        });

        it('Discard from Play cancelled', function () {
            this.player1.clickCard(this.massiveGrowth);
            this.player1.clickPrompt('Play this Alteration');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.upgrades[0]).toBe(this.massiveGrowth);
            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.clickCard(this.polarityMage);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(2);
            this.player1.clickPrompt('Discard card');
            expect(this.player1).toHavePrompt('Choose a card');

            this.player1.clickDone(); // cancelled

            expect(this.massiveGrowth.location).toBe('play area');
        });
    });

    describe('enters play - Discard from Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                    hand: ['deep-freeze']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['polarity-mage']
                }
            });
        });

        it('Discard from Play opponent negattachment', function () {
            this.player1.clickCard(this.deepFreeze);
            this.player1.clickPrompt('Play this Alteration');
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.upgrades[0]).toBe(this.deepFreeze);
            this.player1.endTurn();

            this.player2.clickCard(this.polarityMage);
            this.player2.clickPrompt('Play this Ally');
            this.player2.clickDie(2);
            this.player2.clickPrompt('Discard card');
            expect(this.player2).toHavePrompt('Choose a card');

            this.player2.clickCard(this.deepFreeze);

            expect(this.deepFreeze.location).toBe('discard');
        });
    });
});
