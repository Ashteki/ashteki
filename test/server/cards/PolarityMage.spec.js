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
            this.player1.clickPrompt('Return to Hand');
            expect(this.player1).toHavePrompt('Choose a card');

            this.player1.clickCard(this.massiveGrowth);

            expect(this.massiveGrowth.location).toBe('hand');
        });
    });

    describe('enters play discard', function () {
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

        it('returns upgrade from discard', function () {
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
            this.player1.clickPrompt('Discard from Play');
            expect(this.player1).toHavePrompt('Choose a card');

            this.player1.clickCard(this.massiveGrowth);

            expect(this.massiveGrowth.location).toBe('discard');
        });
    });
});
