describe('Prism Tetra', function () {
    describe('end of round discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['prism-tetra', 'anchornaut'],
                    dicepool: ['ceremonial', 'charm', 'charm', 'time', 'illusion'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['chant-of-revenge'],
                    inPlay: ['river-skald']
                }
            });
        });

        it('Scatter - end of round discard without status', function () {
            expect(this.prismTetra.location).toBe('play area');
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone();

            expect(this.prismTetra.location).toBe('archives');
        });
    });
});
