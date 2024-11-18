const Dice = require('../../../../server/game/dice');

describe('Death Knell', function () {
    describe('Ability In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['tsunami-shot']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['death-knell'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.deathKnell.tokens.status = 2;
            this.player2.dicepool.forEach(d => d.level = 'basic');
        });

        it('no action on first status', function () {
            this.player1.endTurn();
            this.player1.clickOk();
            expect(this.hammerKnight.location).toBe('play area');
        });

        it('the last status destroys leftmost unit', function () {
            this.deathKnell.tokens.status = 1;
            expect(this.deathKnell.location).toBe('play area');
            this.player1.endTurn();
            this.player1.clickOk();
            expect(this.hammerKnight.location).toBe('discard');
        });
    });
});
