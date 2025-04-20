describe('Molten Gold Action Spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit'],
                dicepool: ['natural', 'natural', 'illusion', 'charm'],
                spellboard: [],
                hand: ['molten-gold', 'golden-veil']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'iron-worker'],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'ceremonial'],
                hand: ['ice-trap', 'fire-archer']
            }
        });

        this.player1.dicepool[0].level = 'class';
        this.player1.dicepool[1].level = 'class';
    });

    it('two class cost to place wounds on target unit only', function () {
        this.player1.play(this.moltenGold);
        expect(this.player1).not.toBeAbleToSelect(this.coalRoarkwin);
        expect(this.player1).not.toBeAbleToSelect(this.aradelSummergaard);
        expect(this.player1).not.toBeAbleToSelect(this.mistSpirit);
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.location).toBe('discard');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
