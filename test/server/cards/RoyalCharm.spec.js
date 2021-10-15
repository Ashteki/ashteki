describe('Royal Charm', function () {
    describe('on dice spent', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['mist-spirit', 'enchanted-violinist'],
                    spellboard: ['royal-charm'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
            this.player1.dicepool[3].level = 'class';
        });

        it('use dice on card', function () {
            this.player1.play(this.enchantedViolinist);
            // unselect class die
            this.player1.clickDie(3);
            // select power die
            this.player1.clickDie(2);
            // choose die for royal charm
            this.player1.clickDie(2);

            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.royalCharm.hasModifiedAttack()).toBe(false);
            this.player1.clickCard(this.royalCharm);
            this.player1.clickPrompt('Use Die');
            this.player1.clickDieUpgrade(this.royalCharm, 0);

            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.dieUpgrades.length).toBe(1);
            expect(this.hammerKnight.attack).toBe(2);
        });

        it('allows overspend of charm dice for enchanted violinist', function () {
            this.player1.play(this.enchantedViolinist);
            // unselect class die
            this.player1.clickDie(3);
            // select power die
            this.player1.clickDie(2);
            // choose die for royal charm
            this.player1.clickDie(2);
            // check spellboard is still just 1
            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.player1.dicepool.length).toBe(3);
        });
    });
});
