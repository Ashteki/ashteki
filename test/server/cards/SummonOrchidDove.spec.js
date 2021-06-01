describe('Summon Orchid Dove', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-orchid-dove'],
                    dicepool: ['charm', 'charm', 'natural', 'natural'],
                    archives: ['orchid-dove']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a swallow', function () {
            this.player1.clickCard(this.summonOrchidDove);
            this.player1.clickPrompt('Summon Orchid Dove');
            this.player1.clickDie(0);
        });
    });

    describe('Focus 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-orchid-dove', 'summon-orchid-dove', 'summon-orchid-dove'],
                    dicepool: ['charm', 'charm', 'natural', 'natural'],
                    archives: ['orchid-dove']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['charm', 'charm', 'natural', 'natural', 'natural', 'natural']
                }
            });
        });

        it('should place a dove and damage 1 if empty', function () {
            this.player2.player.deck = [];
            expect(this.player2.deck.length).toBe(0);

            this.player1.clickCard(this.summonOrchidDove);
            this.player1.clickPrompt('Summon Orchid Dove');
            this.player1.clickDie(0);

            this.player1.clickPrompt('Yes');

            expect(this.coalRoarkwin.damage).toBe(1);
        });
    });
});
