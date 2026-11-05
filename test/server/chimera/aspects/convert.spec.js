const Dice = require('../../../../server/game/dice');

describe('Convert In Play', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'chimera',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'corpse-of-viros',
                behaviour: 'viros-behaviour',
                ultimate: 'viros-ultimate',
                inPlay: ['convert'],
                deck: [],
                spellboard: [],
                threatZone: ['rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });
    });

    it('bug: damage on chimera when destroyed', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(1);
        this.convert.tokens.damage = 2;

        this.player1.clickAttack(this.convert);
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickOk(); // no guard
        this.player1.clickDone(); // aftershock
        expect(this.hammerKnight.damage).toBe(3);
        expect(this.convert.location).toBe('discard');
        expect(this.corpseOfViros.damage).toBe(2);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
