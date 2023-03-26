describe('Blood Puppeteer', function () {
    describe('Stitch', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    // inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    hand: ['blood-puppeteer'],
                    archives: ['blood-puppet']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural', 'natural'],
                    hand: ['natures-wrath']
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

        it('vs AoE after played', function () {
            this.player1.clickCard(this.bloodPuppeteer);
            this.player1.clickPrompt('Play this Ally');
            // this.player1.clickDone();

            expect(this.bloodPuppeteer.location).toBe('play area');
            expect(this.bloodPuppet.location).toBe('play area');
            expect(this.bloodPuppet.controller).toBe(this.player1.player);

            this.player1.endTurn();

            this.player2.play(this.naturesWrath);
            this.player2.clickCard(this.bloodPuppeteer);
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.bloodPuppet); // discard
            this.player2.clickCard(this.blueJaguar);
            expect(this.bloodPuppeteer.location).toBe('discard');
            expect(this.bloodPuppet.location).toBe('play area');
            expect(this.player2).toHaveDefaultPrompt();
            expect(this.bloodPuppet.removed).toBe(false);
        });
    });

    describe('Restitch', function () {
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
                    archives: ['blood-puppet'],
                    hand: ['fear']
                }
            });
        });

        it('gifts a puppet to opponent', function () {
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

        it('ignores exhaustion on puppeteer', function () {
            this.bloodPuppeteer.tokens.exhaustion = 1;
            expect(this.bloodPuppeteer.exhausted).toBe(true);
            const archivesPuppet = this.player2.archives[0];
            this.player1.clickAttack(this.bloodPuppeteer);
            this.player1.clickCard(this.mistSpirit);
            this.player2.clickDone();
            // this.player2.clickNo(); // no counter as exhausted
            this.player2.clickYes(); // restitch
            this.player2.clickCard(this.bloodPuppet);

            expect(this.bloodPuppeteer.location).toBe('discard');
            expect(this.bloodPuppet.location).toBe('archives');
            expect(archivesPuppet.location).toBe('play area');
            expect(archivesPuppet.controller).toBe(this.player1.player);
        });

        it('ignores exhaustion on puppet', function () {
            this.bloodPuppet.tokens.exhaustion = 1;
            expect(this.bloodPuppet.exhausted).toBe(true);
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

        it('is triggered by fear', function () {
            const archivesPuppet = this.player2.archives[0];
            this.player1.endTurn();

            this.player2.play(this.fear)
            this.player2.clickDie(0);
            this.player2.clickCard(this.bloodPuppeteer);
            this.player2.clickYes(); // restitch
            this.player2.clickCard(this.bloodPuppet);

            expect(this.bloodPuppeteer.location).toBe('discard');
            expect(this.bloodPuppet.location).toBe('archives');
            expect(archivesPuppet.location).toBe('play area');
            expect(archivesPuppet.controller).toBe(this.player1.player);
        });


    });

    describe('Restitch vs Conscript', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'rowan-umberend',
                    spellboard: [],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    inPlay: ['blood-puppeteer', 'blood-puppet'],
                    archives: ['blood-puppet'],
                    hand: ['fear']
                }
            });
        });

        it('restitch THEN conscript', function () {
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
            this.player2.clickYes() // conscript
            expect(this.rowanUmberend.childCards[0]).toBe(this.bloodPuppeteer);
        });
    });

});
