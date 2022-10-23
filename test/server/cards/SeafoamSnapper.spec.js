describe('Seafoam Snapper', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['flute-mage'],
                    dicepool: ['sympathy', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-seafoam-snapper'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['hammer-knight', 'anchornaut', 'seafoam-snapper'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('attack when no status damages as normal', function () {
            this.player1.clickAttack(this.seafoamSnapper);
            this.player1.clickCard(this.fluteMage);
            this.player2.clickDone();
            this.player2.clickNo();

            expect(this.seafoamSnapper.location).toBe('archives'); // dead
        });

        it('attack with status acts as armor', function () {
            this.seafoamSnapper.tokens.status = 1;
            this.player1.clickAttack(this.seafoamSnapper);
            this.player1.clickCard(this.fluteMage);
            this.player2.clickDone();
            this.player2.clickNo();

            expect(this.seafoamSnapper.damage).toBe(0);
            expect(this.seafoamSnapper.location).toBe('play area');
            expect(this.seafoamSnapper.status).toBe(0);
        });
    });

    describe('enters play when no conjuration', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['flute-mage'],
                    dicepool: ['sympathy', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-seafoam-snapper'],
                    deck: ['anchornaut'],
                    archives: ['seafoam-snapper']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['hammer-knight', 'anchornaut'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('normal summon', function () {
            this.player1.clickCard(this.summonSeafoamSnapper);
            this.player1.clickPrompt('Summon Seafoam Snapper');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.seafoamSnapper.location).toBe('play area');
        });
    });

    describe('enters play with conjuration', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['flute-mage', 'mist-spirit'],
                    dicepool: ['sympathy', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-seafoam-snapper'],
                    deck: ['anchornaut'],
                    archives: ['seafoam-snapper']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['hammer-knight', 'anchornaut'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('exhausted conjuration gets destroyed, snapper gets tokens', function () {
            this.mistSpirit.tokens.exhaustion = 1;
            this.player1.clickCard(this.summonSeafoamSnapper);
            this.player1.clickPrompt('Summon Seafoam Snapper');
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.mistSpirit);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.seafoamSnapper.location).toBe('play area');
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.seafoamSnapper.status).toBe(1);
        });

        it('unexhausted conjuration give no prompt, snapper gets no tokens', function () {
            this.mistSpirit.tokens.exhaustion = 0;
            this.player1.clickCard(this.summonSeafoamSnapper);
            this.player1.clickPrompt('Summon Seafoam Snapper');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.seafoamSnapper.location).toBe('play area');
            expect(this.mistSpirit.location).toBe('play area');
            expect(this.seafoamSnapper.status).toBe(0);
        });
    });

    describe('Tough vs Fighting Spirit', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['flute-mage', 'iron-worker'],
                    dicepool: ['sympathy', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-seafoam-snapper'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['hammer-knight', 'anchornaut', 'seafoam-snapper'],
                    spellboard: ['chant-of-revenge', 'fighting-spirit']
                }
            });
        });

        it('dies with status tokens should not trigger Fighting Spirit', function () {
            this.seafoamSnapper.tokens.status = 1;
            this.player1.clickAttack(this.seafoamSnapper);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickDone();
            this.player2.clickNo();

            expect(this.seafoamSnapper.location).toBe('archives');
            expect(this.fightingSpirit.status).toBe(0);
        });
    });

});
