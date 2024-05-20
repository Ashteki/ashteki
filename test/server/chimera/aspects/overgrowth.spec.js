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

    describe('On unit destruction by neighbour attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'hammer-knight', 'anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['rampage', 'overgrowth'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('neighbour attack and destroy deals one damage to pb', function () {
            this.player1.endTurn();
            // attacks anchornaut
            this.player1.clickDone(); // no guard
            this.player1.clickYes(); // counter

            expect(this.anchornaut.location).toBe('discard');
            // overgrowth/kill 1
            expect(this.coalRoarkwin.damage).toBe(1);
        });
    });


    describe('On unit destruction by non-neighbour attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'hammer-knight', 'anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['rampage', 'constrict', 'overgrowth'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('not triggered', function () {
            this.player1.endTurn();
            // attacks anchornaut
            this.player1.clickDone(); // no guard
            this.player1.clickYes(); // counter

            expect(this.anchornaut.location).toBe('discard');

            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('On aspect destruction', function () {
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
                    inPlay: ['overgrowth', 'rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('non-attack destroy', function () {
            this.player1.clickAttack(this.overgrowth);
            this.player1.clickCard(this.ironWorker);

            this.player1.clickOk();
            expect(this.ironWorker.location).toBe('discard');
            expect(this.coalRoarkwin.damage).toBe(0);
        });
    });

});
