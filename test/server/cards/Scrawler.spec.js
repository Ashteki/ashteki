describe('Scrawler', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight', 'scrawler'],
                spellboard: ['summon-scrawler'],
                dicepool: ['natural', 'sympathy', 'time', 'charm'],
                hand: ['shroud', 'purge'],
                archives: ['scrawler', 'fox-spirit']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman']
            }
        });
    });

    it('enters play exhausts target', function () {
        this.player1.clickCard(this.summonScrawler);
        this.player1.clickPrompt('Summon Scrawler');
        this.player1.clickDie(0);
        expect(this.player1).not.toBeAbleToSelect(this.ironRhino);
        expect(this.player1).toBeAbleToSelect(this.fluteMage);
        this.player1.clickCard(this.fluteMage);

        expect(this.fluteMage.exhausted).toBeTrue();

        expect(this.player1).toHaveDefaultPrompt();
    });
});
