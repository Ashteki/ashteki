describe('Nightshade Swallow', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['seaside-raven', 'sonic-swordsman'],
                dicepool: ['natural']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['nightshade-swallow', 'living-doll']
            }
        });
    });

    it('triggers when destroyed. Exhaust a unit', function () {
        expect(this.seasideRaven.exhausted).toBe(false);

        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickPrompt('Water Blast');
        this.player1.clickCard(this.nightshadeSwallow);

        this.player2.clickCard(this.seasideRaven);

        expect(this.nightshadeSwallow.location).toBe('archives');
        expect(this.seasideRaven.exhausted).toBe(true);
    });

    it('triggers when destroyed. Exhaust sonic swordsman to prevent sonic pulse', function () {
        expect(this.sonicSwordsman.exhausted).toBe(false);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.nightshadeSwallow);
        this.player1.clickCard(this.sonicSwordsman);

        this.player2.clickPrompt('Done'); // no blocker
        this.player2.clickPrompt('No'); // no counter

        expect(this.player2).toHavePrompt('Pacify 1');
        this.player2.clickCard(this.sonicSwordsman);

        expect(this.player1).toHaveDefaultPrompt();

        expect(this.nightshadeSwallow.location).toBe('archives');
        expect(this.sonicSwordsman.exhausted).toBe(true); // he attacked
        expect(this.livingDoll.exhausted).toBe(false); // he attacked
    });
});
