describe('Royal Charm', function () {
    describe('on dice spent', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['mist-spirit', 'enchanted-violinist', 'rayward-recruit'],
                    spellboard: ['royal-charm', 'piercing-light'],
                    dicepool: ['divine', 'natural', 'charm', 'charm'],
                    archives: ['butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'holy-knight'],
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
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.dieUpgrades.length).toBe(1);
            expect(this.hammerKnight.attack).toBe(2);
        });

        it('use dice on card targetting holy knight', function () {
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
            this.player1.clickCard(this.holyKnight);
            expect(this.holyKnight.dieUpgrades.length).toBe(1);
            expect(this.holyKnight.attack).toBe(2);
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

        it('hosted dice clicks should trigger card ability not dice power', function () {
            this.player1.play(this.enchantedViolinist);
            // unselect class die
            this.player1.clickDie(3);
            // select power die
            this.player1.clickDie(2);
            // choose die for royal charm
            this.player1.clickDie(2);

            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.royalCharm.hasModifiedAttack()).toBe(false);

            this.player1.clickDieUpgrade(this.royalCharm, 0);
            this.player1.clickPrompt('Use Die');
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.dieUpgrades.length).toBe(1);
            expect(this.hammerKnight.attack).toBe(2);
        });

        it('piercing light does not effect RC with divine die', function () {
            this.player1.play(this.raywardRecruit);
            this.player1.clickDie(0);
            this.player1.clickDone(); // choose dice
            // RC select
            this.player1.clickDie(0);

            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.royalCharm.hasModifiedAttack()).toBe(false);
            expect(this.royalCharm.hasKeyword('overkill')).toBe(false);

            this.player1.clickDieUpgrade(this.royalCharm, 0);
            this.player1.clickPrompt('Use Die');
            this.player1.clickCard(this.raywardRecruit);
            expect(this.raywardRecruit.dieUpgrades.length).toBe(1);
            expect(this.raywardRecruit.attack).toBe(1);
        });
    });
});
