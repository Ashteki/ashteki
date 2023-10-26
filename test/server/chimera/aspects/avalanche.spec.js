const Dice = require('../../../../server/game/dice');

describe('Avalanche Reveal', function () {
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
                phoenixborn: 'frostwild-scourge',
                behaviour: 'scourge-behaviour',
                ultimate: 'scourge-ultimate',
                inPlay: [],
                deck: [],
                spellboard: [],
                threatZone: ['avalanche', 'rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });
    });

    it('lowers opponent dice when destroys attacking', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(5);  // reveal then attack
        expect(this.player1.dicepool[0].exhausted).toBe(false);
        this.player1.endTurn(); // adds RR because of threat
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        this.player1.clickCard(this.anchornaut); // blocker
        this.player1.clickCard(this.avalanche); // blocker
        this.player1.clickDone();

        this.player1.clickDie(0);

        expect(this.player1.dicepool[0].exhausted).toBe(true);
        expect(this.anchornaut.location).toBe('discard');

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });
});
