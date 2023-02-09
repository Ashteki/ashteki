describe('Bone Crow', function () {
    describe('On Attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'james-endersight',
                    inPlay: ['bone-crow', 'mist-spirit', 'raptor-herder', 'time-hopper']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'iron-rhino']
                }
            });
        });

        it('add one to attack when target is wounded', function () {
            this.hammerKnight.tokens.damage = 1;
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.boneCrow);

            expect(this.boneCrow.attack).toBe(2);
        });

        it('attack is unchanged when target is unwounded', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.boneCrow);

            expect(this.boneCrow.attack).toBe(1);
        });
    });
});
