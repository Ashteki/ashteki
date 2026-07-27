const Dice = require('../../../../server/game/dice');

describe('Oppress In Play', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'dragonborn',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'hammer-knight', 'anchornaut'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'indiri-aldair',
                behaviour: 'scatha-behaviour',
                ultimate: 'indiri-ultimate',
                inPlay: ['oppress'],
                deck: [],
                spellboard: [],
                threatZone: ['rampage'],
                dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
            }
        });
    });

    it('exhaust leftmost unexhausted unit when destroys attacking', function () {
        this.hammerKnight.exhaust(); // leftmost after IW is killed
        spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        // attacks iron worker
        this.player1.clickDone(); // guard
        this.player1.clickNo(); // counter
        expect(this.ironWorker.location).toBe('discard'); // killed
        expect(this.anchornaut.location).toBe('play area');
        expect(this.anchornaut.exhausted).toBe(true);
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.hammerKnight.exhausted).toBe(true); // exhausted by oppress
    });
});
