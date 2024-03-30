const Dice = require('../../../../server/game/dice');

describe('Explosive Pods', function () {
    describe('Ability In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['tsunami-shot']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['explosive-pods'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('the last status discards and deals AoE damage', function () {
            this.explosivePods.tokens.status = 1;
            expect(this.explosivePods.location).toBe('play area');
            this.player1.endTurn();
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.hammerKnight);
            expect(this.explosivePods.location).toBe('play area');
            expect(this.explosivePods.status).toBe(0);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.hammerKnight.damage).toBe(2);
            expect(this.coalRoarkwin.damage).toBe(0);
        });

        it('if status remains then no damage', function () {
            this.explosivePods.tokens.status = 2;
            expect(this.explosivePods.location).toBe('play area');
            this.player1.endTurn();
            expect(this.anchornaut.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(0);

            this.player1.clickOk(); // rage / behaviour roll
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
