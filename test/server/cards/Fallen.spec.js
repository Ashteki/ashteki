describe('Fallen ', function () {
    describe('Attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['fallen', 'mist-spirit'],
                    dicepool: ['natural']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('unpreventable damage on attack ignores armour', function () {
            expect(this.frostFang.damage).toBe(0);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.frostFang);
            this.player1.clickCard(this.fallen);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('No');
            this.player2.clickPrompt('Pass'); // particle shield

            expect(this.frostFang.location).toBe('discard');
        });

        it('unpreventable damage when preventAllDamage is in play', function () {
            this.player1.player.actions.main = false;
            this.player1.endTurn();
            this.player2.play(this.safeguard);
            this.player2.clickDie(0); // spends particle shield die
            this.player2.clickCard(this.ironWorker);
            this.player2.endTurn();
            expect(this.ironWorker.damage).toBe(0);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.fallen);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('No');

            expect(this.ironWorker.damage).toBe(1);
        });

        it('unpreventable damage when countering', function () {
            this.player1.player.actions.main = false;
            this.player1.endTurn();
            this.player2.clickPrompt('Attack');
            this.player2.clickCard(this.fallen);
            this.player2.clickCard(this.frostFang);
            this.player1.clickPrompt('Done'); // no guard
            this.player1.clickPrompt('Yes'); // counter
            this.player2.clickPrompt('Pass'); // particle shield

            expect(this.fallen.location).toBe('archives');
            expect(this.frostFang.location).toBe('discard'); // dead after one damage through armour
        });
    });

    describe('Fallen vs Cover', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['fallen'],
                    spellboard: ['summon-butterfly-monk'],
                    archives: ['butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: [],
                    hand: ['cover'],
                    dicepool: ['natural']
                }
            });
        });

        it('cover cannot prevent damage from unpreventable fallen zombie killers', function () {
            expect(this.coalRoarkwin.damage).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.fluteMage); // target
            this.player1.clickCard(this.fallen); // single attacker

            this.player2.clickCard(this.coalRoarkwin); // guard with pb
            this.player2.clickCard(this.cover); // click cover to play as reaction

            // card played
            expect(this.cover.location).toBe('discard');
            expect(this.player2.hand.length).toBe(0);

            // damage NOT prevented to pb
            expect(this.coalRoarkwin.damage).toBe(1);
        });
    });
});
