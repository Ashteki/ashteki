describe('Squall Stallion', function () {
    describe('Squall Stallion', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['illusion', 'sympathy', 'sympathy', 'natural', 'natural'],
                    hand: ['crescendo', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-squall-stallion'],
                    dicepool: ['illusion', 'sympathy', 'sympathy', 'natural', 'natural'],
                    inPlay: ['squall-stallion', 'anchornaut'],
                    hand: ['crescendo']
                }
            });
        });

        it('cannot be targetted by opponents reactions - crescendo', function () {
            this.player1.clickAttack(this.aradelSummergaard);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone();
            this.player1.clickCard(this.crescendo);
            this.player1.clickCard(this.moltenGold);

            this.player1.clickCard(this.hammerKnight);
            expect(this.player1).toBeAbleToSelect(this.anchornaut);
            expect(this.player1).not.toBeAbleToSelect(this.squallStallion);
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
