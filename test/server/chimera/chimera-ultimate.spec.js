const Dice = require('../../../server/game/dice');

describe('Chimera ultimate', function () {
    describe('value and exhaustion', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('ultimate value raises with exhaustion tokens', function () {
            expect(this.virosS1.ultimate).toBe(3);

            this.virosS1.tokens.exhaustion = 2;

            expect(this.virosS1.ultimate).toBe(5);
        });

        it('red rains ultimate trigger removes RR tokens', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            expect(this.player2.phoenixborn.redRains).toBe(0);
        });
    });
});
