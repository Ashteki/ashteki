describe('Silver Paladin', function () {
    describe('Enters play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['hammer-knight'],
                    dicepool: ['divine', 'divine', 'charm', 'ceremonial'],
                    hand: ['glory-aspirant', 'silver-paladin'],
                    discard: ['radiant-light', 'anchornaut'],
                    deck: ['purge', 'chant-of-sacrifice']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker', 'mist-spirit'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('smite 1 destroys a unit of 1 life or less, then Exhalt smuggles a die', function () {
            this.player1.clickCard(this.silverPaladin);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickDone();
            expect(this.silverPaladin.location).toBe('play area');

            expect(this.player1).toBeAbleToSelect(this.mistSpirit);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.mistSpirit);

            // exhalt
            this.player1.clickDie(0); // divine?
            this.player1.clickCard(this.hammerKnight);

            expect(this.mistSpirit.location).toBe('archives');
            expect(this.hammerKnight.dieUpgrades.length).toBe(1);
            expect(this.hammerKnight.attack).toBe(4);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Exalt on attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut', 'silver-paladin'],
                    dicepool: ['divine', 'natural']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['mist-spirit', 'living-doll']
                }
            });
        });

        it('Resolve divine die when destroying a opposing unit', function () {
            this.player1.dicepool[0].exhausted = true;
            expect(this.player1.dicepool[0].exhausted).toBe(true);
            expect(this.anchornaut.dieUpgrades.length).toBe(0);
            expect(this.anchornaut.attack).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.silverPaladin);

            this.player2.clickPrompt('Done'); // no blocker
            this.player2.clickPrompt('No'); // no counter

            this.player1.clickDie(0);
            this.player1.clickCard(this.anchornaut);

            expect(this.player1).toHaveDefaultPrompt();

            expect(this.mistSpirit.location).toBe('archives');
            expect(this.anchornaut.dieUpgrades.length).toBe(1);
            expect(this.anchornaut.attack).toBe(1);
        });
    });

    describe('Exalt on redirect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut', 'silver-paladin'],
                    dicepool: ['divine', 'natural']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['mist-spirit', 'living-doll', 'orchid-dove', 'ash-spirit'],
                    hand: ['redirect'],
                    dicepool: ['charm']
                }
            });
        });

        it('Resolve divine die when destroying unit via redirect', function () {
            this.player1.dicepool[0].exhausted = true;
            expect(this.player1.dicepool[0].exhausted).toBe(true);
            expect(this.anchornaut.dieUpgrades.length).toBe(0);
            expect(this.anchornaut.attack).toBe(0);

            this.player1.clickAttack(this.maeoniViper);
            this.player1.clickCard(this.silverPaladin);
            this.player1.clickDone();

            this.player2.clickDone(); // no blockers
            this.player2.clickCard(this.redirect);
            this.player2.clickCard(this.livingDoll);

            this.player1.clickDie(0);
            this.player1.clickCard(this.anchornaut);

            expect(this.livingDoll.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();

            expect(this.anchornaut.dieUpgrades.length).toBe(1);
            expect(this.anchornaut.attack).toBe(1);
        });

        it('BUG REPORT: redirect into orchid dove then pally ability', function () {
            this.player1.dicepool[0].exhausted = true;
            expect(this.player1.dicepool[0].exhausted).toBe(true);
            expect(this.anchornaut.dieUpgrades.length).toBe(0);
            expect(this.anchornaut.attack).toBe(0);

            this.player1.clickAttack(this.maeoniViper);
            this.player1.clickCard(this.silverPaladin);
            this.player1.clickDone();

            this.player2.clickDone(); // no blockers
            this.player2.clickCard(this.redirect);
            this.player2.clickCard(this.orchidDove);
            this.player2.clickYes();

            this.player1.clickDie(0);
            this.player1.clickCard(this.anchornaut);

            expect(this.orchidDove.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();

            expect(this.anchornaut.dieUpgrades.length).toBe(1);
            expect(this.anchornaut.attack).toBe(1);
        });

        it('BUG REPORT: redirect into ash spirit destroys pally', function () {
            this.player1.dicepool[0].exhausted = true;
            this.player1.dicepool[0].level = 'basic';
            expect(this.player1.dicepool[0].exhausted).toBe(true);
            expect(this.anchornaut.dieUpgrades.length).toBe(0);
            expect(this.anchornaut.attack).toBe(0);

            this.player1.clickAttack(this.maeoniViper);
            this.player1.clickCard(this.silverPaladin);
            this.player1.clickDone();

            this.player2.clickDone(); // no blockers
            this.player2.clickCard(this.redirect);
            this.player2.clickCard(this.ashSpirit);

            this.player1.clickDie(0);
            this.player1.clickCard(this.anchornaut);

            expect(this.ashSpirit.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();

            expect(this.silverPaladin.location).toBe('discard');
            expect(this.anchornaut.dieUpgrades.length).toBe(1);
            expect(this.anchornaut.attack).toBe(1);
        });
    });

    describe('Exalt on defence', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut', 'silver-paladin'],
                    dicepool: ['divine', 'natural']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['mist-spirit', 'living-doll']
                }
            });
        });

        it('does not trigger - not my turn', function () {
            this.player1.endTurn();
            this.player1.dicepool[0].exhausted = true;
            expect(this.player1.dicepool[0].exhausted).toBe(true);
            expect(this.anchornaut.dieUpgrades.length).toBe(0);
            expect(this.anchornaut.attack).toBe(0);

            this.player2.clickPrompt('Attack');
            this.player2.clickCard(this.silverPaladin);
            this.player2.clickCard(this.mistSpirit);

            this.player1.clickPrompt('Done'); // no guard
            this.player1.clickPrompt('Yes'); // counter

            expect(this.player2).toHaveDefaultPrompt();
            expect(this.mistSpirit.location).toBe('archives');
        });
    });

});
