describe('Frost frog attack', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['frost-frog', 'iron-worker', 'mist-spirit'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: ['molten-gold'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage', 'anchornaut']
            }
        });
    });

    it('choose to buff attack by 1', function () {
        this.player1.clickAttack(this.fluteMage);
        this.player1.clickCard(this.frostFrog);
        this.player1.clickPrompt('+1 Attack');

        expect(this.frostFrog.attack).toBe(2); // +1 attack
    });

    it('choose to do the other thing', function () {
        this.player1.clickAttack(this.fluteMage);
        this.player1.clickCard(this.frostFrog);
        this.player1.clickPrompt('Exhaust');

        expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
        expect(this.player1).not.toBeAbleToSelect(this.mistSpirit);
        expect(this.player1).toBeAbleToSelect(this.anchornaut);

        this.player1.clickCard(this.anchornaut);

        expect(this.frostFrog.attack).toBe(1); // +1 attack
        expect(this.anchornaut.exhausted).toBe(true);
    });
});
