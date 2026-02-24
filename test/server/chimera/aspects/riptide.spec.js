const Dice = require('../../../../server/game/dice');

describe('Riptide Aspect', function () {
    describe('On reveal first time', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['false-demon', 'anchornaut', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['riptide'],
                    archives: ['drowning', 'drowning'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.player2.dicepool[0].level = 'basic';
            this.player2.dicepool[1].level = 'basic';
            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it("allocate 2 damage to player's cards", function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            expect(this.riptide.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.riptide.facedown).toBe(false);
            expect(this.player1).not.toBeAbleToSelect(this.riptide);
            this.player1.clickCard(this.falseDemon);
            this.player1.clickCard(this.coalRoarkwin);

            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.falseDemon.damage).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('allocate 2 damage to a single units', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            expect(this.riptide.facedown).toBe(true);
            this.player1.endTurn();
            this.player1.clickPrompt('Ok');

            this.player1.clickCard(this.falseDemon);
            this.player1.clickCard(this.falseDemon);

            expect(this.falseDemon.location).toBe('archives');

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
