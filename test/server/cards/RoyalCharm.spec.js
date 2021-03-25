describe('Royal Charm', function () {
    describe('on dice spent', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['mist-spirit', 'enchanted-violinist'],
                    spellboard: ['royal-charm'],
                    dicepool: ['natural', 'natural', 'charm', 'divine'],
                    archives: ['butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should give my units armour 1', function () {
            this.player1.play(this.enchantedViolinist);

            // check spellboard is still just 1
            expect(this.royalCharm.status).toBe(1);
        });
    });
});
