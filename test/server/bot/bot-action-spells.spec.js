describe('Bot Action Spells', function () {
    describe('Steady gaze', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'bot',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    bot: true,
                    phoenixborn: 'saria-guideman',
                    inPlay: ['iron-worker'],
                    spellboard: [],
                    dicepool: ['illusion', 'illusion', 'charm', 'charm'],
                    hand: ['steady-gaze']
                }
            });
        });

        it('bot requires target to play action spell', function () {
            this.player1.endTurn();

            // bot does not play steady gaze - no targets

            expect(this.steadyGaze.location).toBe('hand'); // not played
        });
    });
});
