const Dice = require('../../../../server/game/dice');

describe('Horrific Gaze Aspect', function () {
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
                    threatZone: ['horrific-gaze', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('reveal to in play makes opp pb considered exhausted', function () {
            expect(this.coalRoarkwin.exhausted).toBe(false);

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.coalRoarkwin.exhausted).toBe(true);
            expect(this.firebelly.exhausted).toBe(false);
            expect(this.ironWorker.exhausted).toBe(false);
            expect(this.hammerKnight.exhausted).toBe(false);
            expect(this.horrificGaze.location).toBe('play area');
            expect(this.horrificGaze.facedown).toBe(false);
        });
    });
});
