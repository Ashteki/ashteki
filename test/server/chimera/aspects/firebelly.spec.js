const Dice = require('../../../../server/game/dice');

describe('Firebelly', function () {
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
                inPlay: ['firebelly'],
                deck: [],
                spellboard: [],
                threatZone: ['rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });

    });

    it('on attack targets phoenixborn', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.firebelly.isAttacker).toBe(true);
        expect(this.game.attackState.isPBAttack).toBe(true);

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });

    it('on attack deals 1 damage to all units and opposing pb', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.game.attackState.isPBAttack).toBe(true);
        expect(this.coalRoarkwin.damage).toBe(1);
        expect(this.anchornaut.location).toBe('discard');

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });
});


