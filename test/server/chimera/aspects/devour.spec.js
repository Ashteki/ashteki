const Dice = require('../../../../server/game/dice');

describe('Devour', function () {
    describe('on Attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    deck: ['purge', 'abundance', 'heal']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['devour'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('forces opponent discard from deck', function () {
            this.player1.endTurn();
            // should attack anchornaut
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter

            expect(this.player1.discard.length).toBe(2); // anchornaut + 1 from ToD discard
            expect(this.anchornaut.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 1 with empty deck causes 1 damage', function () {
            this.player1.player.deck = [];
            this.player1.endTurn();
            // should attack anchornaut
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter

            expect(this.player1.discard.length).toBe(2); // anchornaut + 1 from ToD discard
            expect(this.anchornaut.location).toBe('discard');
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 2 with empty deck causes 1 damage', function () {
            this.player2.player.chimeraPhase = 2;
            this.player1.player.deck = [];
            this.player1.endTurn();
            // should attack anchornaut
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter

            expect(this.player1.discard.length).toBe(2); // anchornaut + 1 from ToD discard
            expect(this.anchornaut.location).toBe('discard');
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 2 with 1 in deck causes 1 damage', function () {
            this.player2.player.chimeraPhase = 2;
            this.player1.player.deck = [this.heal];
            this.player1.endTurn();
            // should attack anchornaut
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter

            expect(this.player1.discard.length).toBe(2); // anchornaut + 1 from ToD discard
            expect(this.anchornaut.location).toBe('discard');
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
