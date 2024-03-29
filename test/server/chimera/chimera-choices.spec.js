describe('Chimera Choice', function () {
    describe('Generosity', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['generosity']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('player should be able to make choices for chimera', function () {
            this.player1.play(this.generosity);
            this.player1.clickPrompt('Draw');
            this.player1.clickPrompt('Heal');
            this.player1.clickCard(this.corpseOfViros);
            this.player1.clickPrompt('Unexhaust');
            this.player1.clickCard(this.aradelSummergaard);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
