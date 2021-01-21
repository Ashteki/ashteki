describe('To Shadows played', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'saria-guideman',
                inPlay: ['enchanted-violinist', 'mist-spirit'],
                dicepool: ['illusion'],
                hand: ['to-shadows']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'iron-worker']
            }
        });

        this.enchantedViolinist.tokens.exhaustion = 1;
        this.anchornaut.tokens.exhaustion = 1;
    });

    it('disard exhausted unit', function () {
        this.player1.clickCard(this.toShadows); // play card
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        expect(this.player1).toHavePrompt('Choose an exhausted unit to discard');

        expect(this.player1).toBeAbleToSelect(this.enchantedViolinist);
        expect(this.player1).toBeAbleToSelect(this.enchantedViolinist);
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
        expect(this.player1).not.toBeAbleToSelect(this.mistSpirit);

        this.player1.clickCard(this.enchantedViolinist);

        expect(this.toShadows.location).toBe('discard');
        expect(this.enchantedViolinist.location).toBe('discard');
    });
});
