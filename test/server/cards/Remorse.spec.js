describe('Remorse', function () {
    describe('Remorse PvP', function () {
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

    describe('Remorse vs Chimera (Fatigued)', function () {
        describe('As reaction spell to attackers declared', function () {
            beforeEach(function () {
                this.setupTest({
                    mode: 'solo',
                    player1: {
                        phoenixborn: 'coal-roarkwin',
                        inPlay: ['anchornaut', 'hammer-knight'],
                        spellboard: [],
                        dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                        hand: ['summon-iron-rhino', 'remorse']
                    },
                    player2: {
                        dummy: true,
                        phoenixborn: 'viros-s1',
                        behaviour: 'viros-behaviour',
                        ultimate: 'viros-ultimate',
                        inPlay: ['iron-scales'],
                        deck: [],
                        spellboard: [],
                        threatZone: [],
                        dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                    }
                });
                this.player2.player.fatigued = true;
            });

            it('discards 2 cards then deals 2 damage', function () {
                const deckSize = this.player2.deck.length;
                expect(deckSize > 0).toBe(true);
                this.player1.endTurn();
                // this.player1.clickPrompt('Ok');

                // card played
                expect(this.player1).toHavePrompt('Any reactions to attackers being declared?');
                this.player1.clickCard(this.remorse);

                expect(this.player2.deck.length).toBe(deckSize - 2);
                expect(this.virosS1.damage).toBe(4); // 2 discard damage plus 2 for empty deck
            });
        });
    });
});
