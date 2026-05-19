const Dice = require('../../../server/game/dice');

describe('Dragonborn Dice rolls', function () {
    describe('Dragonborn rolls fifth dragon dice power side', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
            spyOn(Dice, 'd12Roll').and.returnValue(1);

            this.player2.dicepool[0].level = 'power';
            this.player2.dicepool[1].level = 'power';
            this.player2.dicepool[2].level = 'power';
            this.player2.dicepool[3].level = 'power';
            expect(this.huntingInstincts.facedown).toBe(true);
        });

        it('5 powers adds status token to dragonborn', function () {
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(0);
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll

            expect(this.player2.dicepool.every((d) => d.level === 'basic'));
            expect(this.player2.phoenixborn.status).toBe(1);
            expect(this.player2.phoenixborn.redRains).toBe(0);
            this.player1.clickPrompt('Ok');

            expect(this.huntingInstincts.facedown).toBe(false);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
        });
    });
});
