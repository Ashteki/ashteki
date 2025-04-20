describe('Metamorpher', function () {
    describe('Start of turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['metamorpher', 'mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['freezing-blast', 'clashing-tempers'],
                    archives: ['sun-scarab', 'moon-moth', 'pack-wolf']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'holy-knight', 'anchornaut'],
                    spellboard: [],
                    hand: [],
                    dicepool: ['natural', 'natural', 'charm']
                }
            });
        });

        it('offers to morph - choose sun scarab', function () {
            this.player1.endTurn();
            this.player2.actions.main = false;
            this.player2.endTurn();

            this.player1.clickYes();
            expect(this.player1).not.toBeAbleToSelect(this.packWolf);
            this.player1.clickCard(this.sunScarab);

            expect(this.sunScarab.location).toBe('play area');
            expect(this.metamorpher.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('offers to morph - choose moon moth', function () {
            this.player1.endTurn();
            this.player2.actions.main = false;
            this.player2.endTurn();

            this.player1.clickYes();
            expect(this.player1).not.toBeAbleToSelect(this.packWolf);
            this.player1.clickCard(this.moonMoth);

            expect(this.moonMoth.location).toBe('play area');
            expect(this.metamorpher.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('offers to morph - decide not to', function () {
            this.player1.endTurn();
            this.player2.actions.main = false;
            this.player2.endTurn();

            this.player1.clickNo();
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
