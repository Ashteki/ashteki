const Dice = require('../../../../server/game/dice');

describe('Whirlpool Aspect', function () {
    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['whirlpool'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.hammerKnight.exhaust();
        });

        it('last token exhausts all unexhausted opponents units', function () {
            expect(this.hammerKnight.tokens.exhaustion).toBe(1);
            this.whirlpool.tokens.status = 1;
            expect(this.whirlpool.location).toBe('play area');
            this.player1.endTurn();

            expect(this.whirlpool.status).toBe(0);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.anchornaut.exhausted).toBe(true);
            expect(this.ironWorker.exhausted).toBe(true);
            expect(this.hammerKnight.tokens.exhaustion).toBe(1);
        });
    });
});
