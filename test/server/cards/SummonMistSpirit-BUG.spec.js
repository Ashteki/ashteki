describe('Summon Mist Spirit Bug', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: [],
                spellboard: ['summon-mist-spirit'],
                dicepool: ['illusion', 'natural', 'charm', 'charm'],
                archives: ['mist-spirit', 'mist-spirit']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: []
            }
        });
    });

    it('should trigger class die requirement when only power in hand', function () {
        this.player1.clickCard(this.summonMistSpirit);
        this.player1.clickPrompt('Summon Mist Spirit');
        this.player1.clickCard('mist-spirit');

        // check spellboard is still just 1
        expect(this.player1.spellboard.length).toBe(1);
        // Butterfly monk is now on the battlefield
        expect(this.player1.inPlay.length).toBe(1);
    });

    it('should trigger class die requirement', function () {
        this.player1.dicepool[0].lower();
        expect(this.player1.dicepool[0].level).toBe('class');
        this.player1.clickCard(this.summonMistSpirit);
        this.player1.clickPrompt('Summon Mist Spirit');
        this.player1.clickCard('mist-spirit');

        // check spellboard is still just 1
        expect(this.player1.spellboard.length).toBe(1);
        // Butterfly monk is now on the battlefield
        expect(this.player1.inPlay.length).toBe(1);
    });
});
