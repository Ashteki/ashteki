describe('Reconfigure', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'issa-brightmore',
                inPlay: ['flute-mage', 'thunder-hulk'],
                dicepool: ['artifice', 'artifice', 'artifice', 'natural'],
                hand: ['barrier', 'reconfigure'],
                deck: ['molten-gold'],
                spellboard: ['summon-thunder-hulk', 'summon-spark-drone']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['hammer-knight', 'mist-spirit', 'iron-worker'],
                dicepool: ['natural']
            }
        });
    });

    it('move an artifice die from ready spell to pb', function () {
        this.player1.attachDie(0, this.fluteMage);
        expect(this.fluteMage.isCharged).toBe(true);
        this.player1.attachDie(0, this.summonThunderHulk);
        expect(this.summonThunderHulk.isCharged).toBe(true);

        this.player1.play(this.reconfigure);
        this.player1.clickDieUpgrade(this.summonThunderHulk, 0);
        this.player1.clickCard(this.issaBrightmore);

        expect(this.summonThunderHulk.isCharged).toBe(false);
        expect(this.issaBrightmore.isCharged).toBe(true);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('move an artifice die from pb to unit', function () {
        this.player1.attachDie(0, this.issaBrightmore);
        expect(this.issaBrightmore.isCharged).toBe(true);
        this.player1.attachDie(0, this.summonThunderHulk);
        expect(this.summonThunderHulk.isCharged).toBe(true);

        this.player1.play(this.reconfigure);
        expect(this.player1).toBeAbleToSelectDie(this.issaBrightmore.dieUpgrades[0]);
        this.player1.clickDieUpgrade(this.issaBrightmore, 0);
        this.player1.clickCard(this.thunderHulk);

        expect(this.thunderHulk.isCharged).toBe(true);
        expect(this.issaBrightmore.isCharged).toBe(false);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('move an artifice die from unit to ready spell', function () {
        this.player1.attachDie(0, this.issaBrightmore);
        expect(this.issaBrightmore.isCharged).toBe(true);
        this.player1.attachDie(0, this.thunderHulk);
        expect(this.thunderHulk.isCharged).toBe(true);

        this.player1.play(this.reconfigure);
        this.player1.clickDieUpgrade(this.thunderHulk, 0);
        this.player1.clickCard(this.summonThunderHulk);

        expect(this.thunderHulk.isCharged).toBe(false);
        expect(this.summonThunderHulk.isCharged).toBe(true);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
