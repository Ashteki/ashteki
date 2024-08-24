describe('Red Raindrops', function () {
    describe('Action spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rowan-umberend',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['natural', 'time', 'charm', 'charm', 'time'],
                    hand: ['discovery', 'discovery', 'discovery', 'purge', 'kneel', 'devotion'],
                    deck: ['anchornaut'],
                    archives: ['red-raindrop', 'red-raindrop', 'red-raindrop', 'reborn-chimera']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['beast-mage', 'iron-worker'],
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

            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.damage).toBe(1);
        });

        it('deal 1 damage, summon chimera', function () {
            this.player1.play(this.player1.hand[0]);
            this.player1.clickDie(0);
            this.player1.clickCard(this.purge); // discard cost

            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.play(this.player1.hand[0]);
            this.player1.clickDie(1);
            this.player1.clickCard(this.kneel); // discard cost

            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.play(this.player1.hand[0]);
            this.player1.clickDie(2);
            this.player1.clickCard(this.devotion); // discard cost

            expect(this.rowanUmberend.upgrades.length).toBe(3);

            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.endTurn();

            this.player1.clickDone();
            this.player2.clickDone();

            // choose 1 of 3
            this.player1.clickCard(this.redRaindrop);
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.damage).toBe(1);

            expect(this.rebornChimera.location).toBe('play area');
        });

        it('skip damage, summon chimera', function () {
            this.player1.play(this.player1.hand[0]);
            this.player1.clickDie(0);
            this.player1.clickCard(this.purge); // discard cost

            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.play(this.player1.hand[0]);
            this.player1.clickDie(1);
            this.player1.clickCard(this.kneel); // discard cost

            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.play(this.player1.hand[0]);
            this.player1.clickDie(2);
            this.player1.clickCard(this.devotion); // discard cost

            expect(this.rowanUmberend.upgrades.length).toBe(3);

            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.endTurn();

            this.player1.clickDone();
            this.player2.clickDone();

            this.player1.clickCard(this.redRaindrop);
            this.player1.clickDone();
            expect(this.ironWorker.damage).toBe(0);

            expect(this.rebornChimera.location).toBe('play area');
        });
    });
});
