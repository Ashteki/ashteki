const Dice = require('../../../../server/game/dice');

describe('Iron Scales', function () {
    describe('When dealt damage', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                    inPlay: ['iron-scales'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['rampage', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('prevents all but one damage', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1); // no guard

            this.player1.clickAttack(this.ironScales);
            this.player1.clickCard(this.hammerKnight);

            expect(this.ironScales.damage).toBe(1);
        });
    });
});