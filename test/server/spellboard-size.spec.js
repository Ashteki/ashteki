describe('When Spellboard is full', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: [
                    'summon-butterfly-monk',
                    'abundance',
                    'summon-gilder',
                    'summon-iron-rhino'
                ],
                hand: ['summon-masked-wolf', 'summon-gilder', 'resonance'],
                dicepool: ['natural', 'natural', 'sympathy', 'sympathy', 'illusion', 'charm']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['anchornaut']
            }
        });
    });

    it('can play an existing spell', function () {
        const secondSummonGilder = this.player1.hand[1];
        expect(this.player1).toBeAbleToPlayFromHand('summon-gilder');
        this.player1.play(secondSummonGilder);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('can play resonance', function () {
        expect(this.player1).toBeAbleToPlayFromHand('resonance');
        this.player1.play(this.resonance);
        this.player1.clickDie(0);
        this.player1.clickDone();
        expect(this.resonance.location).toBe('spellboard');
    });

    it('cannot play a new spell', function () {
        this.player1.play(this.summonMaskedWolf);
        this.player1.clickYes(); // warning
        this.player1.clickDie(0);
        this.player1.clickDone();
        expect(this.summonMaskedWolf.location).toBe('discard');
    });
});
