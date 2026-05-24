describe('Bot Dice Fixing', function () {
    describe('When cards are playable', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'bot',
                allowSetup: true,
                player1: {
                    phoenixborn: 'saria-guideman',
                    inPlay: ['anchornaut'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    bot: true,
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    spellboard: [],
                    dicepool: ['illusion', 'illusion', 'charm', 'charm'],
                    hand: ['shifting-mist', 'summon-false-demon']
                }
            });
        });

        it('bot should not use dice fixing - shifting mist', function () {
            expect(this.shiftingMist.location).toBe('hand'); // not played
            expect(this.summonFalseDemon.location).toBe('hand'); // not played

            this.player1.endTurn();

            expect(this.shiftingMist.location).toBe('spellboard'); // not played
            expect(this.shiftingMist.exhausted).toBe(false);
            expect(this.summonFalseDemon.location).toBe('hand'); // not played

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
