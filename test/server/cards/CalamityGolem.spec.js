describe('Calamity Golem', function () {
    describe('On Attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'james-endersight',
                    inPlay: ['calamity-golem', 'mist-spirit', 'raptor-herder', 'time-hopper']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'iron-rhino']
                }
            });

            this.calamityGolem.tokens.damage = 2;
        });

        it('deal damage on attack', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.calamityGolem);
            this.player1.clickCard(this.ironRhino);
            expect(this.ironRhino.damage).toBe(2);
        });
    });
});
