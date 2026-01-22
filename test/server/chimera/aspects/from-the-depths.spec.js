const Dice = require('../../../../server/game/dice');

describe('From the Depths Aspect', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'solo',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight', 'anchornaut', 'flute-mage'], // 2 defenders to prevent ping removal - breaks for expect below.
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'corpse-of-viros',
                behaviour: 'viros-behaviour',
                ultimate: 'viros-ultimate',
                inPlay: ['from-the-depths'],
                deck: [],
                spellboard: [],
                threatZone: ['rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                archives: ['drowning', 'drowning', 'drowning']
            }
        });
    });

    it('on attack increases drowning level and deals damage to left unit', function () {
        this.player2.attachPbUpgrade(this.drowning, this.coalRoarkwin); // drowning level 1
        spyOn(Dice, 'd12Roll').and.returnValue(3); // attack
        this.player1.endTurn();
        expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(1);
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.game.attackState.isPBAttack).toBe(true);
        expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(2);
        expect(this.anchornaut.damage).toBe(0);
        expect(this.fluteMage.damage).toBe(0);
        expect(this.hammerKnight.damage).toBe(2);

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });
});
