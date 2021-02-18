describe('Blood Chains', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                hand: ['blood-chains']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit'],
                spellboard: []
            }
        });
    });

    it('should destroy my unit, and exhaust another', function () {
        expect(this.mistSpirit.tokens.exhaustion).toBeUndefined();

        this.player1.clickCard(this.bloodChains);
        this.player1.clickPrompt('Play this action');
        this.player1.clickCard(this.ironWorker); // destroy my unit
        this.player1.clickCard(this.mistSpirit); // exhaust ms

        expect(this.mistSpirit.tokens.exhaustion).toBe(1);
    });

    it('should destroy my wounded unit, and double exhaust another', function () {
        this.ironWorker.tokens.damage = 1;
        expect(this.mistSpirit.tokens.exhaustion).toBeUndefined();

        this.player1.clickCard(this.bloodChains);
        this.player1.clickPrompt('Play this action');
        this.player1.clickCard(this.ironWorker); // destroy my unit
        this.player1.clickCard(this.mistSpirit); // exhaust ms

        expect(this.mistSpirit.tokens.exhaustion).toBe(2);
    });
});
