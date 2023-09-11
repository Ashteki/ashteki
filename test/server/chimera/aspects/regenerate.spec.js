const Dice = require('../../../../server/game/dice');

describe('Regenerate Aspect', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['regenerate'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player2.dicepool.forEach((d) => (d.level = 'basic'));
        });

        it('when destroyed roll a power side and no effect', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(1); // power
            expect(this.regenerate.location).toBe('play area');

            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.regenerate);

            expect(this.player2.dicepool.some((d) => d.level === 'power')).toBe(true);
            expect(this.regenerate.location).toBe('discard');
            expect(this.regenerate.exhausted).toBe(false);
            expect(this.regenerate.moribund).toBe(false);
        });

        it('when destroyed roll a basic side and place rightmost on b/f', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(5); // basic

            expect(this.regenerate.location).toBe('play area');

            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.regenerate);

            expect(this.player2.dicepool.some((d) => d.level === 'power')).toBe(false);
            expect(this.regenerate.location).toBe('play area');
            expect(this.regenerate.exhausted).toBe(true);
        });
    });
});
