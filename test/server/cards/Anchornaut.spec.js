describe('Anchornaut', function () {
    describe('Throw 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('should deal 1 damage to a target unit', function () {
            expect(this.blueJaguar.tokens.damage).toBeUndefined();

            this.player1.clickCard(this.anchornaut);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(1);
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);

            this.player1.clickCard(this.blueJaguar);

            expect(this.blueJaguar.tokens.damage).toBe(1);
        });

        it('destroyed unit is removed from battlefield', function () {
            expect(this.mistSpirit.damage).toBe(0);

            this.player1.clickCard(this.anchornaut);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(1);
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);

            this.player1.clickCard(this.mistSpirit);

            expect(this.mistSpirit.location).toBe('archives');
        });
    });
});
