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
                    phoenixborn: 'rin-northfell',
                    dicepool: ['ceremonial', 'time', 'charm', 'charm'],
                    hand: ['molten-gold'],
                    inPlay: ['flute-mage', 'dread-wraith']
                }
            });
        });

        it('adds status when brawler was attacker', function () {
            expect(this.gorrenrockBrawler.status).toBe(0);
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.gorrenrockBrawler);
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
