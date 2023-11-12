const Dice = require('../../../../server/game/dice');

describe('Sweeping Strike Aspect', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'solo',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight', 'iron-rhino', 'anchornaut'],
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
                threatZone: ['sweeping-strike', 'rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });
    });

    it('force 3 wounds when destroys attacking', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(5); // reveal then attack
        expect(this.player1.dicepool[0].exhausted).toBe(false);
        this.player1.endTurn(); // adds RR because of threat
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');
        this.player1.clickDone(); // no guard
        this.player1.clickYes(); // counter
        // anchornaut destroyed -~> X x 1 damage to pb or rightmost
        expect(this.anchornaut.moribund).toBe(true);

        expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);
        expect(this.player1).not.toBeAbleToSelect(this.rampage);
        expect(this.player1).not.toBeAbleToSelect(this.anchornaut);

        expect(this.player1).toBeAbleToSelect(this.ironRhino);
        expect(this.player1).toBeAbleToSelect(this.coalRoarkwin);
        this.player1.clickCard(this.ironRhino);
        this.player1.clickCard(this.coalRoarkwin);
        this.player1.clickCard(this.ironRhino);

        expect(this.ironRhino.damage).toBe(2);
        expect(this.coalRoarkwin.damage).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();

        expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
    });
});
