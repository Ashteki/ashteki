const Dice = require('../../../../server/game/dice');

describe('Charging Horde', function () {
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
                inPlay: ['charging-horde'],
                deck: [],
                spellboard: [],
                threatZone: ['rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                archives: ['rainwalker']
            }
        });

    });

    it('on attack summons rainwalker', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(3); // attack
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.chargingHorde.isAttacker).toBe(true);
        expect(this.game.attackState.isPBAttack).toBe(true);

        expect(this.rainwalker.location).toBe('play area');
        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });
});


