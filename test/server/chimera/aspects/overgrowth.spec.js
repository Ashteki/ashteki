const Dice = require('../../../../server/game/dice');

describe('Overgrowth Aspect', function () {
    describe('On unit destruction by attack', function () {
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
                    inPlay: ['overgrowth'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('attack and destroy deals one damage to pb', function () {
            this.player1.endTurn();
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.overgrowth);
            this.player1.clickDone();

            expect(this.anchornaut.location).toBe('discard');
            // overgrowth/kill 1
            expect(this.coalRoarkwin.damage).toBe(1);
        });
    });
});
