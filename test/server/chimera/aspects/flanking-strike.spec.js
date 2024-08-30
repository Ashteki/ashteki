const Dice = require('../../../../server/game/dice');

describe('Flanking Strike In Play', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'solo',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'hammer-knight', 'anchornaut'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'corpse-of-viros',
                behaviour: 'viros-behaviour',
                ultimate: 'viros-ultimate',
                inPlay: ['flanking-strike'],
                deck: [],
                spellboard: [],
                threatZone: ['rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });
    });

    it('destroys leftmost unit when destroys attacking', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack, else reveal
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        this.player1.clickDone(); // guard
        this.player1.clickNo(); // counter
        expect(this.anchornaut.location).toBe('discard'); // killed by attack
        expect(this.ironWorker.location).toBe('discard'); // destroyed
        expect(this.hammerKnight.location).toBe('play area');

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });
});
