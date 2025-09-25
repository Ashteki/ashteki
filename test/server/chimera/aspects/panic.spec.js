const Dice = require('../../../../server/game/dice');

describe('Panic Aspect', function () {
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
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['panic'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.player2.dicepool[0].level = 'basic';
            this.player2.dicepool[1].level = 'basic';
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
        });

        it('reroll 2 basic dice on', function () {
            expect(this.panic.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.panic.facedown).toBe(false);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(3); // behaviour 1 + 2 rerolls

            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickPrompt('Done');

            expect(this.player1.dicepool[0].level).toBe('class');
            expect(this.player1.dicepool[1].level).toBe('class');
            expect(this.player1).toHaveDefaultPrompt();

            // end the round
            this.panic.exhaust();

            this.player1.endTurn();
            this.player1.clickDone(); // keep dice end of round
            this.player1.clickNo(); // card discard
            expect(this.panic.facedown).toBe(true);
        });
    });
});
