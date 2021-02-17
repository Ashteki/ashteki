describe('Pain Shaman', function () {
    describe('Exchange pain', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['pain-shaman']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('should deal 1 damage to a target unit', function () {
            this.coalRoarkwin.tokens.damage = 1;
            expect(this.blueJaguar.tokens.damage).toBeUndefined();
            expect(this.coalRoarkwin.damage).toBe(1);

            this.player1.clickCard(this.painShaman);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickCard(this.blueJaguar);
            this.player1.clickCard(this.coalRoarkwin);

            expect(this.blueJaguar.tokens.damage).toBe(1);
            expect(this.coalRoarkwin.damage).toBe(0);
        });
    });
});
