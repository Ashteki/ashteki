describe('Stand Still', function () {
    describe('standard test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    dicepool: ['time', 'sympathy', 'charm', 'charm'],
                    hand: ['stand-still', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['iron-rhino', 'mist-spirit', 'mist-spirit']
                }
            });
        });

        it('prevents blockers on attackers declared', function () {
            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone();
            this.player1.clickCard(this.standStill);
            this.player1.clickCard(this.moltenGold); // discard cost

            this.player1.clickCard(this.mistSpirit);

            expect(this.player2).toBeAbleToSelect(this.ironRhino);
            expect(this.player2).not.toBeAbleToSelect(this.mistSpirit);
            expect(this.player2.player.promptState.selectableCards.length).toBe(1);

            expect(this.standStill.location).toBe('discard');
            expect(this.moltenGold.location).toBe('discard');
        });
    });
});
