describe('Enchanted Violinist song of sorrow', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['enchanted-violinist'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: []
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('should deal 1 damage to a target unit', function () {
        expect(this.blueJaguar.tokens.damage).toBeUndefined();

        this.player1.clickCard(this.enchantedViolinist);
        this.player1.clickPrompt('Song of Sorrow');
        this.player1.clickCard(this.blueJaguar);

        expect(this.blueJaguar.tokens.damage).toBe(1);
    });

    it('should discard 1 top of deck if target is destroyed', function () {
        expect(this.mistSpirit.tokens.damage).toBeUndefined();
        let deckSize = this.player2.deck.length;

        this.player1.clickCard(this.enchantedViolinist);
        this.player1.clickPrompt('Song of Sorrow');
        this.player1.clickCard(this.mistSpirit);

        expect(this.mistSpirit.location).toBe('archives');
        expect(this.player2.deck.length).toBe(deckSize - 1);
    });
});
