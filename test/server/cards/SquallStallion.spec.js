describe('Squall Stallion', function () {
    describe('Squall Stallion', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-squall-stallion'],
                    dicepool: ['illusion', 'sympathy', 'sympathy', 'natural', 'natural'],
                    archives: ['squall-stallion'],
                    hand: ['crescendo']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: ['ice-trap']
                }
            });
        });

        it('cannot be targetted by opponents reactions', function () {
            this.player1.clickCard(this.summonSquallStallion);
            this.player1.clickPrompt('Summon Squall Stallion');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.squallStallion.location).toBe('play area');
        });
    });

    describe('SS with own reaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-squall-stallion'],
                    dicepool: ['illusion', 'sympathy', 'sympathy', 'natural', 'natural'],
                    archives: [],
                    hand: ['ice-trap', 'crescendo'],
                    inPlay: ['squall-stallion']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('can be targetted by my reactions', function () {
            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.squallStallion);
            this.player1.clickCard(this.crescendo);
            this.player1.clickCard(this.iceTrap);
            // target for crescendo
            expect(this.player1).toBeAbleToSelect(this.squallStallion);
            this.player1.clickCard(this.squallStallion);
            this.player1.clickCard(this.hammerKnight);

            expect(this.squallStallion.damage).toBe(1);
            expect(this.hammerKnight.damage).toBe(3);
            this.player2.clickDone();
            this.player2.clickNo();
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.squallStallion.location).toBe('play area');
        });
    });
});
