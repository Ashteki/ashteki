describe('Discovery', function () {
    describe('Action spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rowan-umberend',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['natural', 'time', 'charm', 'charm', 'time'],
                    hand: ['purge', 'discovery'],
                    deck: ['anchornaut'],
                    archives: ['red-raindrop', 'reborn-chimera']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('deal 1 damage at the end of the round', function () {
            this.player1.play(this.discovery);
            this.player1.clickDie(0);
            this.player1.clickCard(this.purge); // discard cost

            expect(this.redRaindrop.location).toBe('play area');
            expect(this.rowanUmberend.upgrades.length).toBe(1);
            expect(this.discovery.location).toBe('deck');

            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.endTurn();

            this.player1.clickDone();
            this.player2.clickDone();

            this.player1.clickCard(this.redRaindrop);
            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.damage).toBe(1);

            // expect(this.rebornChimera.location).toBe('play area');
        });
    });
});
