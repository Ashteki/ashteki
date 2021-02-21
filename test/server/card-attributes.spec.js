describe('card attributes', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['anchornaut']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['river-skald', 'living-doll'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('should deal 1 damage to a target unit', function () {
        expect(this.summonButterflyMonk.magicCost).toBe(0);
        expect(this.riverSkald.magicCost).toBe(2);
        expect(this.anchornaut.magicCost).toBe(1);
        expect(this.hammerKnight.magicCost).toBe(3);
        expect(this.livingDoll.magicCost).toBe(2);
    });
});
