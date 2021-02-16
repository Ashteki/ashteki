describe('Strange Copy reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'iron-worker', 'iron-rhino'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: ['butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                hand: ['strange-copy'],
                dicepool: ['illusion']
            }
        });
    });

    it('can be played when an opponent declares attackers', function () {
        expect(this.fluteMage.tokens.damage).toBeUndefined;

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.ironWorker); // single attacker

        expect(this.player2).toBeAbleToSelect(this.strangeCopy);

        this.player2.clickCard(this.strangeCopy); // guard with pb
        this.player2.clickDie(0);

        expect(this.player2).toBeAbleToSelect(this.ironRhino);
        this.player2.clickCard(this.ironRhino); // click cover to play as reaction
        this.player2.clickCard(this.fluteMage); // target

        // card played
        expect(this.strangeCopy.location).toBe('discard');
        expect(this.fluteMage.attack).toBe(7);
        expect(this.fluteMage.life).toBe(4);
        expect(this.fluteMage.recover).toBe(1);

        // add further tests for abilities etc
    });
});
