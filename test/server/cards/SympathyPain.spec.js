describe('Sympathy pain reaction spell', function () {
    describe('on ability damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'hammer-knight'],
                    spellboard: ['chant-of-revenge', 'abundance'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'illusion'],
                    hand: ['cover', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain']
                }
            });
            this.chantOfRevenge.tokens.status = 1;
        });

        it('can be played when my phoenixborn takes damage from coal PB ability', function () {
            expect(this.hammerKnight.damage).toBe(0);
            this.player1.clickCard(this.coalRoarkwin); // use slash
            this.player1.clickPrompt('Slash');
            this.player1.clickCard(this.cover); // discard
            this.player1.clickCard(this.sariaGuideman);
            expect(this.player2).toBeAbleToSelect(this.sympathyPain);
            this.player2.clickCard(this.sympathyPain); // click sym pain to play as reaction
            this.player2.clickDie(3);
            this.player2.clickCard(this.hammerKnight); // redirect damage to hammerKnight

            expect(this.hammerKnight.damage).toBe(2);
        });

        it('can be played when my phoenixborn takes damage from chant of revenge', function () {
            expect(this.hammerKnight.damage).toBe(0);
            this.player1.clickCard(this.chantOfRevenge);
            this.player1.clickPrompt('Take Revenge');
            expect(this.player2).toBeAbleToSelect(this.sympathyPain);
            this.player2.clickCard(this.sympathyPain); // click sym pain to play as reaction
            this.player2.clickDie(3);
            this.player2.clickCard(this.hammerKnight); // redirect damage to hammerKnight

            expect(this.hammerKnight.damage).toBe(2);
        });

        it('can be played when my phoenixborn takes damage from abundance', function () {
            this.player1.clickCard(this.abundance);
            this.player1.clickPrompt('Abundance');
            // draw refused - player 2 PB takes damage
            this.player2.clickPrompt('0');
            // this.player1.clickPrompt('2');

            expect(this.player2).toBeAbleToSelect(this.sympathyPain);
            this.player2.clickCard(this.sympathyPain); // click sym pain to play as reaction
            this.player2.clickDie(3);

            expect(this.coalRoarkwin.damage).toBe(2);
        });
    });

    describe('On attack damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['cover', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain']
                }
            });
        });

        it('when guarding', function () {
            // bug reported as this scenario
            expect(this.hammerKnight.damage).toBe(0);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.hammerKnight);
            this.player2.clickCard(this.sariaGuideman); // guard
            expect(this.player2).toBeAbleToSelect(this.sympathyPain);
            this.player2.clickCard(this.sympathyPain); // click sym pain to play as reaction
            this.player2.clickDie(3);
            this.player2.clickCard(this.hammerKnight); // redirect damage to hammerKnight

            expect(this.hammerKnight.damage).toBe(2);
        });
    });

    describe('During End of Round Phase', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'hammer-knight', 'admonisher'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['cover', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain']
                }
            });
        });

        it('should not be allowed at end of round', function () {
            // bug reported as this scenario

            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone(); // no pins
            this.player2.clickDone();

            expect(this.sariaGuideman.damage).toBe(1); // from admonisher
            expect(this.player2).not.toHavePrompt('Any reactions?');
        });
    });
});
