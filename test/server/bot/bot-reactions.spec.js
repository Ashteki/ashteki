describe('Bot Reactions', function () {
    describe('Ice Trap', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'bot',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'ceremonial', 'charm'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['blood-shaman']
                },
                player2: {
                    dummy: true,
                    bot: true,
                    phoenixborn: 'saria-guideman',
                    inPlay: ['rose-fire-dancer'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['ice-trap']
                }
            });
        });

        it('bot chooses to play reaction spells at all times', function () {
            this.player1.play(this.bloodShaman);
            // this.player1.clickDie(0);
            expect(this.iceTrap.location).toBe('discard');
            expect(this.bloodShaman.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
