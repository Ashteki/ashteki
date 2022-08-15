describe('Darkwater Hunter', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'orrick-gilstream',
                inPlay: ['flute-mage'],
                dicepool: ['natural', 'natural', 'time', 'time'],
                deck: ['anchornaut'],
                hand: ['darkwater-hunter', 'molten-gold']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                spellboard: ['chant-of-revenge']
            }
        });
    });

    it('play when pb wounded by molten gold', function () {
        this.player1.play(this.moltenGold);
        this.player1.clickCard(this.aradelSummergaard);
        // reaction
        this.player1.clickCard(this.darkwaterHunter);

        expect(this.darkwaterHunter.location).toBe('play area');
        expect(this.player1.dicepool[2].exhausted).toBe(true);
        expect(this.player1.dicepool[3].exhausted).toBe(true);
    });
});
