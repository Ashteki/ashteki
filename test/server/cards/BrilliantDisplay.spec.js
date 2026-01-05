describe('Brilliant Display', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'issa-brightmore',
                inPlay: ['flute-mage'],
                dicepool: ['artifice', 'artifice', 'artifice', 'natural'],
                hand: ['barrier', 'brilliant-display'],
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

    it('deal 1 damage for each artifice die on a card', function () {
        this.player1.attachDie(0, this.fluteMage);
        expect(this.fluteMage.isCharged).toBe(true);
        this.player1.attachDie(0, this.summonThunderHulk);
        expect(this.summonThunderHulk.isCharged).toBe(true);
        this.player1.attachDie(0, this.issaBrightmore);
        expect(this.issaBrightmore.isCharged).toBe(true);

        this.player1.play(this.brilliantDisplay);
        this.player1.clickDie(0);
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.hammerKnight);

        expect(this.hammerKnight.damage).toBe(2);
        expect(this.mistSpirit.location).toBe('archives');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
