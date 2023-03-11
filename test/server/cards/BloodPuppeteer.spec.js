describe('Blood Puppeteer', function () {
    describe('Stitch', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    hand: ['blood-puppeteer'],
                    archives: ['blood-puppet']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('summons a bp onto my bf when played', function () {
            this.player1.clickCard(this.bloodPuppeteer);
            this.player1.clickPrompt('Play this Ally');
            // this.player1.clickDone();

            expect(this.bloodPuppeteer.location).toBe('play area');
            expect(this.bloodPuppet.location).toBe('play area');
            expect(this.bloodPuppet.controller).toBe(this.player1.player);
        });
    });

    describe('Retitch', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    spellboard: [],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    inPlay: ['blood-puppeteer', 'blood-puppet'],
                    archives: ['blood-puppet']
                }
            });
        });

        it('summons a bp onto my bf when played', function () {
            const archivesPuppet = this.player2.archives[0];
            this.player1.clickAttack(this.bloodPuppeteer);
            this.player1.clickCard(this.mistSpirit);
            this.player2.clickDone();
            this.player2.clickNo();
            this.player2.clickYes(); // restitch
            this.player2.clickCard(this.bloodPuppet);

            expect(this.bloodPuppeteer.location).toBe('discard');
            expect(this.bloodPuppet.location).toBe('archives');
            expect(archivesPuppet.location).toBe('play area');
            expect(archivesPuppet.controller).toBe(this.player1.player);
        });


    });

});
