const Dice = require('../../../../server/game/dice');

describe('Erratic Strike Aspect', function () {
    describe('On Attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['false-demon', 'anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['mist-spirit']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['erratic-strike', 'hunting-instincts'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['webbed']
                }
            });
        });

        it('on attack targets phoenixborn', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1); // set attack roll for erratic strike to odd

            this.player1.endTurn();

            expect(this.erraticStrike.isAttacker).toBe(true);
            expect(this.game.attackState.isPBAttack).toBe(true);

            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);

        });
    });
});
