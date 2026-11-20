describe('Overg=charged Growth', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['illusion', 'natural', 'natural'],
                spellboard: ['strengthen'],
                hand: ['overcharged-growth', 'crystal-shield'],
                inPlay: ['anchornaut']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['flute-mage', 'frost-fang', 'hammer-knight', 'butterfly-monk'],
                dicepool: ['illusion', 'natural', 'natural'],
                spellboard: ['body-inversion'],
                hand: ['crystal-shield']
            }
        });
    });

    it('attached, attacker cannot be blocked by attack or life value 1 or less', function () {
        this.player1.attachUpgrade(this.overchargedGrowth, this.anchornaut);
        expect(this.anchornaut.attack).toBe(1);
        expect(this.anchornaut.life).toBe(2);
        expect(this.anchornaut.recover).toBe(2);

        this.player1.clickAttack(this.maeoniViper);
        this.player1.clickCard(this.anchornaut);
        this.player1.clickDone();

        expect(this.player2).not.toBeAbleToSelect(this.fluteMage);
        expect(this.player2).not.toBeAbleToSelect(this.frostFang);
        expect(this.player2).toBeAbleToSelect(this.hammerKnight);
    });

    it('attached, attacker cannot be guarded by attack or life value 1 or less', function () {
        this.player1.attachUpgrade(this.overchargedGrowth, this.anchornaut);
        expect(this.anchornaut.attack).toBe(1);
        expect(this.anchornaut.life).toBe(2);
        expect(this.anchornaut.recover).toBe(2);

        this.player1.clickAttack(this.hammerKnight);
        this.player1.clickCard(this.anchornaut);

        expect(this.player2).not.toBeAbleToSelect(this.butterflyMonk);
    });
});
