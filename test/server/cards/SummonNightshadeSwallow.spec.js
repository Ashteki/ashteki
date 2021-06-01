describe('Summon Nightshade Swallow', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-nightshade-swallow'],
                    dicepool: ['charm', 'charm', 'natural', 'natural'],
                    archives: ['nightshade-swallow']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a swallow', function () {
            this.player1.clickCard(this.summonNightshadeSwallow);
            this.player1.clickPrompt('Summon Nightshade Swallow');
        });
    });

    describe('Focus 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-nightshade-swallow', 'summon-nightshade-swallow'],
                    dicepool: ['charm', 'charm', 'natural', 'natural'],
                    archives: ['nightshade-swallow']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['charm', 'charm', 'natural', 'natural', 'natural', 'natural']
                }
            });
        });

        it('should place a swallow and mill 1', function () {
            let deckSize = this.player2.deck.length;
            this.player1.clickCard(this.summonNightshadeSwallow);
            this.player1.clickPrompt('Summon Nightshade Swallow');

            this.player1.clickPrompt('Yes');

            expect(this.player2.deck.length).toBe(deckSize - 1);
        });
    });

    describe('Focus 1 when battlefield full', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-nightshade-swallow', 'summon-nightshade-swallow'],
                    dicepool: ['charm', 'charm', 'natural', 'natural'],
                    archives: ['nightshade-swallow'],
                    inPlay: [
                        'anchornaut',
                        'anchornaut',
                        'anchornaut',
                        'anchornaut',
                        'anchornaut',
                        'anchornaut',
                        'anchornaut',
                        'anchornaut'
                    ]
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['charm', 'charm', 'natural', 'natural', 'natural', 'natural']
                }
            });
        });

        it('should mill 1', function () {
            let deckSize = this.player2.deck.length;
            this.player1.clickCard(this.summonNightshadeSwallow);
            this.player1.clickPrompt('Summon Nightshade Swallow');

            this.player1.clickPrompt('Yes');

            expect(this.player2.deck.length).toBe(deckSize - 1);
        });
    });
});
