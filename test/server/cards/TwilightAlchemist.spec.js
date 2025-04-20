const { Level } = require('../../../server/constants');

describe('Twilight Alchemist', function () {
    describe('Enters Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['cerulean-diver', 'iron-worker'],
                    dicepool: ['sympathy', 'natural', 'time', 'charm'],
                    hand: ['molten-gold', 'twilight-alchemist', 'golden-veil'],
                    deck: ['purge', 'abundance', 'summon-gilder']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'mist-spirit'],
                    spellboard: ['keepsake']
                }
            });

            this.player1.dicepool[2].level = Level.Basic;
            this.player1.dicepool[3].level = Level.Class;
        });

        it('bottom a card to draw 2 and fix 2 dice', function () {
            this.player1.player.deck = [this.purge, this.abundance, this.summonGilder];
            this.player1.play(this.twilightAlchemist);
            this.player1.clickCard(this.goldenVeil);
            expect(this.player1.hand.length).toBe(3);
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickDone();
            expect(this.player1.dicepool[2].level).toBe(Level.Class);
            expect(this.player1.dicepool[3].level).toBe(Level.Power);
            expect(this.twilightAlchemist.location).toBe('play area');
            expect(this.goldenVeil.location).toBe('deck');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('not using', function () {
            this.player1.player.deck = [this.purge, this.abundance, this.summonGilder];
            this.player1.play(this.twilightAlchemist);
            this.player1.clickDone();
            expect(this.player1.dicepool[2].level).toBe(Level.Basic);
            expect(this.player1.dicepool[3].level).toBe(Level.Class);
            expect(this.twilightAlchemist.location).toBe('play area');
            expect(this.goldenVeil.location).toBe('hand');
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
