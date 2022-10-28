describe('Summon Ancestor Spirit', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: ['summon-ancestor-spirit'],
                dicepool: ['time', 'divine', 'sympathy'],
                archives: ['ancestor-spirit']
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

    it('say no to enters play effect', function () {
        this.player1.clickCard(this.summonAncestorSpirit);
        this.player1.clickPrompt('Summon Ancestor Spirit');
        expect(this.ancestorSpirit.location).toBe('play area');
        this.player1.clickNo();
        expect(this.player1).toHaveDefaultPrompt(); // no guidance prompt
    });

    it('say yes to enters play effect', function () {
        this.player1.clickCard(this.summonAncestorSpirit);
        this.player1.clickPrompt('Summon Ancestor Spirit');
        expect(this.ancestorSpirit.location).toBe('play area');
        this.player1.clickYes();
        expect(this.player1).toHavePrompt('Guidance');
    });
});
