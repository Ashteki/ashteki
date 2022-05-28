describe('Quick Strike', function () {
    describe('attacks', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['seaside-raven', 'mist-spirit', 'iron-worker', 'light-swordsman'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'iron-rhino', 'biter'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('defender may choose to counter', function () {
            expect(this.fluteMage.tokens.damage).toBeUndefined();
            expect(this.seasideRaven.tokens.damage).toBeUndefined();

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.fluteMage); // target
            this.player1.clickCard(this.seasideRaven); // single attacker

            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('Yes'); // DO counter

            // flute mage is dead
            expect(this.fluteMage.location).toBe('discard');
            // seaside is unhurt - it has quickstrike
            expect(this.seasideRaven.damage).toBe(0);
            expect(this.seasideRaven.location).toBe('play area');
            expect(this.seasideRaven.exhausted).toBe(true);
        });

        it('test with bug report units', function () {
            expect(this.biter.damage).toBe(0);
            expect(this.lightSwordsman.damage).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.biter); // target
            this.player1.clickCard(this.lightSwordsman); // single attacker

            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('Yes'); // DO counter

            // flute mage is dead
            expect(this.biter.location).toBe('archives');
            // seaside is unhurt - it has quickstrike
            expect(this.lightSwordsman.damage).toBe(0);
            expect(this.lightSwordsman.location).toBe('play area');
            expect(this.lightSwordsman.exhausted).toBe(true);
        });

        it('defender may unitGuard', function () {
            expect(this.fluteMage.damage).toBe(0);
            expect(this.seasideRaven.damage).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.fluteMage); // target
            this.player1.clickCard(this.seasideRaven); // single attacker

            this.player2.clickCard(this.biter);

            // flute mage is dead
            expect(this.biter.location).toBe('archives');
            expect(this.fluteMage.location).toBe('play area');
            // seaside is unhurt - it has quickstrike
            expect(this.seasideRaven.damage).toBe(0);
            expect(this.seasideRaven.location).toBe('play area');
            expect(this.seasideRaven.exhausted).toBe(true);
        });

        it('partial damage defender destroyed gives no damage to attacker', function () {
            this.ironRhino.tokens.damage = 2;
            expect(this.ironRhino.damage).toBe(2);
            expect(this.seasideRaven.damage).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ironRhino); // target
            this.player1.clickCard(this.seasideRaven); // single attacker

            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('Yes'); // DO counter

            // frostback is dead
            expect(this.ironRhino.location).toBe('archives');
            // seaside is unhurt - it has quickstrike
            expect(this.seasideRaven.damage).toBe(0);
            expect(this.seasideRaven.location).toBe('play area');
            expect(this.seasideRaven.exhausted).toBe(true);
        });
    });

    describe('BUG: 909 QS vs particle shield', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['seaside-raven', 'cloudburst-gryphon'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'iron-rhino', 'turtle-guard'],
                    spellboard: [],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    hand: ['anchornaut', 'particle-shield']
                }
            });
        });

        it('defender may unitGuard', function () {
            expect(this.fluteMage.damage).toBe(0);
            expect(this.seasideRaven.damage).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.cloudburstGryphon);
            this.player1.clickDone();

            // unit guard
            this.player2.clickCard(this.turtleGuard);
            this.player2.clickCard(this.cloudburstGryphon);
            this.player2.clickDone();

            // react with particle shield
            this.player2.clickCard(this.particleShield);

            // turtleGuard is not dead
            expect(this.turtleGuard.location).toBe('play area');
            // cloudburstGryphon is DEAD! because turtleGuard is not dead because of particle shield and can counter
            expect(this.cloudburstGryphon.location).toBe('archives');
            expect(this.particleShield.location).toBe('discard');
        });
    });


    describe('BUG: 1011 QS vs particle shield part 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['seaside-raven', 'cloudburst-gryphon'],
                    hand: ['particle-shield'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['butterfly-monk', 'iron-rhino'],
                    spellboard: [],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('particle shield for player1 should not trigger', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.butterflyMonk);
            this.player1.clickCard(this.cloudburstGryphon);
            this.player2.clickDone();
            this.player2.clickYes();
            // butterfly monk should be dead.
            this.player2.clickCard(this.ironRhino); // Mend 1
            expect(this.butterflyMonk.location).toBe('archives');

            expect(this.cloudburstGryphon.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
