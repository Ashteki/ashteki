const Dice = require('../../../../server/game/dice');

describe('Photosynthesize Aspect', function () {
    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['photosynthesize'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            spyOn(Dice, 'getRandomInt').and.returnValue(5); // basic

            this.photosynthesize.tokens.status = 2;
        });

        it('start of turn raises one basic die', function () {
            expect(this.photosynthesize.status).toBe(2);
            expect(this.player2.player.activeNonBasicDiceCount).toBe(0);
            expect(this.photosynthesize.location).toBe('play area');
            this.player1.endTurn();

            expect(this.photosynthesize.status).toBe(1);
            expect(this.player2.player.activeNonBasicDiceCount).toBe(1);
        });
    });
});
