describe('Summon Three Eyed Owl', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem'],
                    spellboard: ['summon-three-eyed-owl'],
                    dicepool: ['natural', 'divine', 'divine', 'charm'],
                    archives: ['three-eyed-owl', 'ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: ['anchornaut', 'hammer-knight', 'flute-mage']
                }
            });
        });

        it('should place a TEO into play', function () {
            this.player1.clickCard(this.summonThreeEyedOwl);
            this.player1.clickPrompt('Summon Three-Eyed Owl');

            expect(this.threeEyedOwl.location).toBe('play area');
        });
    });

});
