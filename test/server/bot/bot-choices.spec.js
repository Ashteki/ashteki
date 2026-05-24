describe('Bot Choice', function () {
    describe('Generosity', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'bot',
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
                    bot: true,
                    phoenixborn: 'saria-guideman',
                    inPlay: ['rose-fire-dancer'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                }
            });
        });

        it('player should be able to make choices for bot (until strategy is able)', function () {
            this.player1.play(this.generosity);
            this.player1.clickPrompt('Draw');
            this.player1.clickPrompt('Heal');
            this.player1.clickCard(this.sariaGuideman);
            this.player1.clickPrompt('Unexhaust');
            this.player1.clickCard(this.aradelSummergaard);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
