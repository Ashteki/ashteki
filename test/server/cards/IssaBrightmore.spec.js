describe('Issa Brightmore', function () {
    describe('Inspiration', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'issa-brightmore',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['artifice', 'artifice', 'charm', 'charm'],
                    hand: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('draw 2 and place an exhausted artifice die', function () {
            this.player1.dicepool[1].exhausted = true;

            this.player1.clickCard(this.issaBrightmore);
            this.player1.clickPrompt('Inspiration');
            this.player1.clickDie(0);

            this.player1.clickCard(this.hammerKnight);

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.hammerKnight.isCharged).toBe(true);
            expect(this.hammerKnight.dieUpgrades.length).toBe(1);
            expect(this.player1.hand.length).toBe(3); // drew 2 cards

            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone(); // pin dice

            // dice return to pool during recovery
            expect(this.hammerKnight.isCharged).toBe(false);
        });
    });
});
