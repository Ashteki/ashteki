describe('Majestic Titan', function () {
    describe('Renew', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['majestic-titan'],
                    spellboard: ['summon-majestic-titan'],
                    dicepool: ['time', 'time', 'natural', 'natural'],
                    archives: ['time-hopper', 'time-hopper'],
                    hand: ['root-armor']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.majesticTitan.tokens.exhaustion = 2;
        });

        it('should discard summon spell and remove all exhaustion from titan', function () {
            this.player1.play(this.rootArmor, this.majesticTitan);
            expect(this.rootArmor.parent).toBe(this.majesticTitan);
            expect(this.majesticTitan.upgrades.length).toBe(1);
            this.player1.clickCard(this.majesticTitan);
            this.player1.clickPrompt('Renew');
            this.player1.clickDie(0);
            this.player1.clickCard(this.summonMajesticTitan);

            expect(this.summonMajesticTitan.location).toBe('discard');
            expect(this.rootArmor.location).toBe('discard');
            expect(this.majesticTitan.exhausted).toBe(false);
            expect(this.majesticTitan.upgrades.length).toBe(0);
        });
    });
});
