describe('Gorrenrock Brawler', function () {
    describe('comeback', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'gorrenrock-brawler', 'mist-spirit', 'string-mage'],
                    dicepool: ['natural', 'time', 'charm', 'charm'],
                    hand: ['iron-worker']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    dicepool: ['ceremonial', 'time', 'charm', 'charm'],
                    hand: ['backtrack', 'molten-gold'],
                    inPlay: ['iron-rhino']
                }
            });
            this.gorrenrockBrawler.tokens.status = 2;
            this.gorrenrockBrawler.tokens.damage = 3;
            this.gorrenrockBrawler.tokens.exhaustion = 1;
        });

        it('removes all tokens', function () {
            expect(this.gorrenrockBrawler.status).toBe(2);
            expect(this.gorrenrockBrawler.damage).toBe(3);
            expect(this.gorrenrockBrawler.exhausted).toBe(true);

            this.player1.clickCard(this.gorrenrockBrawler);
            this.player1.clickPrompt('Comeback');
            this.player1.clickDie(3);

            expect(this.gorrenrockBrawler.status).toBe(0);
            expect(this.gorrenrockBrawler.damage).toBe(0);
            expect(this.gorrenrockBrawler.exhausted).toBe(false);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Brawl as attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'gorrenrock-brawler', 'mist-spirit', 'string-mage'],
                    dicepool: ['natural', 'time', 'charm', 'charm', 'natural'],
                    hand: ['iron-worker']
                },
                player2: {
                    phoenixborn: 'brennen-blackcloud',
                    dicepool: ['ceremonial', 'time', 'charm', 'charm', 'illusion'],
                    hand: ['molten-gold', 'strange-copy'],
                    inPlay: ['flute-mage', 'dread-wraith', 'sunshield-sentry']
                }
            });
        });

        it('adds status when brawler was attacker', function () {
            expect(this.gorrenrockBrawler.status).toBe(0);
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.gorrenrockBrawler);
            this.player2.clickPrompt('Pass'); // no strange copy
            this.player2.clickDone(); // no guard
            this.player2.clickYes();

            expect(this.gorrenrockBrawler.damage).toBe(1);
            expect(this.fluteMage.location).toBe('discard');
            expect(this.gorrenrockBrawler.status).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('adds status when brawler was attacker after attack resolution', function () {
            expect(this.gorrenrockBrawler.status).toBe(0);
            this.player1.clickAttack(this.dreadWraith);
            this.player1.clickCard(this.gorrenrockBrawler);
            this.player2.clickPrompt('Pass'); // no strange copy
            this.player2.clickDone(); // no guard
            this.player2.clickYes();
            expect(this.gorrenrockBrawler.damage).toBe(1);
            expect(this.dreadWraith.damage).toBe(4);

            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.dreadWraith);
            expect(this.gorrenrockBrawler.status).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('adds status when brawler was attacker and unit dies at end of turn', function () {
            expect(this.gorrenrockBrawler.status).toBe(0);
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.gorrenrockBrawler);
            this.player2.clickCard(this.strangeCopy); // strange copy
            this.player2.clickDie(4);
            this.player2.clickCard(this.fluteMage);
            this.player2.clickCard(this.gorrenrockBrawler);
            this.player2.clickDone(); // no guard
            this.player2.clickYes();

            this.player1.endTurn();

            expect(this.gorrenrockBrawler.status).toBe(1); // flute mage dies after strange copy ends - failing
        });

        it("doesn't add status when brawler was attacker and unit dies subsequent turn", function () {
            expect(this.gorrenrockBrawler.status).toBe(0);
            this.player1.clickAttack(this.sunshieldSentry);
            this.player1.clickCard(this.gorrenrockBrawler);
            this.player2.clickPrompt('Pass'); // no strange copy
            this.player2.clickDone(); // no guard
            this.player2.clickYes();
            expect(this.gorrenrockBrawler.damage).toBe(2);
            expect(this.sunshieldSentry.damage).toBe(4);

            this.player1.endTurn();
            this.player2.clickCard(this.brennenBlackcloud);
            this.player2.clickPrompt('Spirit Burn');
            this.player2.clickCard(this.sunshieldSentry); // destroy my Dread Wraith
            this.player2.clickCard(this.aradelSummergaard); // deal 2 damage to Aradel
            expect(this.gorrenrockBrawler.status).toBe(0);
            expect(this.player2).toHaveDefaultPrompt();
        });
    });

    describe('Brawl as defender', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    dicepool: ['ceremonial', 'time', 'charm', 'charm'],
                    hand: ['molten-gold'],
                    inPlay: ['flute-mage']
                },
                player2: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'gorrenrock-brawler', 'mist-spirit', 'string-mage'],
                    dicepool: ['natural', 'time', 'charm', 'charm'],
                    hand: ['iron-worker']
                }
            });
        });

        it('adds status when brawler was blocker', function () {
            expect(this.gorrenrockBrawler.status).toBe(0);
            this.player1.clickAttack(this.luluFirststone);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickDone();
            this.player2.clickCard(this.gorrenrockBrawler);
            this.player2.clickCard(this.fluteMage);
            this.player2.clickDone();

            expect(this.gorrenrockBrawler.damage).toBe(1);
            expect(this.fluteMage.location).toBe('discard');
            expect(this.gorrenrockBrawler.status).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
