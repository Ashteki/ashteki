describe('Summon Ruin Dweller', function () {
    describe('when not focused', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['ceremonial', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-ruin-dweller'],
                    archives: ['ruin-dweller'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('normal summon', function () {
            expect(this.player1.actions.main).toBe(true);
            this.player1.clickCard(this.summonRuinDweller);
            this.player1.clickPrompt('Summon Ruin Dweller');
            //don't require action type selection
            expect(this.ruinDweller.location).toBe('play area');
            expect(this.player1.actions.main).toBe(false);
        });
    });
});
