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
                    inPlay: ['erratic-strike'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['webbed']
                }
            });

            this.ironWorker.tokens.damage = 1;
            this.anchornaut.exhaust();
        });

        it('on attack to pb, odd behaviour roll destroys leftmost damaged unit', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1); // set attack roll for erratic strike to odd

            this.player1.endTurn();

            expect(this.erraticStrike.isAttacker).toBe(true);
            expect(this.game.attackState.isPBAttack).toBe(true);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
            expect(this.ironWorker.location).toBe('discard');
            expect(this.player1).not.toHaveDefaultPrompt();
        });

        it('on attack to pb, even behaviour roll destroys leftmost exhausted unit', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(4); // set attack roll for erratic strike to odd

            this.player1.endTurn();

            expect(this.erraticStrike.isAttacker).toBe(true);
            expect(this.game.attackState.isPBAttack).toBe(true);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.player1).not.toHaveDefaultPrompt();
        });
    });
});
