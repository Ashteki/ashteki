describe('Ritualist ', function () {
    describe('Enters play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit'],
                    dicepool: ['ceremonial', 'charm'],
                    hand: ['ritualist'],
                    discard: ['chant-of-revenge', 'anchornaut'],
                    deck: ['purge', 'chant-of-sacrifice']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('tutor a chant', function () {
            this.player1.clickCard(this.ritualist);
            this.player1.clickPrompt('Play this Ally');
            expect(this.ritualist.location).toBe('play area');

            expect(this.player1).toBeAbleToSelect(this.chantOfRevenge);
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
            expect(this.player1).toBeAbleToSelect(this.chantOfSacrifice);
            expect(this.player1).not.toBeAbleToSelect(this.purge);
            this.player1.clickCard(this.chantOfRevenge);
            expect(this.chantOfRevenge.location).toBe('hand');
        });
    });
});
