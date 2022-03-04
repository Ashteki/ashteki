describe('Dreamlock Mage', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['dreamlock-mage'],
                dicepool: ['illusion', 'illusion', 'charm', 'charm'],
                spellboard: []
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight', 'mist-spirit'],
                spellboard: [],
                hand: ['rins-fury', 'shatter-pulse'],
                dicepool: ['sympathy', 'nature']
            }
        });
        this.player2.dicepool[0].level = 'class';
    });

    it("changes one of the opponent's dice", function () {
        this.player1.clickCard(this.dreamlockMage);
        this.player1.clickPrompt('Restrict 1');
        //can't lower a class die
        expect(this.player1).not.toBeAbleToSelectDie(this.player2.dicepool[0]);

        //can lower a power die
        this.player1.clickOpponentDie(1);
        expect(this.player2.dicepool[1].level).toBe('class');
    });

    it("can't change one of the opponent's dice if none are on power side", function () {
        this.player2.dicepool[1].level = 'basic';
        this.player1.clickCard(this.dreamlockMage);
        expect(this.player1).not.toHavePrompt('Restrict 1');
    });
});
