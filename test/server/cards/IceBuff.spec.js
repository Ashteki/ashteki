describe('Rin Northfell', function () {
    describe('ice buff', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['mist-spirit'],
                    dicepool: ['natural', 'natural', 'natural', 'charm'],
                    spellboard: [],
                    archives: ['ice-buff']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker']
                }
            });
        });

        it('attaches to target card', function () {
            this.player1.clickCard(this.rinNorthfell); // play ability
            this.player1.clickPrompt('Ice Buff');
            this.player1.clickCard(this.mistSpirit); // attach to ms

            expect(this.mistSpirit.upgrades.length).toBe(1);
            expect(this.mistSpirit.life).toBe(2);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('nothing in archives', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['mist-spirit'],
                    dicepool: ['natural', 'natural', 'natural', 'charm'],
                    spellboard: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker']
                }
            });
        });

        it('no attachment', function () {
            this.player1.clickCard(this.rinNorthfell); // play ability
            this.player1.clickPrompt('Ice Buff');
            this.player1.clickCard(this.mistSpirit); // attach to ms

            expect(this.mistSpirit.upgrades.length).toBe(0);
            expect(this.mistSpirit.life).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
