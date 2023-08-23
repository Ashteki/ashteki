describe('Jungle Forager ', function () {
    describe('Enters play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['mist-spirit'],
                    dicepool: ['ceremonial', 'charm', 'natural'],
                    hand: ['ritualist', 'jungle-forager'],
                    discard: ['chant-of-revenge', 'anchornaut'],
                    deck: ['purge', 'chant-of-sacrifice', 'wallop', 'change-of-heart']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('tutor an alteration', function () {
            this.player1.play(this.jungleForager);
            expect(this.jungleForager.location).toBe('play area');

            expect(this.player1).toBeAbleToSelect(this.wallop);
            expect(this.player1).not.toBeAbleToSelect(this.purge);
            expect(this.player1).not.toBeAbleToSelect(this.chantOfSacrifice);
            expect(this.player1).not.toBeAbleToSelect(this.changeOfHeart);
            this.player1.clickCard(this.wallop);
            expect(this.wallop.location).toBe('hand');
        });
    });
});
