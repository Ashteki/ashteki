const Dice = require('../../../../server/game/dice');

describe('Heartpierce', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'solo',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'flute-mage', 'hammer-knight'], // 2 defenders to prevent ping removal - breaks for expect below.
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'corpse-of-viros',
                behaviour: 'viros-behaviour',
                ultimate: 'viros-ultimate',
                inPlay: ['heartpierce'],
                deck: [],
                spellboard: [],
                threatZone: ['rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });
    });

    it('on attack deals 2 damage to rightmost unit', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.game.attackState.isPBAttack).toBe(true);
        expect(this.coalRoarkwin.damage).toBe(0);
        expect(this.anchornaut.damage).toBe(0);
        expect(this.fluteMage.damage).toBe(0);
        expect(this.hammerKnight.damage).toBe(2);

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });
});
