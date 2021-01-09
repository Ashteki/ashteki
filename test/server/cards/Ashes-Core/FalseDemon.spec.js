describe('False Demon', function () {
    describe('Nightmare 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: ['summon-false-demon'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    archives: ['false-demon']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit']
                }
            });

            this.blueJaguar.exhaust();
        });

        it('should deal 1 damage to a target exhausted unit', function () {
            expect(this.blueJaguar.damage).toBe(0);

            this.player1.clickCard(this.summonFalseDemon);
            this.player1.clickPrompt('Summon False Demon');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.falseDemon);

            expect(this.player1).toBeAbleToSelect(this.blueJaguar);
            expect(this.player1).not.toBeAbleToSelect(this.mistSpirit);

            this.player1.clickCard(this.blueJaguar);

            expect(this.blueJaguar.damage).toBe(1);
        });
    });
});
