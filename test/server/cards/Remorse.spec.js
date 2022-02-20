describe('Remorse', function () {
    describe('As reaction spell to attackers declared', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    archives: ['butterfly-monk'],
                    deck: ['outmatch', 'golden-veil']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'string-mage'],
                    spellboard: [],
                    hand: ['remorse'],
                    dicepool: ['charm', 'illusion']
                }
            });

            this.player1.player.deck = [this.outmatch, this.goldenVeil];
        });

        it('discards 2 cards then deals 2 damage', function () {
            const deckSize = this.player1.deck.length;
            expect(deckSize).toBe(2);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.fluteMage); // target
            this.player1.clickCard(this.ironWorker); // single attacker

            // card played
            expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
            this.player2.clickCard(this.remorse);

            expect(this.player1.deck.length).toBe(0);
            expect(this.aradelSummergaard.damage).toBe(2);
        });

        it('with empty deck just deals 2 damage', function () {
            this.player1.player.deck = [];

            const deckSize = this.player1.deck.length;
            expect(deckSize).toBe(0);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.fluteMage); // target
            this.player1.clickCard(this.ironWorker); // single attacker

            // card played
            expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
            this.player2.clickCard(this.remorse);

            expect(this.player1.deck.length).toBe(0);
            expect(this.aradelSummergaard.damage).toBe(2);
        });
    });
});
