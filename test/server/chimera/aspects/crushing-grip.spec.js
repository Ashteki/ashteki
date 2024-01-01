const Dice = require('../../../../server/game/dice');

describe('Constrict Aspect', function () {
    describe('On Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['firebelly'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['crushing-grip', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('reveal to in play makes opp leftmost considered exhausted', function () {
            expect(this.anchornaut.exhausted).toBe(false);
            expect(this.player1.player.isLeftmost(this.anchornaut)).toBe(true);

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.anchornaut.exhausted).toBe(true);
            expect(this.firebelly.exhausted).toBe(false);
            expect(this.ironWorker.exhausted).toBe(false);
            expect(this.hammerKnight.exhausted).toBe(false);
            expect(this.crushingGrip.location).toBe('play area');
            expect(this.crushingGrip.facedown).toBe(false);
        });
    });
});
