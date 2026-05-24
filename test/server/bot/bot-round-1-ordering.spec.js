describe('Bot Round 1 action choice order', function () {
    describe('when choosing what to play', function () {
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
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['illusion', 'illusion', 'charm', 'charm'],
                    hand: ['iron-worker', 'summon-false-demon', 'flute-mage']
                }
            });
        });

        it('bot should play ready spell before ally', function () {
            this.player1.endTurn();

            expect(this.summonFalseDemon.location).toBe('spellboard'); // played
        });
    });
});
