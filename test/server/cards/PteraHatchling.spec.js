describe('Shock ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['ptera-hatchling', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'divine', 'time', 'charm'],
                hand: ['molten-gold'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage', 'hammer-knight']
            }
        });
    });

    it('does not trigger without attack mod', function () {
        this.player1.clickAttack(this.fluteMage);
        this.player1.clickCard(this.pteraHatchling);

        expect(this.player1).toHavePrompt('waiting for opponent to guard');
    });

    it('with attack mod triggers ping', function () {
        this.player1.clickDie(1);
        this.player1.clickPrompt('Divine Dice Power');
        this.player1.clickCard(this.pteraHatchling);
        expect(this.pteraHatchling.attack).toBe(1);

        this.player1.clickAttack(this.fluteMage);
        this.player1.clickCard(this.pteraHatchling);

        expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
        this.player1.clickCard(this.hammerKnight);
        expect(this.hammerKnight.damage).toBe(1); // ping

        expect(this.player1).toHavePrompt('waiting for opponent to guard');
    });
});
