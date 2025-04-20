describe('Darkwater Hunter', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                dicepool: ['natural', 'natural', 'time', 'time'],
                deck: ['anchornaut'],
                hand: ['darkwater-hunter', 'one-hundred-blades']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                spellboard: ['chant-of-revenge']
            }
        });
    });

    it('play when pb wounded by one hundred blades', function () {
        this.player1.play(this.oneHundredBlades);
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDone();
        this.player1.clickCard(this.aradelSummergaard);
        // reaction
        this.player1.clickCard(this.darkwaterHunter);

        expect(this.darkwaterHunter.location).toBe('play area');
        expect(this.player1.dicepool[2].exhausted).toBe(true);
        expect(this.player1.dicepool[3].exhausted).toBe(true);
    });
});
