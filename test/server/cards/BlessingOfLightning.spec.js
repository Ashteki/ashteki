describe('Blessing of Lightning ', function () {
    describe('Action spell on play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit', 'anchornaut', 'flute-mage'],
                    dicepool: ['divine', 'charm', 'divine', 'divine'],
                    hand: ['blessing-of-lightning'],
                    discard: ['hammer-knight'],
                    spellboard: ['piercing-light']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });

            this.player1.dicepool[2].exhaust();
            this.player1.dicepool[3].exhaust();
        });

        it('Grants overkill to all divine buffed units', function () {
            this.player1.clickCard(this.blessingOfLightning);
            this.player1.clickPrompt('Play this action');

            expect(this.player1.dicepool.filter((d) => d.exhausted).length).toBe(3);
            // buff a unit
            this.player1.clickDie(0);
            this.player1.clickDie(2);
            this.player1.clickDone();

            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.fluteMage);

            expect(this.mistSpirit.attack).toBe(2);
            expect(this.mistSpirit.dieUpgrades.length).toBe(1);

            expect(this.anchornaut.attack).toBe(1);
            expect(this.anchornaut.dieUpgrades.length).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
