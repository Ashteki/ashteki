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

        it('option to attach to royal charm', function () {
            this.player1.play(this.enchantedViolinist);
            this.player1.clickDie(2);
            // check spellboard is still just 1
            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.player1.dicepool.length).toBe(3);
        });
    });
});
