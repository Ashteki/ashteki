const Dice = require('../../../server/game/dice');

describe('Kneel vs Chimera', function () {
    describe('Threat Zone', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'divine', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino', 'kneel']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['iron-scales'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['constrict', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('reveal forces opponent to exhaust a card', function () {
            this.player1.play(this.kneel);

            expect(this.ironScales.exhausted).toBe(true);
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.exhausted).toBe(true);
            expect(this.constrict.location).toBe('play area');
            expect(this.constrict.facedown).toBe(false);
            expect(this.constrict.exhausted).toBe(false);
        });
    });
});
