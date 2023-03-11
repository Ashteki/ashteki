describe('Shadowblade', function () {
    describe('Reaction to being attacked', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'fire-archer'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial'],
                    hand: ['shadowblade'],
                    archives: ['sleeping-widow', 'sleeping-widow']
                }
            });
        });

        it('3 parts', function () {
            this.player1.clickAttack(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            // onAttackersDeclared

            this.player2.clickCard(this.shadowblade);
            this.player2.clickDie(0);

            expect(this.player2.hand.length).toBe(2); // less shadowblade, draw 2

            this.player2.clickCard(this.ironWorker);

            expect(this.ironWorker.damage).toBe(1);

            expect(this.player2).not.toBeAbleToSelect(this.ironWorker);
            this.player2.clickCard(this.fireArcher);
            expect(this.fireArcher.location).toBe('discard');
            this.player2.clickDone(); // guard
            this.player2.clickYes();
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
