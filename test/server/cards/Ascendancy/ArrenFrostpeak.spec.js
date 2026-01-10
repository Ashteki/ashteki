describe('Arren Frostpeak', function () {
    describe('Ascend', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['astral', 'astral', 'charm', 'charm'],
                    hand: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['gilder'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('deal 1 damage and place an exhausted astral die on pb', function () {
            this.player1.dicepool[1].exhausted = true;

            this.player1.clickCard(this.arrenFrostpeak);
            this.player1.clickPrompt('Ascend');
            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].exhausted).toBe(true);

            this.player1.clickCard(this.gilder);
            this.player1.clickDie(0);

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.arrenFrostpeak.dieUpgrades.length).toBe(1);
            expect(this.gilder.damage).toBe(1);
        });
    });
});
