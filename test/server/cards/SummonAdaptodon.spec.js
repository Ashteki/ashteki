describe('Summon Adaptodon', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem'],
                    spellboard: ['summon-adaptodon'],
                    dicepool: ['natural', 'divine', 'divine', 'charm'],
                    archives: ['adaptodon', 'ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: ['anchornaut', 'hammer-knight', 'flute-mage']
                }
            });
        });

        it('should place an Adaptodon into play', function () {
            this.player1.clickCard(this.summonAdaptodon);
            this.player1.clickPrompt('Summon Adaptodon');

            expect(this.adaptodon.location).toBe('play area');
        });
    });

});
