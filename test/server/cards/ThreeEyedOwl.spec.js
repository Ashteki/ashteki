describe('Three Eyed Owl', function () {
    describe('End of PreparePhase', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem', 'three-eyed-owl'],
                    spellboard: ['summon-three-eyed-owl'],
                    dicepool: ['natural', 'divine', 'divine', 'charm'],
                    archives: ['ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: ['anchornaut', 'hammer-knight', 'flute-mage']
                }
            });
        });

        it('forces chosen discard', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone();
            this.player2.clickPrompt('No');
            expect(this.player2).toHavePrompt('Three-Eyed Owl');
            expect(this.player2).toHavePrompt('Choose a card to discard');
            expect(this.player2).not.toHavePromptButton('Cancel');
            expect(this.threeEyedOwl.location).toBe('play area');
            this.player2.clickCard(this.anchornaut);
            expect(this.player2).toHaveDefaultPrompt();
        });
    });

});
