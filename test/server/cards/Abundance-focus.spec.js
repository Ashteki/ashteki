describe('Abundance focussed', function () {
    describe('Abundance focus 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'illusion', 'charm'],
                    hand: [],
                    spellboard: ['abundance', 'abundance']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('full damage choice reduces damage by 1', function () {
            let oppDeck = this.player2.deck.length;
            let deck = this.player1.deck.length;

            this.player1.clickCard(this.abundance);
            this.player1.clickPrompt('Abundance');
            this.player2.clickPrompt('2');
            // draw refused
            this.player1.clickPrompt('0');

            expect(this.player2.deck.length).toBe(oppDeck - 2);
            expect(this.player2.phoenixborn.damage).toBe(0);
            // damage taken but no draw
            expect(this.player1.deck.length).toBe(deck);
            expect(this.player1.phoenixborn.damage).toBe(1);
        });

        it('empty deck cannot draw, damage reduced', function () {
            this.player1.player.deck = [];

            this.player1.clickCard(this.abundance);
            this.player1.clickPrompt('Abundance');
            //this.player2.clickPrompt('2'); // chooses to draw 2 - will take damage as empty

            this.player2.clickPrompt('2'); // draw refused

            expect(this.player1.deck.length).toBe(0);
            expect(this.player1.phoenixborn.damage).toBe(1); // reduced by focus 1
        });
    });

    describe('Abundance focus 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'illusion', 'charm'],
                    hand: [],
                    spellboard: ['abundance', 'abundance', 'abundance']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('full damage choice reduces damage by 2', function () {
            let deck = this.player1.deck.length;

            this.player1.clickCard(this.abundance);
            this.player1.clickPrompt('Abundance');
            this.player2.clickPrompt('2');
            // draw refused
            this.player1.clickPrompt('0');

            // damage taken but no draw
            expect(this.player1.deck.length).toBe(deck);
            expect(this.player1.phoenixborn.damage).toBe(0);
        });

        it('empty deck cannot draw, damage reduced by 2', function () {
            this.player1.player.deck = [];

            this.player1.clickCard(this.abundance);
            this.player1.clickPrompt('Abundance');
            //this.player2.clickPrompt('2'); // chooses to draw 2 - will take damage as empty

            this.player2.clickPrompt('2'); // draw refused

            expect(this.player1.deck.length).toBe(0);
            expect(this.player1.phoenixborn.damage).toBe(0); // reduced by focus 1
        });
    });
});
