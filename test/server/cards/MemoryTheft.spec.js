describe('Memory Theft', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                spellboard: ['memory-theft']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['empower', 'law-of-grace']
            }
        });
    });

    it('damage option taken deals wounds, ignores law of grace', function () {
        this.player1.clickCard(this.memoryTheft);
        this.player1.clickPrompt('Memory Theft');

        this.player2.clickPrompt('damage');
        expect(this.aradelSummergaard.damage).toBe(1);
    });
});
