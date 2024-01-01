const Dice = require('../../../../server/game/dice');

describe('Ballistic Seeds Aspect', function () {
    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    deck: ['summon-gilder', 'flute-mage']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['allure', 'ballistic-seeds'],
                    spellboard: [],
                    threatZone: ['sowing-strike'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            spyOn(Dice, 'getRandomInt').and.returnValue(5); // basic

            this.allure.tokens.status = 2;
        });

        it('damage pb on status token spend', function () {
            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.allure.status).toBe(2);
            this.player1.endTurn();
            this.player1.clickCard(this.coalRoarkwin);

            this.player1.clickOk(); // reveal behaviour alert

            expect(this.allure.status).toBe(1);
            expect(this.coalRoarkwin.damage).toBe(1);
        });

        it('damage rightmost on status token spend', function () {
            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.allure.status).toBe(2);
            this.player1.endTurn();
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
            this.player1.clickCard(this.hammerKnight);

            this.player1.clickOk(); // reveal behaviour alert

            expect(this.allure.status).toBe(1);
            expect(this.hammerKnight.damage).toBe(1);
        });
    });

    describe('Cannot attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    deck: ['summon-gilder', 'flute-mage']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['ballistic-seeds'],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('chimera passes at start of round', function () {
            expect(this.coalRoarkwin.damage).toBe(0);
            this.player1.player.actions.main = false; // fudge
            this.player1.endTurn();

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
