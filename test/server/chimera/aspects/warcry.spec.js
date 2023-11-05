const Dice = require('../../../../server/game/dice');

describe('Warcry', function () {
    describe('On Attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage'], // 2 defenders to prevent ping removal - breaks for expect below.
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['warcry', 'giants-might', 'constrict'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['rampage'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['vigor']
                }
            });
        });

        it('on attack attach vigor to self', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.game.attackState.isPBAttack).toBe(true);
            expect(this.warcry.upgrades.length).toBe(1);

            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });

    describe('On Attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage'], // 2 defenders to prevent ping removal - breaks for expect below.
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['giants-might', 'warcry', 'constrict'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['rampage'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['vigor']
                }
            });
        });

        it('on neighbour attack attach vigor to self', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.coalRoarkwin.damage).toBe(2); // 1 + 1 for vigor
            expect(this.giantsMight.upgrades.length).toBe(1);
            expect(this.warcry.upgrades.length).toBe(0);

            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });

});
