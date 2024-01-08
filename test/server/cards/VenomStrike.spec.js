describe('Venom Strike action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['silver-snake', 'mist-spirit'],
                dicepool: ['divine', 'charm', 'charm'],
                hand: ['venom-strike']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut', 'iron-worker', 'butterfly-monk'],
                spellboard: [],
                deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
            }
        });
    });

    it('2 charmed units causes 2 pb damage and mill 2', function () {
        const deckSize = this.player2.deck.length;
        this.player1.player.actions.side = 2;
        this.player1.useDie(1);
        this.player1.clickCard(this.ironWorker);
        this.player1.useDie(1); // now the last in the array
        this.player1.clickCard(this.butterflyMonk);
        this.butterflyMonk.tokens.exhaustion = 1;
        expect(this.ironWorker.exhausted).toBe(false);
        expect(this.butterflyMonk.exhausted).toBe(true);
        expect(this.butterflyMonk.dieUpgrades.length).toBe(1);

        this.player1.play(this.venomStrike);
        this.player1.clickDie(0);
        expect(this.aradelSummergaard.damage).toBe(2);
        expect(this.player2.deck.length).toBe(deckSize - 2);

        expect(this.player2.charmedUnits.length).toBe(1);
        expect(this.player1.dicepool.length).toBe(2);
        expect(this.player1.dicepool[0].exhausted).toBe(true);
        expect(this.player1.dicepool[1].exhausted).toBe(true);
        expect(this.butterflyMonk.dieUpgrades.length).toBe(0);
        expect(this.ironWorker.dieUpgrades.length).toBe(1);
    });
});
