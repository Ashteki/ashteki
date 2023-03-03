const Dice = require('../../../../server/game/dice');

describe('Dark descent', function () {
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
                phoenixborn: 'viros-s1',
                behaviour: 'viros-behaviour-1',
                ultimate: 'viros-ultimate-1',
                inPlay: ['dark-descent'],
                deck: [],
                spellboard: [],
                threatZone: ['rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });

    });

    it('on attack exhausts leftmost unit', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.game.attackState.isPBAttack).toBe(true);
        expect(this.anchornaut.exhausted).toBe(true);

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });

    it('on attack discards leftmost exhausted unit', function () {
        this.anchornaut.tokens.exhaustion = 1;
        spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.game.attackState.isPBAttack).toBe(true);
        expect(this.anchornaut.location).toBe('discard');

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });
});


