describe('Reverberate', function () {
    describe('Without discarded copies', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['sympathy', 'natural', 'time', 'charm'],
                    hand: ['reverberate'],
                    archives: ['spark'],
                    deck: ['purge', 'sympathy-pain', 'abundance']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman']
                }
            });
        });

        it('deals 1 damage once', function () {
            this.player1.player.deck = [this.purge, this.sympathyPain, this.abundance];
            expect(this.purge.location).toBe('deck');
            this.player1.play(this.reverberate);
            this.player1.clickCard(this.ironRhino);

            expect(this.ironRhino.damage).toBe(1);
            expect(this.purge.location).toBe('hand');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('With one discarded copy', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['sympathy', 'natural', 'time', 'charm'],
                    hand: ['reverberate'],
                    archives: ['spark'],
                    deck: ['purge', 'sympathy-pain', 'abundance'],
                    discard: ['reverberate']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman']
                }
            });
        });

        it('deals 1 damage twice', function () {
            this.player1.player.deck = [this.purge, this.sympathyPain, this.abundance];

            this.player1.play(this.reverberate);
            this.player1.clickCard(this.ironRhino);
            this.player1.clickCard(this.sonicSwordsman);

            expect(this.ironRhino.damage).toBe(1);
            expect(this.sonicSwordsman.damage).toBe(1);
            expect(this.purge.location).toBe('hand');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Without target for extra ping', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['sympathy', 'natural', 'time', 'charm'],
                    hand: ['reverberate'],
                    archives: ['spark'],
                    deck: ['purge', 'sympathy-pain', 'abundance'],
                    discard: ['reverberate']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['anchornaut']
                }
            });
        });

        it('deals 1 damage once and then draws a card', function () {
            this.player1.player.deck = [this.purge, this.sympathyPain, this.abundance];
            expect(this.purge.location).toBe('deck');
            this.player1.play(this.reverberate);
            this.player1.clickCard(this.anchornaut);

            expect(this.anchornaut.location).toBe('discard');
            expect(this.purge.location).toBe('hand');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Vs Finch discarding another copy', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['sympathy', 'natural', 'time', 'charm'],
                    hand: ['reverberate'],
                    archives: ['spark'],
                    deck: ['purge', 'sympathy-pain', 'abundance', 'reverberate'],
                    discard: ['reverberate']
                },
                player2: {
                    phoenixborn: 'leo-sunshadow',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['glow-finch', 'flute-mage', 'iron-rhino', 'sonic-swordsman']
                }
            });
        });

        it('deals 1 damage an extra 2 times', function () {
            const deckReverb = this.player1.deck.find((c) => c.id === 'reverberate');
            expect(deckReverb.id).toBe('reverberate');
            this.player1.player.deck = [deckReverb, this.purge, this.sympathyPain, this.abundance];

            this.player1.play(this.reverberate);
            // first ping destroys finch and puts extra reverb in discard
            this.player1.clickCard(this.glowFinch);
            this.player2.clickYes();

            // two more pings
            this.player1.clickCard(this.ironRhino);
            this.player1.clickCard(this.sonicSwordsman);

            expect(this.ironRhino.damage).toBe(1);
            expect(this.sonicSwordsman.damage).toBe(1);
            expect(deckReverb.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
