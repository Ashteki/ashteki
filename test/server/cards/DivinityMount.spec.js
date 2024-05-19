describe('Divinity Mount', function () {
    describe('Lightning Breath 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['divinity-mount', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['molten-gold'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'illusion'],
                    hand: ['vanish'],
                    inPlay: ['flute-mage', 'mist-spirit']
                }
            });
        });

        it('on attack deals 1 damage to all opponent units (may)', function () {
            this.player2.dicepool[3].level = 'class'; // no reaction

            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.divinityMount);

            this.player1.clickYes();
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.fluteMage);

            expect(this.mistSpirit.location).toBe('archives');
            expect(this.fluteMage.damage).toBe(1);

            expect(this.player1).toHavePrompt('waiting for opponent to guard');
        });

        it('may be cancelled by vanish', function () {
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.divinityMount);

            this.player1.clickYes();
            this.player2.clickCard(this.vanish);

            expect(this.mistSpirit.location).toBe('play area');
            expect(this.fluteMage.damage).toBe(0);

            expect(this.player1).toHavePrompt('waiting for opponent to guard');
        });
    });

    describe('Queen Rider - on destroy', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['molten-gold'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'dimona-odinstar',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['divinity-mount', 'mist-spirit']
                }
            });
        });

        it('when destroyed deals 3 damage to pb', function () {
            this.player1.play(this.moltenGold);
            this.player1.clickCard(this.divinityMount);

            expect(this.divinityMount.location).toBe('archives');
            expect(this.dimonaOdinstar.damage).toBe(3);
        });

        it('when destroyed ability is inexhaustible', function () {
            this.divinityMount.tokens.exhaustion = 1;

            this.player1.play(this.moltenGold);
            this.player1.clickCard(this.divinityMount);

            expect(this.divinityMount.location).toBe('archives');
            expect(this.dimonaOdinstar.damage).toBe(3);
        });
    });
});
