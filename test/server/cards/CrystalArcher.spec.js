describe('Crystal Archer', function () {
    describe('On Attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'james-endersight',
                    inPlay: ['crystal-archer', 'mist-spirit', 'raptor-herder', 'time-hopper']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'iron-rhino']
                }
            });
        });

        it('ping on attack', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.crystalArcher);
            expect(this.player1).not.toBeAbleToSelect(this.mistSpirit);
            this.player1.clickCard(this.ironRhino);

            expect(this.ironRhino.damage).toBe(1);
        });
    });

    describe('on defence', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'james-endersight',
                    inPlay: ['mist-spirit', 'raptor-herder', 'hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['crystal-archer', 'iron-rhino']
                }
            });
        });

        it('ping on block', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.raptorHerder);
            this.player1.clickDone();

            this.player2.clickCard(this.crystalArcher);
            this.player2.clickCard(this.mistSpirit);
            this.player2.clickDone();

            this.player2.clickCard(this.hammerKnight);

            expect(this.hammerKnight.damage).toBe(1);
        });
    });
});
