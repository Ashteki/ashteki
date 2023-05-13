const Dice = require('../../../../server/game/dice');

describe('Hunting Instincts Reveal', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'solo',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['shatter-pulse', 'summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'viros-s1',
                behaviour: 'viros-behaviour',
                ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                inPlay: [],
                deck: [],
                spellboard: [],
                threatZone: ['hunting-instincts', 'rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });

    });

    it('puts card into play with no status', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(1);        // reveal

        expect(this.huntingInstincts.facedown).toBe(true);
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.huntingInstincts.facedown).toBe(false);
        expect(this.huntingInstincts.status).toBe(0);

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });

    it('adds red rains token when destroys attacking', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(5);  // reveal then attack
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        // 
        this.player1.clickDone(); // guard
        this.player1.clickYes(); // counter
        expect(this.anchornaut.location).toBe('discard');
        expect(this.virosS1.redRains).toBe(1);

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });
});


