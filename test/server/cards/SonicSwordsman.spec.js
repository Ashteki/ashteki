describe('Sonic Swordsman', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['seaside-raven', 'sonic-swordsman'],
                dicepool: ['natural']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['mist-spirit', 'living-doll']
            }
        });
    });

    it('Sonic Pulse triggers after destroying a unit', function () {
        expect(this.sonicSwordsman.exhausted).toBe(false);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.sonicSwordsman);

        this.player2.clickPrompt('Done'); // no blocker
        this.player2.clickPrompt('No'); // no counter

        expect(this.player1).toHavePrompt('Sonic Pulse 1');
        this.player1.clickCard(this.livingDoll);

        expect(this.player1).toHaveDefaultPrompt();

        expect(this.mistSpirit.location).toBe('archives');
        expect(this.sonicSwordsman.exhausted).toBe(true); // he attacked
        expect(this.livingDoll.exhausted).toBe(true); // he attacked
    });
});
