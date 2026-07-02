const Dice = require('../../../server/game/dice');

describe('When Aspects attack', function () {
    describe('with center aim icon', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage', 'hammer-knight', 'winged-lioness'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,

                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    inPlay: ['radiant-flash', 'sear', 'birdhunter'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('all center icon aspects attack together', function () {
            this.player1.endTurn();

            expect(this.radiantFlash.isAttacker).toBe(true);
            expect(this.birdhunter.isAttacker).toBe(true);
            expect(this.sear.isAttacker).toBe(false);
            this.player1.clickDone(); // no blockers

            expect(this.coalRoarkwin.damage).toBe(5);
        });
    });

    describe('reveal, attack with center aim icon', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage', 'hammer-knight', 'winged-lioness'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,

                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    inPlay: ['radiant-flash', 'sear'],
                    spellboard: [],
                    threatZone: ['birdhunter'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('all center icon aspects attack together', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(0); // power = reveal and attack
            this.player1.endTurn();

            this.player1.clickOk(); // alert
            expect(this.birdhunter.isAttacker).toBe(true);
            expect(this.radiantFlash.isAttacker).toBe(true);
            expect(this.sear.isAttacker).toBe(false);
            this.player1.clickDone(); // no blockers

            expect(this.coalRoarkwin.damage).toBe(5);
        });
    });
});
