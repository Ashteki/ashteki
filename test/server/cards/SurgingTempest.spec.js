describe('SurgingTempest', function () {
    describe('ready spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    dicepool: ['sympathy', 'charm', 'divine', 'charm'],
                    hand: ['farewell', 'weight-of-the-world', 'regress'],
                    spellboard: ['surging-tempest'],
                    deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frostback-bear', 'iron-worker', 'butterfly-monk'],
                    spellboard: [],
                    deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
                }
            });
            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[2].level = 'basic';
        });

        it('unfocussed: draw a card and raise two dice', function () {
            const handSize = this.player1.hand.length;
            this.player1.useAbility(this.surgingTempest);
            expect(this.player1.hand.length).toBe(handSize + 1);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDone();

            expect(this.player1.dicepool[1].level).toBe('class');
            expect(this.player1.dicepool[2].level).toBe('class');

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('focus 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    dicepool: ['sympathy', 'charm', 'divine', 'charm'],
                    hand: ['farewell', 'weight-of-the-world', 'regress'],
                    spellboard: ['surging-tempest', 'surging-tempest'],
                    deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frostback-bear', 'iron-worker', 'butterfly-monk'],
                    spellboard: [],
                    deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
                }
            });
            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[2].level = 'basic';
        });

        it('draw, raise two dice, damage to a unit', function () {
            const handSize = this.player1.hand.length;
            this.player1.useAbility(this.surgingTempest);
            expect(this.player1.hand.length).toBe(handSize + 1);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDone();

            expect(this.player1.dicepool[1].level).toBe('class');
            expect(this.player1.dicepool[2].level).toBe('class');

            this.player1.clickYes(); // discard to ping
            this.player1.clickCard(this.farewell);

            expect(this.player1).toBeAbleToSelect(this.frostbackBear);
            expect(this.player1).toBeAbleToSelect(this.anchornaut);

            this.player1.clickCard(this.frostbackBear);
            expect(this.frostbackBear.damage).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('without active non-power dice: draw, skip two dice, damage to a unit', function () {
            this.player1.dicepool[1].exhaust();
            this.player1.dicepool[2].exhaust();
            this.player1.dicepool[3].exhaust();

            const handSize = this.player1.hand.length;
            this.player1.useAbility(this.surgingTempest);
            expect(this.player1.hand.length).toBe(handSize + 1);

            this.player1.clickYes(); // discard to ping
            this.player1.clickCard(this.farewell); // discard

            expect(this.player1).toBeAbleToSelect(this.frostbackBear);
            expect(this.player1).toBeAbleToSelect(this.anchornaut);

            this.player1.clickCard(this.frostbackBear);
            expect(this.frostbackBear.damage).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('only 1 die to change, should prompt for damage to a unit', function () {
            this.player1.dicepool[1].exhaust();
            this.player1.dicepool[2].exhaust();
            this.player1.dicepool[3].exhaust();
            this.player1.dicepool[0].level = 'class';

            const handSize = this.player1.hand.length;
            this.player1.useAbility(this.surgingTempest);
            expect(this.player1.hand.length).toBe(handSize + 1);

            this.player1.clickDie(0); // raise 1 die

            this.player1.clickYes(); // discard to ping
            this.player1.clickCard(this.farewell); // discard

            expect(this.player1).toBeAbleToSelect(this.frostbackBear);
            expect(this.player1).toBeAbleToSelect(this.anchornaut);

            this.player1.clickCard(this.frostbackBear);
            expect(this.frostbackBear.damage).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('focus 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    dicepool: ['sympathy', 'charm', 'divine', 'charm'],
                    hand: ['farewell', 'weight-of-the-world', 'regress'],
                    spellboard: ['surging-tempest', 'surging-tempest', 'surging-tempest'],
                    deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frostback-bear', 'iron-worker', 'butterfly-monk'],
                    spellboard: [],
                    deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
                }
            });
            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[2].level = 'basic';
        });

        it('draw, raise two dice, damage to a unit, damage to pb', function () {
            const handSize = this.player1.hand.length;
            this.player1.useAbility(this.surgingTempest);
            expect(this.player1.hand.length).toBe(handSize + 1);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDone();

            expect(this.player1.dicepool[1].level).toBe('class');
            expect(this.player1.dicepool[2].level).toBe('class');

            this.player1.clickYes(); // discard to ping
            this.player1.clickCard(this.farewell); // discard

            expect(this.player1).toBeAbleToSelect(this.frostbackBear);
            expect(this.player1).toBeAbleToSelect(this.anchornaut);

            this.player1.clickCard(this.frostbackBear);
            expect(this.frostbackBear.damage).toBe(1);

            this.player1.clickYes(); // discard to burn
            this.player1.clickCard(this.regress); // discard
            this.player1.clickCard(this.aradelSummergaard);
            expect(this.aradelSummergaard.damage).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('focus 2 without enemy units', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    dicepool: ['sympathy', 'charm', 'divine', 'charm'],
                    hand: ['farewell', 'weight-of-the-world', 'regress'],
                    spellboard: ['surging-tempest', 'surging-tempest', 'surging-tempest'],
                    deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: [],
                    deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
                }
            });
            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[2].level = 'basic';
        });

        it('draw, raise two dice, skip damage to a unit, damage to pb', function () {
            const handSize = this.player1.hand.length;
            this.player1.useAbility(this.surgingTempest);
            expect(this.player1.hand.length).toBe(handSize + 1);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDone();

            expect(this.player1.dicepool[1].level).toBe('class');
            expect(this.player1.dicepool[2].level).toBe('class');

            // prompt for focus 1 discard
            this.player1.clickNo();

            // prompt for focus 2 discard
            this.player1.clickYes();

            expect(this.player1).not.toHaveDefaultPrompt();

            this.player1.clickCard(this.regress); // discard
            this.player1.clickCard(this.aradelSummergaard);
            expect(this.aradelSummergaard.damage).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
