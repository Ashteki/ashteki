describe('Old Salt', function () {
    describe('Throw 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    hand: ['old-salt']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('should deal 1 damage to a target unit', function () {
            expect(this.blueJaguar.tokens.damage).toBeUndefined();

            this.player1.clickCard(this.oldSalt);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(1);
            this.player1.clickDone();
            expect(this.player1).not.toBeAbleToSelect(this.oldSalt);
            expect(this.oldSalt.damage).toBe(1);

            this.player1.clickCard(this.blueJaguar);

            expect(this.blueJaguar.damage).toBe(1);
        });
    });
});
