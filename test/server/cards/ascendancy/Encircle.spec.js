describe('Encircle', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'issa-brightmore',
                inPlay: ['snapseed', 'snaptrap', 'anchornaut', 'mist-spirit'],
                dicepool: ['artifice', 'artifice', 'artifice', 'natural'],
                hand: ['barrier', 'encircle'],
                deck: ['molten-gold'],
                spellboard: ['summon-thunder-hulk']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['hammer-knight', 'mist-spirit', 'iron-worker'],
                dicepool: ['natural']
            }
        });
    });

    it('deal 1 damage for each unexhausted conji in play', function () {
        this.mistSpirit.exhaust();
        this.player1.play(this.encircle);
        this.player1.clickDie(0);
        this.player1.clickCard(this.hammerKnight);

        expect(this.hammerKnight.damage).toBe(2);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
