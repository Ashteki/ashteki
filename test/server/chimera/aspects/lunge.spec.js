const Dice = require('../../../../server/game/dice');

describe('Lunge Aspect', function () {
    describe('On Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['false-demon', 'anchornaut', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'spawn-of-shadowreck',
                    behaviour: 'shadowreck-behaviour',
                    ultimate: 'shadowreck-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['lunge'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('resolve behaviour side action', function () {
            spyOn(Dice, 'd12Roll').and.returnValues(1, 9, 1); // behaviour then roll action
            expect(this.spawnOfShadowreck.redRains).toBe(0);

            expect(this.lunge.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll (reveal)
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.lunge.facedown).toBe(false);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(2); // behaviour + action
            expect(this.spawnOfShadowreck.redRains).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();

            // end the round
            this.lunge.exhaust();

            this.player1.endTurn();
            this.player1.clickDone(); // keep dice end of round
            this.player1.clickNo(); // card discard
            expect(this.lunge.facedown).toBe(true);
        });
    });
});
