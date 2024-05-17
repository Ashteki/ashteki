describe('James Endersight', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'james-endersight',
                inPlay: ['hammer-knight'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['cover', 'molten-gold'],
                deck: [
                    'iron-worker',
                    'encore',
                    'purge',
                    'accelerate',
                    'regress',
                    'heal',
                    'refresh',
                    'safeguard'
                ]
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage']
            }
        });
    });

    it('convene with souls', function () {
        this.player1.clickCard(this.jamesEndersight); // use ability
        this.player1.clickPrompt('Convene With Souls');
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.location).toBe('hand');
        expect(this.jamesEndersight.damage).toBe(2);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('BUG: ability with empty deck caused error', function () {
        this.player1.player.deck = [];
        this.player1.clickCard(this.jamesEndersight); // use ability
        this.player1.clickPrompt('Convene With Souls');

        expect(this.jamesEndersight.damage).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('no allies in deck should shuffle', function () {
        this.player1.player.deck = [
            this.encore,
            this.purge,
            this.accelerate,
            this.regress,
            this.heal,
            this.refresh,
            this.safeguard
        ];

        expect(getCardOrder(this.player1.deck)).toBe('EPARHRS');

        this.player1.clickCard(this.jamesEndersight); // use ability
        this.player1.clickPrompt('Convene With Souls');

        expect(this.jamesEndersight.damage).toBe(0);

        expect(getCardOrder(this.player1.deck)).not.toBe('EPARHRS');

        expect(this.player1).toHaveDefaultPrompt();
    });

    function getCardOrder(cards) {
        return cards.reduce((agg, card) => agg + card.name[0], '');
    }
});
