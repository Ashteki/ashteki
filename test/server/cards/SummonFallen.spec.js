describe('Summon Fallen', function () {
    describe('When ally destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'natural'],
                    archives: ['fallen']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    spellboard: ['summon-fallen']
                }
            });
        });

        it('should add a status token', function () {
            this.player1.useDie(0);
            this.player1.clickCard(this.anchornaut);

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.summonFallen.status).toBe(1);
        });

        it('with 2 status it should add a status token', function () {
            this.summonFallen.tokens.status = 2;
            this.player1.useDie(0);
            this.player1.clickCard(this.anchornaut);

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.summonFallen.status).toBe(3);
        });

        it('with 3 status it should NOT add a status token', function () {
            this.summonFallen.tokens.status = 3;
            this.player1.useDie(0);
            this.player1.clickCard(this.anchornaut);

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.summonFallen.status).toBe(3);
        });
    });

    describe('Summon Action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-fallen'],
                    dicepool: ['ceremonial', 'ceremonial', 'natural', 'natural'],
                    archives: ['fallen', 'fallen']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a chosen single fallen into play', function () {
            this.summonFallen.tokens.status = 2;
            this.player1.useAbility(this.summonFallen);
            this.player1.clickPrompt('1');

            expect(this.fallen.location).toBe('play area');
            expect(this.summonFallen.status).toBe(1);
            expect(this.summonFallen.exhausted).toBe(true);
            expect(this.player1.dicepool[0].exhausted).toBe(true);
            expect(this.player1.dicepool[1].exhausted).toBe(true);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('should place chosen two fallen into play', function () {
            this.summonFallen.tokens.status = 2;
            this.player1.useAbility(this.summonFallen);
            this.player1.clickPrompt('2');

            expect(this.fallen.location).toBe('play area');
            expect(this.summonFallen.status).toBe(0);
            expect(this.summonFallen.exhausted).toBe(true);
            expect(this.player1.dicepool[0].exhausted).toBe(true);
            expect(this.player1.dicepool[1].exhausted).toBe(true);
            expect(this.player1.inPlay.length).toBe(2);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Summon Action vs Swift Messenger', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-fallen'],
                    dicepool: ['ceremonial', 'ceremonial', 'natural', 'natural'],
                    archives: ['fallen', 'fallen']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: ['swift-messenger'],
                    dicepool: ['illusion', 'time']
                }
            });
        });

        it('Pass twice: should place chosen two fallen into play', function () {
            this.summonFallen.tokens.status = 2;
            this.player1.useAbility(this.summonFallen);
            this.player1.clickPrompt('2');
            this.player2.clickPrompt('Pass');
            this.player2.clickPrompt('Pass');
            expect(this.fallen.location).toBe('play area');
            expect(this.summonFallen.status).toBe(0);
            expect(this.summonFallen.exhausted).toBe(true);
            expect(this.player1.dicepool[0].exhausted).toBe(true);
            expect(this.player1.dicepool[1].exhausted).toBe(true);
            expect(this.player1.inPlay.length).toBe(2);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('Pass once then use swift messenger', function () {
            this.summonFallen.tokens.status = 2;
            this.player1.useAbility(this.summonFallen);
            this.player1.clickPrompt('2');
            this.player2.clickPrompt('Pass');
            this.player2.clickCard(this.swiftMessenger);
            expect(this.summonFallen.status).toBe(0);
            expect(this.summonFallen.exhausted).toBe(true);
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.swiftMessenger.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
