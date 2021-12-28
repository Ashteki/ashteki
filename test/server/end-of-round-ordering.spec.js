describe('End of round event', function () {
    describe('ordering when not active player', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'divine', 'divine', 'natural'],
                    archives: ['ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['brilliant-thorn', 'indiglow-creeper'],
                    spellboard: [],
                    archives: ['luminous-seedling']
                }
            });
        });

        it('should prompt the controller to resolve in order', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone(); // keep dice
            // these are player2 cards, so player 2 should have the prompt
            expect(this.player2).toHavePrompt('Choose Reaction order');
            this.player2.clickCard(this.brilliantThorn);
            this.player2.clickDone();
            expect(this.indiglowCreeper.location).toBe('archives');
            expect(this.brilliantThorn.location).toBe('archives');
        });
    });

    describe('no optional reaction abilities are allowed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    dicepool: ['natural', 'divine', 'divine', 'natural'],
                    archives: ['ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['brilliant-thorn', 'indiglow-creeper'],
                    spellboard: [],
                    archives: ['luminous-seedling']
                }
            });
        });

        it('should prompt the controller to resolve in order', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone(); // keep dice
            // these are player2 cards, so player 2 should have the prompt
            expect(this.player2).toHavePrompt('Choose Reaction order');
            this.player2.clickCard(this.brilliantThorn);
            this.player2.clickDone();
            expect(this.indiglowCreeper.location).toBe('archives');
            expect(this.brilliantThorn.location).toBe('archives');
        });
    });

    describe('fleeting vs admonisher as first player', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    dicepool: ['natural', 'divine', 'divine', 'natural'],
                    spellboard: ['law-of-grace']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['admonisher'],
                    spellboard: [],
                    archives: []
                }
            });
        });

        it('fleeting should trigger first and player1 is damaged', function () {
            expect(this.game.roundFirstPlayer.name).toBe(this.player1.name);
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone(); // keep dice

            expect(this.lawOfGrace.location).toBe('discard');
            expect(this.jessaNaNi.damage).toBe(1);
            expect(this.game.roundFirstPlayer.name).toBe(this.player2.name);
        });
    });

    describe('fleeting vs admonisher as second player', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    dicepool: ['natural', 'divine', 'divine', 'natural'],
                    inPlay: ['admonisher'],
                    spellboard: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    spellboard: ['law-of-grace']
                }
            });
        });

        it('fleeting should trigger second and player1 is NOT damaged', function () {
            expect(this.game.roundFirstPlayer.name).toBe(this.player1.name);
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone(); // keep dice

            expect(this.lawOfGrace.location).toBe('discard');
            expect(this.coalRoarkwin.damage).toBe(0); // because admonisher should have triggered before fleeting
            expect(this.game.roundFirstPlayer.name).toBe(this.player2.name);
        });
    });
});
