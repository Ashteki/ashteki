describe('Piercing Light Ready Spell ', function () {
    describe('In play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['flute-mage'],
                    dicepool: ['divine', 'charm'],
                    hand: ['rayward-recruit'],
                    discard: ['hammer-knight'],
                    spellboard: ['piercing-light']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker', 'mist-spirit'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['safeguard']
                }
            });
        });

        it('Grants overkill to all divine buffed units', function () {
            // buff a unit
            this.player1.clickCard(this.raywardRecruit);
            this.player1.clickPrompt('Play this Ally');
            expect(this.raywardRecruit.location).toBe('play area');
            this.player1.clickDie(0);
            this.player1.clickCard(this.raywardRecruit);
            expect(this.raywardRecruit.attack).toBe(1);

            // check for overkill
            expect(this.raywardRecruit.hasKeyword('overkill')).toBe(true);
            expect(this.raywardRecruit.getKeywordValue('overkill')).toBe(1);
        });

        it('buffed unit overkill works as normal', function () {
            // buff a unit
            this.player1.clickDie(0);
            this.player1.clickPrompt('Divine Dice Power');
            this.player1.clickCard(this.fluteMage);
            expect(this.fluteMage.attack).toBe(2);

            // check for overkill
            expect(this.fluteMage.hasKeyword('overkill')).toBe(true);
            expect(this.fluteMage.getKeywordValue('overkill')).toBe(1);

            this.player1.clickAttack(this.ironWorker);
            this.player1.clickCard(this.fluteMage);
            this.player2.clickDone(); // PB guard
            this.player2.clickYes(); // counter

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.fluteMage.location).toBe('discard');
            expect(this.ironWorker.location).toBe('discard');
            expect(this.aradelSummergaard.damage).toBe(1);
        });
    });

    describe('BUG: 982, overkill damage not dealt', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['raptor-hatchling'],
                    dicepool: ['divine', 'charm'],
                    hand: ['rayward-recruit'],
                    discard: ['hammer-knight'],
                    spellboard: ['piercing-light']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker', 'fallen'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['safeguard']
                }
            });
        });

        it('buffed unit overkill works as normal', function () {
            // buff a unit
            this.player1.clickDie(0);
            this.player1.clickPrompt('Divine Dice Power');
            this.player1.clickCard(this.raptorHatchling);
            expect(this.raptorHatchling.attack).toBe(1);

            // check for overkill
            expect(this.raptorHatchling.hasKeyword('overkill')).toBe(true);
            expect(this.raptorHatchling.getKeywordValue('overkill')).toBe(1);

            this.player1.clickAttack(this.fallen);
            this.player1.clickCard(this.raptorHatchling);
            this.player2.clickDone(); // PB guard
            this.player2.clickYes(); // counter

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.raptorHatchling.location).toBe('archives');
            expect(this.fallen.location).toBe('archives');
            expect(this.aradelSummergaard.damage).toBe(1);
        });
    });
});
