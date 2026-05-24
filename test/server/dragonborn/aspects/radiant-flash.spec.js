const Dice = require('../../../../server/game/dice');

describe('Radiant Flash', function () {
    describe('On Enters Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    spellboard: [],
                    threatZone: ['radiant-flash'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
        });

        it('player chooses power die to spin down to basic', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            expect(this.player1.dicepool[0].level).toBe('power');

            this.player1.endTurn();
            this.player1.clickOk();
            expect(this.radiantFlash.facedown).toBe(false);
            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].level).toBe('basic');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.scathaKalani.status).toBe(0);
        });

        it('no power dice means add status to dragonborn', function () {
            this.player1.dicepool.forEach((d) => d.level = 'class');
            expect(this.scathaKalani.status).toBe(0);
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            this.player1.endTurn();
            this.player1.clickOk();
            expect(this.radiantFlash.facedown).toBe(false);
            expect(this.scathaKalani.status).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
