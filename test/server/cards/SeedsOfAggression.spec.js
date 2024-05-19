describe('Seeds of Aggression', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker', 'flute-mage', 'silver-paladin'],
                dicepool: ['charm', 'charm', 'divine'],
                hand: ['seeds-of-aggression', 'pride']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight', 'gilder', 'mist-spirit'],
                spellboard: []
            }
        });
    });

    it('chosen units deal attack damage to each other', function () {
        this.player1.play(this.seedsOfAggression);
        this.player1.clickCard(this.fluteMage);

        this.player1.clickCard(this.hammerKnight);

        expect(this.hammerKnight.damage).toBe(1);
        expect(this.fluteMage.location).toBe('discard');
    });

    it('silver paladin should trigger exalt', function () {
        this.player1.dicepool[2].exhausted = true;

        this.player1.play(this.seedsOfAggression);
        this.player1.clickCard(this.silverPaladin);

        this.player1.clickCard(this.mistSpirit);

        expect(this.silverPaladin.damage).toBe(1);

        expect(this.player1).not.toHaveDefaultPrompt(); // should trigger exalt

        this.player1.clickDie(2);
        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.attack).toBe(3);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.mistSpirit.location).toBe('archives');
    });
});
