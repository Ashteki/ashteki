const Dice = require('../../../../server/game/dice');

describe('Frozen Feer In Play', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'solo',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'viros-s1',
                behaviour: 'viros-behaviour-1',
                ultimate: 'viros-ultimate-1',
                inPlay: ['frozen-fear'],
                deck: [],
                spellboard: [],
                threatZone: ['rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });

    });

    it('exhausts opponents phoenixborn when destroys attacking', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack, else reveal
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.frozenFear);
        this.player1.clickDone(); // guard
        expect(this.ironWorker.location).toBe('discard');
        expect(this.coalRoarkwin.exhaustion).toBe(1);

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });
});


