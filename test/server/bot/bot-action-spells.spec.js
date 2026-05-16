describe('Bot Action Spells', function () {
    describe('Steady gaze example', function () {
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
                    hand: ['steady-gaze', 'summon-false-demon']
                }
            });
        });

        it('bot should play spellbook if no target for SG', function () {
            this.player1.endTurn();

            expect(this.steadyGaze.location).toBe('hand'); // not played
            expect(this.summonFalseDemon.location).toBe('spellboard'); // played instead
        });
    });

    describe('Steady gaze priority', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'bot',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut', 'hammer-knight', 'flute-mage'],
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
                    hand: ['steady-gaze', 'summon-false-demon']
                }
            });
        });

        it('bot should play to strongest unit', function () {
            this.player1.endTurn();
            expect(this.hammerKnight.exhausted).toBe(true);
            expect(this.anchornaut.exhausted).toBe(false);
            expect(this.fluteMage.exhausted).toBe(false);
            expect(this.ironWorker.exhausted).toBe(false);
            expect(this.steadyGaze.location).toBe('discard');
            expect(this.summonFalseDemon.location).toBe('hand'); // not played
        });
    });
});
