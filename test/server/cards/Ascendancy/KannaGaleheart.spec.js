describe('Aeromancy', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'kanna-galeheart',
                inPlay: ['flute-mage'],
                dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                spellboard: ['reinforce'],
                archives: ['the-awakened-state'],
                deck: [
                    'anchornaut',
                    'recollect',
                    'searing-bolt',
                    'hammer-knight',
                    'rayward-knight'
                ],
                discard: ['concentration', 'concentration']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['natural'],
                inPlay: ['iron-worker'],
                spellboard: ['chant-of-revenge']
            }
        });
    });

    it('take an action spell to hand, but not allow ally', function () {
        this.player1.clickCard(this.kannaGaleheart);
        this.player1.clickPrompt('Aeromancy');
        this.player1.clickPrompt('anchornaut');
        expect(this.anchornaut.location).toBe('deck');
        this.player1.clickPrompt('searing bolt');
        expect(this.searingBolt.location).toBe('hand');

        expect(this.player1).toHaveDefaultPrompt();
    });
});
