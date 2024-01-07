const Dice = require('../../../../server/game/dice');

describe('Iron Scales', function () {
    describe('When dealt damage', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight', 'light-swordsman'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
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

        it('quickstrike vs damage limitation. should counter vs light swordsman', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1); // no guard

            this.player1.clickAttack(this.ironScales);
            this.player1.clickCard(this.lightSwordsman);

            expect(this.ironScales.damage).toBe(1);
            expect(this.lightSwordsman.location).toBe('discard');
        });
    });
});