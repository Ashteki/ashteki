describe('law of Domination', function () {
    describe('in hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['law-of-domination', 'freezing-blast']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'holy-knight'],
                    spellboard: [],
                    hand: ['rins-fury'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('makes two units deal damage to each other without targetting', function () {
            this.player1.clickCard(this.lawOfDomination);
            this.player1.clickPrompt('Play this ready spell');
            expect(this.player2).toHavePrompt('choose a card');
            expect(this.player2).not.toBeAbleToSelect(this.ironWorker);
            expect(this.player2).toBeAbleToSelect(this.hammerKnight);
            expect(this.player2).toBeAbleToSelect(this.holyKnight); // ignores targetting restrictions
            this.player2.clickCard(this.hammerKnight);
            expect(this.player1).toHavePrompt('choose a card');
            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);
            this.player1.clickCard(this.ironWorker);
        });
    });

    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'natural', 'natural'],
                    hand: ['freezing-blast'],
                    spellboard: ['law-of-domination']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['frost-fang'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('stops fight damage from being prevented', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.frostFang);
            this.player1.clickCard(this.mistSpirit);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('No');
            expect(this.frostFang.location).toBe('discard');
        });

        it('does not stop direct damage prevention', function () {
            this.player1.clickDie(1);
            this.player1.clickPrompt('Natural Dice Power');
            this.player1.clickCard(this.frostFang);
            expect(this.frostFang.location).toBe('play area');
        });
    });

    describe('in play counter', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['frost-fang'],
                    dicepool: ['divine', 'natural'],
                    hand: ['freezing-blast'],
                    spellboard: ['law-of-domination']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('stops fight damage from being prevented', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.frostFang);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('Yes');
            expect(this.frostFang.location).toBe('discard');
        });
    });

    describe('in play yet exhausted, counter', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['frost-fang'],
                    dicepool: ['divine', 'natural'],
                    hand: ['freezing-blast'],
                    spellboard: ['law-of-domination']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['natural', 'natural']
                }
            });
            this.lawOfDomination.tokens.exhaustion = 1;
        });

        it("doesn't stop fight damage from being prevented", function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.frostFang);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('Yes');
            expect(this.frostFang.location).not.toBe('discard');
        });
    });
});
