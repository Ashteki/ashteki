describe('Adapt', function () {
    describe('Adapt ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['adaptodon'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['molten-gold'],
                    archives: ['fire-adaptation', 'ice-adaptation', 'spark']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage']
                }
            });
        });

        it('applies fire adaptation by button', function () {
            this.player1.clickCard(this.adaptodon);
            this.player1.clickPrompt('Adapt');
            this.player1.clickPrompt('Fire');
            this.player1.clickDone(); // no ping

            expect(this.adaptodon.upgrades.length).toBe(1);
            expect(this.adaptodon.attack).toBe(2);
        });

        it('applies ice adaptation by button', function () {
            this.player1.clickCard(this.adaptodon);
            this.player1.clickPrompt('Adapt');

            this.player1.clickPrompt('Ice');
            this.player1.clickDone(); // no ping

            expect(this.adaptodon.upgrades.length).toBe(1);
            expect(this.adaptodon.life).toBe(3);
        });

        it('applies fire adaptation with Fire Adaptation ping', function () {
            this.player1.clickCard(this.adaptodon);
            this.player1.clickPrompt('Adapt');
            this.player1.clickPrompt('Fire');

            this.player1.clickCard(this.fluteMage);

            expect(this.adaptodon.upgrades.length).toBe(1);
            expect(this.adaptodon.attack).toBe(2);
            expect(this.fluteMage.damage).toBe(1);
        });

        it('applies ice adaptation with unit exhaustion', function () {
            this.player1.clickCard(this.adaptodon);
            this.player1.clickPrompt('Adapt');
            this.player1.clickPrompt('Ice');

            this.player1.clickCard(this.fluteMage);

            expect(this.adaptodon.upgrades.length).toBe(1);
            expect(this.adaptodon.life).toBe(3);
            expect(this.fluteMage.exhausted).toBe(true);
        });

        it('cannot apply two adaptations', function () {
            this.player1.clickCard(this.adaptodon);
            this.player1.clickPrompt('Adapt');
            this.player1.clickPrompt('Ice');

            this.player1.player.actions.side += 1;
            this.player1.clickCard(this.adaptodon);

            expect(this.player1).not.toHavePromptButton('Adapt');
        });
    });

    describe('option', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['adaptodon'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['molten-gold'],
                    archives: ['ice-adaptation', 'spark']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage']
                }
            });
        });

        it('no fire button if not in archives', function () {
            this.player1.clickCard(this.adaptodon);
            this.player1.clickPrompt('Adapt');
            expect(this.player1).not.toHavePromptButton('Fire');
            this.player1.clickPrompt('Ice');
            this.player1.clickDone(); // no exhaust

            expect(this.adaptodon.upgrades.length).toBe(1);
            expect(this.adaptodon.life).toBe(3);
        });
    });

    describe('option 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['adaptodon'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['molten-gold'],
                    archives: ['fire-adaptation', 'spark']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage']
                }
            });
        });

        it('no ice button if not in archives', function () {
            this.player1.clickCard(this.adaptodon);
            this.player1.clickPrompt('Adapt');
            expect(this.player1).not.toHavePromptButton('Ice');
            this.player1.clickPrompt('Fire');
            this.player1.clickDone(); // no ping

            expect(this.adaptodon.upgrades.length).toBe(1);
            expect(this.adaptodon.attack).toBe(2);
        });
    });

    describe('neither in archives', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['adaptodon'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['molten-gold'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage']
                }
            });
        });

        it('no ice button if not in archives', function () {
            this.player1.clickCard(this.adaptodon);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.adaptodon.upgrades.length).toBe(0);
            expect(this.adaptodon.attack).toBe(1);
        });
    });
});
