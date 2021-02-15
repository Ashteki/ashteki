describe('Golden Veil', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['enchanted-violinist'],
                dicepool: ['ceremonial', 'natural', 'natural', 'charm'],
                hand: ['molten-gold', 'one-hundred-blades']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight', 'mist-spirit'],
                dicepool: ['charm', 'natural', 'illusion'],
                hand: ['vanish', 'anchornaut']
            }
        });
    });

    it('cancels one hundred blades', function () {
        this.player1.clickCard(this.oneHundredBlades);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.rinNorthfell);

        expect(this.player2).toHavePrompt('Any Interrupts to one hundred blades?');
        this.player2.clickCard(this.vanish);

        expect(this.rinNorthfell.damage).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('cancels molten gold on phoenixborn', function () {
        this.player1.clickCard(this.moltenGold);
        this.player1.clickPrompt('Play this action');
        this.player1.clickCard(this.rinNorthfell);

        expect(this.player2).toHavePrompt('Any Interrupts to molten gold?');
        this.player2.clickCard(this.vanish);

        expect(this.rinNorthfell.damage).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('cancels song of sorrow part 2', function () {
        const handSize = this.player2.hand.length;
        this.player1.clickCard(this.enchantedViolinist);
        this.player1.clickPrompt('Song Of Sorrow');
        this.player1.clickCard(this.mistSpirit);
        expect(this.mistSpirit.location).toBe('archives');

        expect(this.player2).toHavePrompt('Any Interrupts?');
        this.player2.clickCard(this.vanish);

        expect(this.rinNorthfell.damage).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.player2.hand.length).toBe(handSize - 1);
    });
});
