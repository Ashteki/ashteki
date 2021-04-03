describe('Shadow Strike reaction', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['seaside-raven', 'mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'illusion', 'charm'],
                hand: ['shadow-strike']
            }
        });
    });

    it('cant select attackers', function () {
        expect(this.fluteMage.tokens.damage).toBeUndefined();
        expect(this.seasideRaven.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.seasideRaven); // single attacker
        this.player1.clickPrompt('Done'); // done for attackers

        expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
        expect(this.player2).toBeAbleToSelect(this.shadowStrike);
        this.player2.clickCard(this.shadowStrike);
        expect(this.player2).toBeAbleToSelect(this.mistSpirit);
        expect(this.player2).not.toBeAbleToSelect(this.seasideRaven);
    });

    it('unit version', function () {
        expect(this.fluteMage.tokens.damage).toBeUndefined();
        expect(this.seasideRaven.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.seasideRaven); // single attacker

        expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
        expect(this.player2).toBeAbleToSelect(this.shadowStrike);
        this.player2.clickCard(this.shadowStrike);
        expect(this.player2).toBeAbleToSelect(this.mistSpirit);
        expect(this.player2).not.toBeAbleToSelect(this.seasideRaven);
    });
});
