const Dice = require('../../../../server/game/dice');

describe('Vigor Alteration', function () {
    describe('Enrage on destroy', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['firebelly'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['stun', 'vigor']
                }
            });
        });

        it('vigor destroyed rerolls basic rage', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4);
            this.player2.dicepool.forEach((d) => (d.level = 'basic'));
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(0);
            expect(this.firebelly.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.firebelly.facedown).toBe(false);
            expect(this.firebelly.upgrades.length).toBe(1);
            expect(this.vigor.parent).toBe(this.firebelly);

            expect(this.player1).toHaveDefaultPrompt();
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.firebelly);
            expect(this.firebelly.location).toBe('discard');
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(1); // PASS ADDS POWOER DICE

            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(2);

        });
    });
});
