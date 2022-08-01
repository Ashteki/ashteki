describe('Discovery', function () {
    describe('Action spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rowan-umberend',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['natural', 'time', 'charm', 'charm', 'time'],
                    hand: ['iron-worker', 'purge', 'discovery'],
                    deck: ['anchornaut'],
                    archives: ['red-raindrop']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('attach red raindrop to rowan', function () {
            this.player1.play(this.discovery);
            this.player1.clickDie(0);
            this.player1.clickCard(this.purge); // discard cost

            expect(this.redRaindrop.location).toBe('play area');
            expect(this.rowanUmberend.upgrades.length).toBe(1);
            expect(this.discovery.location).toBe('deck');
        });
    });
});
