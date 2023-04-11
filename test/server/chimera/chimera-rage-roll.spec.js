const Dice = require('../../../server/game/dice');

describe('Chimera Rage Roll', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'solo',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'viros-s1',
                behaviour: 'viros-behaviour',
                ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                inPlay: ['rampage'],
                deck: [],
                spellboard: [],
                threatZone: ['hunting-instincts'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });
        spyOn(Dice, 'd12Roll').and.returnValue(1);

        this.player2.dicepool[0].level = 'power';
        this.player2.dicepool[1].level = 'power';
        this.player2.dicepool[2].level = 'power';
        this.player2.dicepool[3].level = 'power';
        expect(this.huntingInstincts.facedown).toBe(true);
    });


    it('5 powers triggers red rains token', function () {
        // reveal
        spyOn(Dice, 'getRandomInt').and.returnValue(1);
        expect(this.huntingInstincts.facedown).toBe(true);
        this.player1.endTurn();
        // informs real player of behaviour roll

        expect(this.player2.dicepool.every(d => d.level === 'basic'));
        expect(this.player2.phoenixborn.redRains).toBe(1);
        this.player1.clickPrompt('Ok');

        expect(this.huntingInstincts.facedown).toBe(false);
        expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
    });

});
