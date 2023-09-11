const Dice = require('../../../../server/game/dice');

describe('Constrict Aspect', function () {
    describe('On Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker'],
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
                    threatZone: ['constrict', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });


        });

        it('reveal forces opponent to exhaust a card', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.exhausted).toBe(true);
            expect(this.constrict.location).toBe('play area');
            expect(this.constrict.facedown).toBe(false);
        });


        it('reveal then attack (5) forces opponent to exhaust a card', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(5);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            this.player1.clickCard(this.ironWorker); // constrict exhaust

            expect(this.constrict.location).toBe('play area');
            expect(this.constrict.isAttacker).toBe(true);
            this.player1.clickDone(); // guard

            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
            expect(this.constrict.location).toBe('play area');
            expect(this.constrict.facedown).toBe(false);

        });
    });
});