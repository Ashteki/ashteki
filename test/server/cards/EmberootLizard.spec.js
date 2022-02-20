describe('Ignite ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['emberoot-lizard', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: ['molten-gold'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage', 'mist-spirit']
            }
        });
    });

    it('No status token does not trigger', function () {
        this.player1.clickAttack(this.fluteMage);
        this.player1.clickCard(this.emberootLizard);

        expect(this.player1).toHavePrompt('waiting for opponent to guard');
    });

    it('With status token adds attack and pings', function () {
        this.emberootLizard.tokens.status = 1;

        this.player1.clickAttack(this.fluteMage);
        this.player1.clickCard(this.emberootLizard);

        expect(this.player1).not.toHavePrompt('waiting for opponent to guard');
        expect(this.emberootLizard.attack).toBe(1); // +1 attack

        this.player1.clickCard(this.fluteMage);
        expect(this.fluteMage.damage).toBe(1); // ping

        expect(this.player1).toHavePrompt('waiting for opponent to guard');
    });

    it('Exhausts when it pings and destroys its own target', function () {
        this.emberootLizard.tokens.status = 1;

        this.player1.clickAttack(this.mistSpirit);
        this.player1.clickCard(this.emberootLizard);

        expect(this.player1).not.toHavePrompt('waiting for opponent to guard');
        expect(this.emberootLizard.attack).toBe(1); // +1 attack

        this.player1.clickCard(this.mistSpirit);
        expect(this.mistSpirit.location).toBe('archives'); // ping

        expect(this.emberootLizard.exhausted).toBe(true);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
