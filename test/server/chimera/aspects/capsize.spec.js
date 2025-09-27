const Dice = require('../../../../server/game/dice');

describe('Capsize Aspect', function () {
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
                inPlay: ['capsize'],
                deck: [],
                spellboard: [],
                threatZone: [],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });
    });

    it('lower all active dice when destroys attacking', function () {
        this.player1.dicepool[0].exhaust();
        expect(this.player1.dicepool[0].exhausted).toBe(true);
        this.player1.dicepool[1].level = 'class';
        this.player1.dicepool[2].level = 'basic';

        this.player1.endTurn();

        // attack
        this.player1.clickDone(); // no guard
        this.player1.clickYes(); // counter
        // anchornaut destroyed
        expect(this.anchornaut.location).toBe('discard');
        expect(this.player1.dicepool[0].level).toBe('power');
        expect(this.player1.dicepool[1].level).toBe('basic');
        expect(this.player1.dicepool[2].level).toBe('basic');
        expect(this.player1.dicepool[3].level).toBe('class');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
